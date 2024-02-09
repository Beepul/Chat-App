import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { User } from '../../types/UserType'
import { useChatState } from '../../context/ChatProvider'
import { TAxiosError } from '../../types/ErrorType'
import UserListItem from '../UserAvatar/UserListItem'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import beeAxios from '../../config/axiosConfig'


type GroupChatModalProps = {
  children: React.ReactNode
}
const GroupChatModal: React.FC<GroupChatModalProps> = ({children}) => {
  const [groupChatName, setGroupChatName] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState<User[]>([])
  const [loading, setLoading] = useState(false)

  const toast = useToast()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const {user,chats,setChats,darkTheme} = useChatState()
  

  const handleSearch = async (query: string) => {
    setSearch(query)
    if(!query){
      return
    }
    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      }
      const {data} = await beeAxios.get(`/api/v1/user?search=${search}`, config)

      setLoading(false)
      setSearchResult(data.users)
    } catch (error) {
      const axiosError = error as TAxiosError
      toast({
        title: 'Error Occured!',
        description: axiosError.response.data?.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left'
      })
    }
  }

  const handleSubmit = async () => {
    if(!groupChatName || !selectedUsers){
      toast({
        title: 'Please fill all the feilds',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top'
      })
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      }
      const {data} = await beeAxios.post('/api/v1/chat/group', {
        name: groupChatName, 
        users: selectedUsers
      },config)
      setChats([data.groupChat, ...chats])
      onClose()
      toast({
        title: 'Group Chat Created Successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left'
      })
    } catch (error) {
      const axiosError = error as TAxiosError
      toast({
        title: 'Error Occured!',
        description: axiosError.response.data?.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left'
      })
    }
  }

  const handleGroup = (addToUser: User) => {
    if(selectedUsers.includes(addToUser)){
      toast({
        title: 'User already added',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top'
      })
      return
    }
    setSelectedUsers([...selectedUsers,addToUser])
  }
  
  const handleDelete = (delUser: User) => {
    setSelectedUsers(selectedUsers.filter(selUser => selUser._id !== delUser._id))
  }

  return (
    <>
    <span onClick={onOpen}>{children}</span>

    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent backgroundColor={darkTheme ? '#171718' : 'white'}>
        <ModalHeader fontSize={'35px'} fontFamily={'Work sans'} color={darkTheme ? 'white' : 'black'} display={'flex'} justifyContent={'center'}>Create Group Chat</ModalHeader>
        <ModalCloseButton color={darkTheme ? 'white' : 'black'}/>
        <ModalBody
        display={'flex'}
        flexDir={'column'}
        alignItems={'center'}
        >
          <FormControl>
            <Input 
            placeholder='Chat Name'
            mb={3}
            onChange={(e) => setGroupChatName(e.target.value)}
            color={darkTheme ? 'white' : 'black'}
            />
          </FormControl>
          <FormControl>
            <Input 
            placeholder='Add Users eg: John, Jane'
            mb={1}
            onChange={(e) => handleSearch(e.target.value)}
            color={darkTheme ? 'white' : 'black'}
            />
          </FormControl>
          {/* seledted users */}
          <Box
          display={'flex'}
          alignItems={'center'}
          gap={2}
          flexWrap={'wrap'}
          width={'100%'}
          >
            {
              selectedUsers.map((u) => (
                <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
              ))
            }
          </Box>
          {/* render searched users */}
          {loading ? <div>Loading...</div> : (
            searchResult?.slice(0,4).map((u) => (
              <UserListItem user={u} key={u._id} handleFunction={() => handleGroup(u)} />
            ))
          )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' onClick={handleSubmit}>
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    </>
  )
}

export default GroupChatModal