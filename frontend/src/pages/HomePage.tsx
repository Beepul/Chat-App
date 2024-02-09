import { useEffect } from 'react'
import Header from '../components/public/Header'
import { Link, useNavigate } from 'react-router-dom'
import { Box, Button, Heading, Image, Text } from '@chakra-ui/react'
import bannerOne from '../assets/ban-1.png'
import { FaArrowRightLong } from "react-icons/fa6";

const HomePage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const userDataString = localStorage.getItem('userInfo') ;

    let userData = null
    if(userDataString){
      userData = JSON.parse(userDataString)
    }
  
    if (userData) {
      navigate('/chats');
    }
  }, []);
  return (
    <div className='home__page'>
      <Header />
      <Box
      display={'flex'}
      flexDir={{base: 'column',lg: 'row'}}
      >
        <Box
        flex={1}
        
        >
          <Box
            display={'flex'}
            flexDir={'column'}
            justifyContent={'center'}
            minHeight={'100vh'}
            maxWidth={{base: '100%',lg:'50vw'}}
            marginLeft={'auto'}
            backgroundColor={'#92b7e9'}
            height={'100%'}
            padding={{base: '150px 30px 100px 30px', lg: '50px 50px 50px 150px'}}
          >
            <Heading
            mb={4}
            >Always Connected!</Heading>
            <Text
            mb={10}
            >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam imperdiet dolor neque, ac convallis dolor mollis et. Maecenas mollis bibendum magna.</Text>
            <Link to={'/start'}
            style={{
              width: 'fit-content'
            }}
            >
              <Button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              >
                Get Started
                <FaArrowRightLong />
              </Button>
            </Link>
          </Box>
        </Box>
        <Box
          flex={1}
          minHeight={{base:'500px',lg:'100vh'}}
          backgroundColor={'#DBC81B'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Image loading='lazy' src={bannerOne} alt='Rapid chat' />
        </Box>
      </Box>
    </div>
  )
}

export default HomePage