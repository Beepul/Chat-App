import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { FaRegEye } from "react-icons/fa";
import { useChatState } from '../../context/ChatProvider';
import { User } from '../../types/UserType';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import { TAxiosError } from '../../types/ErrorType';
import UserListItem from '../UserAvatar/UserListItem';
import beeAxios from '../../config/axiosConfig';

type UpdateGroupChatModalProps = {
    fetchAgain: boolean;
    setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
    fetchMessages: () => void
}

const UpdateGroupChatModal: React.FC<UpdateGroupChatModalProps> = ({fetchAgain, setFetchAgain, fetchMessages}) => {
    const [groupChatName, setGroupChatName] = useState('')
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)

    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    const {selectedChat, setSelectedChat, user, darkTheme} = useChatState()

    const handleRemove = async (userToRemove: User | null) => {
        if(selectedChat?.groupAdmin._id !== user?._id && userToRemove?._id !== user?._id){
            toast({
                title: 'Only admin can remove someone!',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            return
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                  Authorization: `Bearer ${user?.token}`
                }
              }
            const {data} = await beeAxios.put(`/api/v1/chat/group/remove-user`, {
                chatId: selectedChat?._id,
                userId: userToRemove?._id
            } ,config)
        
            userToRemove?._id === user?._id ? setSelectedChat(null) : setSelectedChat(data.groupChat)
            setFetchAgain(!fetchAgain)
            fetchMessages()
            setLoading(false)
        } catch (error) {
            setLoading(false)
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
    const handleLeave = async (userToRemove: User | null) => {
        if(selectedChat?.groupAdmin._id !== user?._id && userToRemove?._id !== user?._id){
            toast({
                title: 'Only admin can remove someone!',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            return
        }
        if(selectedChat?.groupAdmin._id === userToRemove?._id){
            toast({
                title: 'Admin cannot leave the group!',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            return
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                  Authorization: `Bearer ${user?.token}`
                }
              }
            const {data} = await beeAxios.put(`/api/v1/chat/group/leave`, {
                chatId: selectedChat?._id
            } ,config)
        
            userToRemove?._id === user?._id ? setSelectedChat(null) : setSelectedChat(data.groupChat)
            setFetchAgain(!fetchAgain)
            setLoading(false)
        } catch (error) {
            setLoading(false)
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
 
    const handleRename = async () => {
        if(!groupChatName) return
        try {
            setRenameLoading(true)
            const config = {
                headers: {
                  Authorization: `Bearer ${user?.token}`
                }
            }
            const {data} = await beeAxios.put('/api/v1/chat/group/rename',{  
                    chatId: selectedChat?._id, 
                    chatName: groupChatName
                }, config)
            setSelectedChat(data.groupChat)
            setFetchAgain(!fetchAgain);
            setRenameLoading(false)
        } catch (error) {
            setGroupChatName('')
            setRenameLoading(false)
            const axiosError = error as TAxiosError
            toast({
                title: 'Failed to rename chats!',
                description: axiosError.response.data?.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-left'
            })
        }
    }

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
            setLoading(false)
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

    const handleAddUser =  async (userToAdd: User) => {
        if(selectedChat?.users.find((u) => u._id === userToAdd._id)){
            toast({
                title: 'User Already In Group',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            return
        }
        if(selectedChat?.groupAdmin._id !== user?._id){
            toast({
                title: 'Only admin can add someone!',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            return
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                  Authorization: `Bearer ${user?.token}`
                }
              }
            const {data} = await beeAxios.put(`/api/v1/chat/group/add-user`, {
                chatId: selectedChat?._id,
                userId: userToAdd._id
            } ,config)
        
            setSelectedChat(data.groupChat)
            setFetchAgain(!fetchAgain)
            setLoading(false)
        } catch (error) {
            setLoading(false)
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
    
  return (
    <>
        <IconButton 
        aria-label='icon-button'
        display={{base: 'flex'}}
        icon={<FaRegEye />}
        onClick={onOpen}
        />
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent backgroundColor={darkTheme ? '#171718' : 'white'}>
            <ModalHeader
            fontSize={'35px'}
            fontFamily={'Work sans'}
            display={'flex'}
            justifyContent={'center'}
            color={darkTheme ? 'white' : 'black'}
            textTransform={'capitalize'}
            >{selectedChat?.chatName}</ModalHeader>
            <ModalCloseButton color={darkTheme ? 'white' : 'black'} />
            <ModalBody>
                <Box
                w={'100%'}
                display={'flex'}
                flexWrap={'wrap'}
                pb={3}
                >
                    {selectedChat?.users.map((u) => (
                        <UserBadgeItem 
                            key={u?._id}
                            user={u}
                            handleFunction={() => handleRemove(u)}
                        />
                    ))}
                </Box>
                <FormControl display={'flex'}>
                    <Input placeholder='Chat Name' mb={3} value={groupChatName} 
                    onChange={(e) => setGroupChatName(e.target.value)}
                    color={darkTheme ? 'white' : 'black'}
                    />
                    <Button
                    variant={'solid'}
                    colorScheme='teal'
                    ml={1}
                    isLoading={renameLoading}
                    onClick={handleRename}
                    >Update</Button>
                </FormControl>
                <FormControl>
                    <Input 
                    placeholder='Add Users eg: John, Jane'
                    mb={1}
                    onChange={(e) => handleSearch(e.target.value)}
                    color={darkTheme ? 'white' : 'black'}
                    />
                </FormControl>
                {loading ? <Spinner size={'lg'} /> : (
                    searchResult?.slice(0,4).map((u) => (
                    <UserListItem user={u} key={u._id} handleFunction={() => handleAddUser(u)} />
                    ))
                )}
            </ModalBody>

            <ModalFooter>
                <Button colorScheme='red' onClick={() => handleLeave(user)}>
                        Leave Group
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    </>
  )
}

export default UpdateGroupChatModal