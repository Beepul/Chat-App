import { Button } from '@chakra-ui/button'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input'
import { VStack } from '@chakra-ui/layout'
import { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios, { AxiosError } from 'axios'
import { useNavigate } from 'react-router'
import { TAxiosError } from '../../types/ErrorType'

const Signup = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [pic, setPic] = useState('')
    const [show, setShow] = useState(false)
    const toast = useToast()

    const navigate = useNavigate()

    const postDetails = async (e:  React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement
        const file: File | undefined = target.files?.[0]
        if(file === undefined){
            toast({
                title: 'Please select an image',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            return
        }
        if(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'){
            setLoading(true)
            try {
                const data = new FormData()
                data.append('pic', file)
                const res = await axios.post('api/v1/user/upload-img', data , {
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                })
                console.log(res)
                setPic(res.data.image.url)
                setLoading(false)
            } catch (error) {
                console.log(error)
                const axiosError = error as TAxiosError
                setLoading(false)
                toast({
                    title: axiosError.response?.data?.message || 'An Error Occured While Uploading Image',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom'
                })
            }
            
        } else {
            setLoading(false)
            toast({
                title: 'Please Select Valid Image Type',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
        }
    }

    const submitHandler = async () => {
        setLoading(true)
        if(!name || !email || !password || !confirmPassword || !pic){
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
        if(password !== confirmPassword){
            toast({
                title: 'Password doesnot match',
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
            const {data} = await axios.post('api/v1/user', {name, email, password, pic}, config)
            console.log(data)
            setLoading(false)
            toast({
                title: 'Sign Up Seccessful',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            localStorage.setItem('userInfo', JSON.stringify(data.user))
            setLoading(false)
            window.location.reload()
            // navigate('/chats')
        } catch (error: unknown) {
            const axiosError = error as TAxiosError
            console.log(axiosError)
            setLoading(false)
            toast({
                title: 'An Error Occured While Sign Up',
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
        <FormControl id='first-name' isRequired>
            <FormLabel>Name</FormLabel>
            <Input placeholder='Enter Your Name' onChange={(e)=> setName(e.target.value)} />
        </FormControl>
        <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
            <Input placeholder='Enter Your Email' onChange={(e)=> setEmail(e.target.value)} />
        </FormControl>
        <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input placeholder='Enter Your Password' type={show ? 'text' : 'password'} onChange={(e)=> setPassword(e.target.value)} />
                <InputRightElement width={'4.5rem'}>
                    <Button h='1.75rem' size={'sm'} onClick={() => setShow((prev) => !prev)}>{show ? 'Hide' : 'Show'}</Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id='confirm-password' isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
                <Input placeholder='Enter Your Password' type={show ? 'text' : 'password'} onChange={(e)=> setConfirmPassword(e.target.value)} />
                <InputRightElement width={'4.5rem'}>
                    <Button h='1.75rem' size={'sm'} onClick={() => setShow((prev) => !prev)}>{show ? 'Hide' : 'Show'}</Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id='pic'>
            <FormLabel>Upload your picture</FormLabel>
            <Input type='file' p={1.5} accept='image/*' onChange={postDetails} />
        </FormControl>
        <Button colorScheme='blue' width={'100%'} isLoading={loading} style={{marginTop: 15}} onClick={submitHandler}>Sign Up</Button>
        
    </VStack>
  )
}

export default Signup