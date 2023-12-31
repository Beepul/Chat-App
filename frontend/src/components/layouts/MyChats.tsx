import React, { useEffect, useState } from 'react'
import { useChatState } from '../../context/ChatProvider'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react'
import { TAxiosError } from '../../types/ErrorType'
import ChatLoading from './ChatLoading'
import { getSenderName } from '../../config/chatLogics'
import { User } from '../../types/UserType'
import GroupChatModal from '../miscellaneous/GroupChatModal'
import { FaPlus } from "react-icons/fa6";
import beeAxios from '../../config/axiosConfig'

type MyChatsProps = {
  fetchAgain: boolean;
}

const MyChats: React.FC<MyChatsProps> = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState<User>({
    _id: '',
    name: '',
    email: '',
    pic: '',
    token: ''
  })
  const {selectedChat, setSelectedChat, user, chats, setChats, darkTheme} = useChatState()

  const toast = useToast()

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      }
      const {data} = await beeAxios.get('/api/v1/chat', config)
      setChats(data.chats)
    } catch (error: unknown) {
      const axiosError = error as TAxiosError
      toast({
        title: 'Failed to access all chats!',
        description: axiosError.response.data?.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-left'
      })
    }
  }

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo')
    if(userInfo){
      setLoggedUser(JSON.parse(userInfo))
    }
    fetchChats()
  },[fetchAgain])

  return (
    <Box
    display={{base: selectedChat ? 'none' : 'flex', md: 'flex'}}
    flexDir={'column'}
    alignItems={'center'}
    p={3}
    bg={darkTheme ?  '#171718' :'white'}
    w={{base: '100%', md: '31%'}}
    borderRadius={'lg'}
    borderWidth={'5px'}
    borderColor={darkTheme ? '#171718' : '#E0E6EE'}
    transition={'all ease 0.35s'}
    >
      <Box
      pb={3}
      px={3}
      fontSize={{base: '24px', md: '30px'}}
      fontFamily={'Work sans'}
      display='flex'
      justifyContent={'space-between'}
      alignItems={'center'}
      color={darkTheme ? 'white' : 'black'}
      width={'100%'}
      flexWrap={'wrap'}
      transition={'all ease 0.35s'}
      >
        My Chats
        <GroupChatModal>
          <Button
          display={'flex'}
          
          fontSize={{base: '17px', md: '10px', lg: '17px'}}
          rightIcon={<FaPlus />}
          >New Group Chat</Button>
        </GroupChatModal>
      </Box>
      <Box
      display={'flex'}
      flexDir={'column'}
      px={3}
      py={4}
      bg={darkTheme ? '#2b2b31' : '#F8F8F8'}
      w={'100%'}
      h={'100%'}
      borderRadius={'lg'}
      overflow={'hidden'}
      transition={'all ease 0.35s'}
      >
        {chats ? (
          <Stack overflowY={'scroll'} gap={3}>
            {chats.map((chat) => (
              <Box
              onClick={() => setSelectedChat(chat)}
              cursor={'pointer'}
              bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
              color={selectedChat === chat ? 'white' : 'black'}
              px={3}
              py={3}
              borderRadius={'lg'}
              key={chat._id}
              transition={'all ease 0.35s'}
              >
                <Text
                textTransform={'capitalize'}
                >
                  {!chat.isGroupChat ? (
                    getSenderName(loggedUser, chat.users)
                  ) : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ): (
          <ChatLoading />
        )}
      </Box>
      
    </Box>
  )
}

export default MyChats