import { Box, Button } from '@chakra-ui/react'
import Lottie from 'lottie-react'
import { useNavigate } from 'react-router-dom'
import animationData from '../assets/animations/404.json'

const NotFound = () => {
  const navigate = useNavigate()
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
        animationData={animationData}
        loop={true}
        autoplay={true}
        rendererSettings={{
          preserveAspectRatio: "xMidYMid slice",
        }}
        width={300}
        height={300}
        style={{maxHeight:'70vh', maxWidth: '600px'}}
      />
      </Box>
      <Button
      onClick={() => navigate(-1)}
      >Go Back</Button>
    </Box>
  )
}

export default NotFound