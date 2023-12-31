import { Button } from '@chakra-ui/button'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input'
import { VStack } from '@chakra-ui/layout'
import { useToast } from '@chakra-ui/toast'
import { useState } from 'react'
import { TAxiosError } from '../../types/ErrorType'
import { useNavigate } from 'react-router'
import beeAxios from '../../config/axiosConfig'
import { useChatState } from '../../context/ChatProvider'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)

    const {setUser} = useChatState()

    const toast = useToast()
    const navigate = useNavigate()

    const submitHandler =  async () => {
        setLoading(true)
        if(!email || !password){
            toast({
                title: 'Please fill all the fields',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            setLoading(false)
            return
        }
        try {
            const config = {
                headers: {
                    'Content-type': 'application/json'
                }
            }
            const {data} = await beeAxios.post('/api/v1/user/login', {email, password}, config)
            setLoading(false)
            toast({
                title: 'Login Successful',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            setUser(data.user)
            localStorage.setItem('userInfo', JSON.stringify(data.user))
            setLoading(false)
            navigate('/chats')
        } catch (error: unknown) {
            const axiosError = error as TAxiosError
            setLoading(false)
            toast({
                title: 'An Error Occured While Login',
                description: axiosError.response?.data?.message || 'Please try again',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
        }
    }
  return (
    <VStack spacing={'18px'}>
        <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
            <Input placeholder='Enter Your Email' value={email} onChange={(e)=> setEmail(e.target.value)} />
        </FormControl>
        <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input placeholder='Enter Your Password' value={password} type={show ? 'text' : 'password'} onChange={(e)=> setPassword(e.target.value)} />
                <InputRightElement width={'4.5rem'}>
                    <Button h='1.75rem' size={'sm'} onClick={() => setShow((prev) => !prev)}>{show ? 'Hide' : 'Show'}</Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <Button 
            backgroundColor='#70c3d6' 
            color={'white'}
            _hover={{
                backgroundColor:'#39a0b7' 
            }}
            transition={'all ease 0.35s'}
        width={'100%'} style={{marginTop: 15}} isLoading={loading} onClick={submitHandler}>Login</Button>
        <Button colorScheme='blue' width={'100%'} style={{marginTop: 10}} disabled={loading} onClick={() => {
            setEmail('sam@gmail.com')
            setPassword('password')
        }}>Get Guest User Credentials</Button>
    </VStack>
  )
}

export default Login