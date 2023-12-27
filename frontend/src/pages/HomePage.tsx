import { Box, Container, Text } from '@chakra-ui/layout';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/tabs';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const HomePage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('userInfo')
   
    if(userData){
        const userInfo = JSON.parse(userData)

        if(userInfo){
            navigate('/chats')
        }
    }

  },[navigate])
	return (
		<Container maxW={'xl'} centerContent>
			<Box
				display="flex"
				justifyContent={'center'}
				padding={3}
				bg={'white'}
				m={'40px 0 15px 0'}
				borderRadius={'lg'}
				borderWidth={'1px'}
        width={'100%'}
			>
				<Text fontSize="xx-large"  fontFamily={'Work sans'} color={'black'}>
					Talk-A-Tive
				</Text>
			</Box>
			<Box bg={'white'} w={'100%'} textColor={'black'} borderRadius={'lg'} borderWidth={'1px'}>
				<Tabs variant="soft-rounded">
					<TabList p={4}>
						<Tab width={'50%'} p={3}>Login</Tab>
						<Tab width={'50%'} p={3}>Sign Up</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<Login />
						</TabPanel>
						<TabPanel>
							<Signup />
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Box>
		</Container>
	);
};

export default HomePage;
