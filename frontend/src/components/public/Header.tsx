import { Box, Image, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { FaArrowRightLong } from "react-icons/fa6";

const Header = () => {
  return (
    <Box
    background={'rgba(255, 255, 255, 0.15)'}
    boxShadow={'0 4px 30px rgba(0, 0, 0, 0.1)'}
    backdropFilter={'blur(5px)'}
    position={'absolute'}
    top={0}
    left={0}
    right={0}
    >
        <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        padding={'20px 12px'}
        maxWidth={'1270px'}
        margin={'0 auto'}
        >
            <Link to={'/'}>
                <Box
                display={'flex'}
                alignItems={'center'}
                gap={'12px'}
                >
                    <Image 
                    src={logo} 
                    alt='Rapid Chat'
                    maxWidth={'46px'}
                    />
                    <Text
                    fontSize={'2xl'}
                    fontFamily={'Work sans'}
                    color={'white'}
                    >RapidChat</Text>
                </Box>
            </Link>
            <Link to={'/start'}
                className='get-started'
                
            >
                Get Started
                <FaArrowRightLong 
                    style={{
                        fontWeight: '300',
                        color: '#7c7c7c'
                    }}
                />
            </Link>
        </Box>
    </Box>
  )
}

export default Header