import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, IconButton, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import { useState } from 'react'
import { IoSearch } from "react-icons/io5";
import { FaBell } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";
import { useChatState } from '../../context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import { TAxiosError } from '../../types/ErrorType';
import { User } from '../../types/UserType';
import ChatLoading from '../layouts/ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSenderName } from '../../config/chatLogics';
import { LuSunDim } from "react-icons/lu";
import { IoMoonOutline } from "react-icons/io5";
import beeAxios from '../../config/axiosConfig';
import { socket } from '../../config/socketConfig';


const ChatNavBar = () => {
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState(false)

  const { isOpen, onOpen, onClose } = useDisclosure()

  const {user,setUser, setSelectedChat, chats, setChats, notification, setNotification , darkTheme , setDarkTheme} = useChatState()
  const navigate = useNavigate()

  const toast = useToast()

  const logoutHandler = () => {
    setUser(null)
    setSelectedChat(null)
    localStorage.removeItem('userInfo')
    socket.disconnect()
    navigate('/')
  }

  const handleSearch = async () => {
    if(!search){
      toast({
        title: 'Please Enter Something in Search',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left'
      })
    }
    try {
      setLoading(true)
      const config = {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      }
      const {data} = await beeAxios.get(`/api/v1/user?search=${search}`, config)
      setLoading(false)
      setSearchResult(data.users)
    } catch (error: unknown) {
      setLoading(false)
      const axiosError = error as TAxiosError
      toast({
        title: 'Failed To Search User',
        description: axiosError.response.data?.message,
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left'
      })
    }
  }

  const accessChat = async (userId: string) => {

    try {
      setLoadingChat(true)
      const config = {
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        }
      }

      const {data} = await beeAxios.post('/api/v1/chat', {userId}, config)

      if(!chats.find((chat) => chat._id === data._id)) setChats([data.chat,...chats])
      setSelectedChat(data.chat)
      setLoadingChat(false)
      onClose()
    } catch (error) {
      setLoadingChat(false)
      const axiosError = error as TAxiosError

      toast({
        title: 'Failed to access chat!',
        description: axiosError.response.data?.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-left'
      })
    }
  }

 
  return (
    <>
      <Box
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      backgroundColor={darkTheme ? '#171718' : 'white'}
      transition={'all ease 0.3s'}
      w={'100%'}
      p={'5px 25px 5px 10px'}
      borderWidth={'5px'}
      borderColor={darkTheme ? '#171718' : '#E0E6EE'}
      maxWidth={'1270px'}
      margin={'0 auto'}
      borderRadius={'8px'}
      >
        <Tooltip label='search user to chat' hasArrow placement='bottom-end'>
          <Button variant={'ghost'} onClick={onOpen} _hover={{backgroundColor: darkTheme ? '#2B2B31' : '#EDF2F7'}}>
            <IoSearch
              style={{color: `${darkTheme ? 'White' : 'black'}`, transition: 'all ease 0.35s'}}
            />
            <Text display={{base: 'none', md: 'flex'}} px={4} color={darkTheme ? 'white' : 'black'}>Search User</Text>  
          </Button>
        </Tooltip>
        <Text fontSize={'2xl'} fontFamily={'Work sans'}
        color={darkTheme ? 'white' : 'black'}
        transition={'all ease 0.35s'}
        display={{base: 'none', sm: 'block'}}
        >Rapid Chat</Text>
        <Box display={'flex'} alignItems={'center'} gap={'8px'}>
          <IconButton 
            aria-label='theme-mode' 
            icon={darkTheme ? <IoMoonOutline style={{color: 'white'}} /> : <LuSunDim />} 
            backgroundColor={'transparent'}
            _hover={{backgroundColor: 'transparent'}}
            _focus={{border: 0, outline: 'none', boxShadow: 'none' }}
            onClick={() => setDarkTheme(!darkTheme)}
          />
          <Menu>
            <MenuButton p={1}
            style={{
              position: 'relative'
            }}
            >
              {
                notification.length > 0 && (
                  <span
                  style={{
                    backgroundColor:"#D9110C",
                    padding: '1px 8px',
                    borderRadius: '16px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '10px',
                    color: 'white',
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px'
                  }}
                  >{notification.length}</span>
                )
              }
              <FaBell 
                style={{color: darkTheme ? 'white' : 'black'}}
              />
            </MenuButton>
            <MenuList
            pl={2}
            pr={2}
            >
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem key={notif._id} onClick={() => {
                  setSelectedChat(notif.chat)
                  setNotification(notification.filter((n) => n !== notif))
                }}>
                  {notif.chat.isGroupChat ? `New Message in ${notif.chat.chatName}` 
                  : `New Message from ${getSenderName(user,notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} background={'transparent'} _hover={{background: 'transparent'}} _focus={{background: 'transparent'}} pr={0} pl={1} rightIcon={<FaChevronDown style={{fontSize: '12px', color: darkTheme ? 'white' : '#3e3e3e'}} />}>
              <Avatar size={'sm'} cursor={'pointer'} name={user?.name}  src={user?.pic}/>
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>
      <Drawer placement='left' onClose={onClose} isOpen={isOpen}  >
        <DrawerOverlay />
        <DrawerContent backgroundColor={darkTheme ? '#171718' : 'white'}>
          <DrawerHeader borderBottomWidth='1px' color={darkTheme ? 'white' : 'black'}>Search User</DrawerHeader>
          <DrawerBody>
            <Box
              display={'flex'}
              paddingBottom={'2px'}
              mb={'6px'}
            >
              <Input placeholder='Search by name or email' mr={2} color={darkTheme ? 'white' : 'black'} value={search} onChange={(e) => setSearch(e.target.value)}/>
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading? (
              <ChatLoading />
            ): (
              searchResult.map((user) => (
                <UserListItem  key={user._id} user={user} handleFunction={() => accessChat(user._id)}/>
              ))
            )}
            {loadingChat && <Spinner  ml={'auto'} display={'flex'}/>}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default ChatNavBar