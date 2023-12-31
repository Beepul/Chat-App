import { Box, Button } from '@chakra-ui/react'
import Lottie from 'react-lottie'
import { useNavigate } from 'react-router-dom'
import animationData from '../assets/animations/404.json'

const NotFound = () => {
  const navigate = useNavigate()
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };
  return (
    <Box
    display={'flex'}
    flexDir={'column'}
    alignItems={'center'}
    justifyContent={'center'}
    minHeight={'100vh'}
    >
      <Box
      maxHeight={'70vh'}
      >
        <Lottie 
        style={{maxHeight:'70vh', maxWidth: '600px'}}
        options={defaultOptions}
        />
      </Box>
      <Button
      onClick={() => navigate(-1)}
      >Go Back</Button>
    </Box>
  )
}

export default NotFound