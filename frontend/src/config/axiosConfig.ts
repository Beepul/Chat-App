import axios, { AxiosInstance } from "axios";
import { TAxiosError } from "../types/ErrorType";

const beeAxios: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    timeout: 5000
})

const logoutUser = () => {
    // console.log('Your token has expired please login!')
    localStorage.removeItem('userInfo')
    window.location.href = '/start';
}

const refreshAccessToken = async () => {
    try {
        // console.log('Trying to get new access token')
        const res = await beeAxios.get('api/v1/user/refresh', {
            withCredentials: true 
        })
        const userData = localStorage.getItem('userInfo')
        if(userData){
            let userInfo = JSON.parse(userData) || null 
            if(userInfo){
                userInfo.token = res.data.token 
                localStorage.setItem('userInfo', JSON.stringify(userInfo))
            }
        }
        return res.data.token 
    } catch (error) {
        throw error
    }
}


beeAxios.interceptors.response.use((response) => response,async (error:unknown) => {
    const axiosError = error as TAxiosError
    if(axiosError.response && axiosError.response.status === 401 && !axiosError.config._retry){
        axiosError.config._retry = true;
        try {
            const newAccessToken = await refreshAccessToken()
            axiosError.config.headers['Authorization'] = `Bearer ${newAccessToken}`
            return beeAxios(axiosError.config)
        } catch (refreshError) {
            // console.log('Error refetching access token | refresh error:: ', refreshError)
            logoutUser()
            throw refreshError
        }
    }
    return Promise.reject(axiosError)
})

export default beeAxios