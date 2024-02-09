import { Box, Container } from '@chakra-ui/layout';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/tabs';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import Header from '../components/public/Header';

const StartPage = () => {
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
		<div>
			<Header />
			<div className='start-page'>
				<Container maxW={'xl'} centerContent
				>
					<Box bg={'white'} mt={'130px'} w={'100%'} textColor={'black'} borderRadius={'lg'} borderWidth={'1px'}>
						<Tabs variant="soft-rounded" p={5}>
							<TabList p={4}>
								<Tab width={'50%'} p={3} _selected={{backgroundColor:'#70c3d6', color: 'white'}}>Login</Tab>
								<Tab width={'50%'} p={3} _selected={{backgroundColor:'#70c3d6',color: 'white'}}>Sign Up</Tab>
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
			</div>
		</div>
	);
};

export default StartPage;
