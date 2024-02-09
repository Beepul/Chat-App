import React, { useEffect, useRef, useState } from 'react'
import { useChatState } from '../../context/ChatProvider';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { FaArrowLeftLong } from "react-icons/fa6";
import { getFullSender, getSenderName } from '../../config/chatLogics';
import ProfileModal from '../miscellaneous/ProfileModal';
import UpdateGroupChatModal from '../miscellaneous/UpdateGroupChatModal';
import { TAxiosError } from '../../types/ErrorType';
import ScrollableChat from './ScrollableChat';
import { Message } from '../../types/MessageType';
import {socket} from '../../config/socketConfig'
import { ChatType } from '../../types/ChatType';
import Lottie from 'lottie-react';
import animationData from '../../assets/animations/typing.json';
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker, { EmojiClickData, EmojiStyle } from 'emoji-picker-react';
import { Theme } from 'emoji-picker-react';
import beeAxios from '../../config/axiosConfig';

type SingleChatProps = {
    fetchAgain: boolean;
    setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>
}

let selectedChatCompare: ChatType | null

const SingleChat: React.FC<SingleChatProps> = ({fetchAgain, setFetchAgain}) => {
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState('')
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [showEmoji, setShowEmoji] = useState(false)
    const [cursorPosition, setCursorPosition] = useState(0)

    const {user, selectedChat, setSelectedChat, notification, setNotification, darkTheme} = useChatState()

    const toast = useToast()

    const fetchMessages = async () => {
        if(!selectedChat){
            return
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            }
            const {data} = await beeAxios.get(`/api/v1/message/${selectedChat._id}`, config)
            setMessages(data.message)
            setLoading(false)
            socket.emit('join__chat', selectedChat._id)
        } catch (error) {
            setLoading(false)
            const axiosError = error as TAxiosError
            toast({
                title: 'Failed to fetch messages',
                description: axiosError.response.data?.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
        }
    }

    const sendMessage = async (e: any) => {
        if(e.key === 'Enter' && newMessage){
            setShowEmoji(false)
            socket.emit('stop__typing', selectedChat?._id)
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user?.token}`
                    }
                }
                const {data} = await beeAxios.post('/api/v1/message', {
                    content: newMessage,
                    chatId: selectedChat?._id
                } ,config)
                setNewMessage('')
                socket.emit('send__message', data.message)
                setMessages([...messages, data.message])
            } catch (error) {
                const axiosError = error as TAxiosError
                toast({
                    title: 'Failed to send message',
                    description: axiosError.response.data?.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom'
                })
            }
        }
    }

    const typingHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value)

        // typing indicator logic
        if(!socketConnected) return

        if(!typing){
            setTyping(true)
            socket.emit('typing', selectedChat?._id)
        }

        let lastTypingTime = new Date().getTime()
        let timerLength = 3000
        setTimeout(() => {
            let timeNow = new Date().getTime()
            let timeDiff = timeNow - lastTypingTime

            if(timeDiff >= timerLength && typing){
                socket.emit('stop__typing', selectedChat?._id)
                setTyping(false)
            }
        }, timerLength)
    }

    let msgInput = useRef<HTMLInputElement | null>(null)

    const handleShowEmoji = () => {
        msgInput.current?.focus()
        setShowEmoji(!showEmoji)
    }

    const pickEmoji = (emoji: EmojiClickData, event: MouseEvent) => {
        console.log('Emoji',event)
        if(msgInput.current){
            msgInput.current.focus()
            if(emoji && emoji.emoji){
                const codePoint = emoji.emoji.codePointAt?.(0);
        
                if (codePoint !== undefined) {
                    let hexEmoji = codePoint.toString(16);
                    let emo = String.fromCodePoint(Number('0x' + hexEmoji));

                    const start = newMessage.substring(0, msgInput.current.selectionStart ?? 0);
                    const end = newMessage.substring(msgInput.current.selectionEnd ?? 0);

                    const msg = start + emo + end;
                    setNewMessage(msg);
                    setCursorPosition(start.length + emo.length);
                }
            }
        }
    }
    
    useEffect(() => {
        msgInput.current?.setSelectionRange(cursorPosition, cursorPosition)
    },[cursorPosition])

    useEffect(() => {
        fetchMessages()
        selectedChatCompare = selectedChat
    },[selectedChat])

    useEffect(() => {
        socket.on('recieved__message', (newMessage) => {
            if(!selectedChatCompare || selectedChatCompare._id !== newMessage.chat._id){
                // give notification
                if(!notification.includes(newMessage)){
                    setNotification([newMessage, ...notification])
                    setFetchAgain(!fetchAgain)
                }
            }else{
                setMessages([...messages, newMessage])
                return
            }
        })
    })

    useEffect(() => {
        socket.connect()
        socket.emit('setup', user)
        socket.on('connected', () => setSocketConnected(true))
        socket.on('typing', () => setIsTyping(true))
        socket.on('stop__typing', () => setIsTyping(false))
    },[selectedChat])

    
  return (
    <>
        {selectedChat ? (
            <>
                <Text
                fontSize={{base: '28px', md: '30px'}}
                pb={3}
                px={2}
                w={'100%'}
                fontFamily={'Work sans'}
                display={'flex'}
                justifyContent={{base: 'space-between'}}
                alignItems={'center'}
                color={darkTheme ? 'white' : 'black'}
                textTransform={'capitalize'}
                >
                    <IconButton 
                        aria-label='back-icon'
                        display={{base: 'flex', md: 'none'}}
                        icon={<FaArrowLeftLong />}
                        onClick={() => setSelectedChat(null)}
                    />
                    {!selectedChat.isGroupChat ? (
                        <>
                            {getSenderName(user,selectedChat.users)}
                            <ProfileModal user={getFullSender(user,selectedChat.users)}/>
                        </>
                    ) : (
                        <>
                            {selectedChat.chatName}
                            <UpdateGroupChatModal 
                                fetchAgain={fetchAgain}
                                setFetchAgain={setFetchAgain}
                                fetchMessages={fetchMessages}
                            />
                        </>
                    )}
                </Text>
                <Box
                display={'flex'}
                flexDir={'column'}
                justifyContent={'flex-end'}
                p={3}
                bg={ darkTheme ? '#2b2b31' :'#E8E8E8'}
                w={'100%'}
                height={'100%'}
                borderRadius={'lg'}
                overflowY={'hidden'}
                >
                    {loading ? (
                        <Spinner size={'xl'} w={20} h={20} alignSelf={'center'} margin={'auto'} />
                    ): (
                        <div className='messages'>
                            <ScrollableChat messages={messages} />
                        </div>
                    )}
                    {isTyping ? <div>
                        <Lottie
                            animationData={animationData}
                            loop={true}
                            autoplay={true}
                            rendererSettings={{
                            preserveAspectRatio: "xMidYMid slice",
                            }}
                            width={5}
                            height={2}
                            style={{maxHeight:'12px', maxWidth: '60px', marginTop:15 ,marginBottom: 15, marginLeft: 0}}
                            
                        />
                            
                        </div>
                        : <></>}
                    
                    <FormControl onKeyDown={sendMessage} isRequired mt={3} 
                    display={'flex'}
                    position={'relative'}
                    >
                        {
                            showEmoji && (
                                <div style={{position: 'absolute', bottom: '110%', left: '0'}}>
                                    <EmojiPicker 
                                        height={300} 
                                        width={300}  
                                        theme={darkTheme ? Theme.DARK : Theme.LIGHT} 
                                        previewConfig={{
                                            showPreview: false
                                        }}
                                        style={{
                                            boxShadow: darkTheme ? '0px 0px 4px 4px #1d1d1d87' : '0px 0px 4px 4px #bcbcbc63',
                                        }}
                                        emojiStyle={EmojiStyle.APPLE}
                                        onEmojiClick={pickEmoji}
                                    />
                                </div>
                            )
                        }
                        <IconButton 
                            icon={<BsEmojiSmile style={{fontSize: '18px'}}/>} 
                            aria-label='emoji'
                            onClick={handleShowEmoji}
                        />
                        <Input
                        variant={'filled'}
                        bg={'#E0E0E0'}
                        placeholder='Enter a message...'
                        onChange={typingHandler}
                        value={newMessage}
                        _focus={{color: darkTheme ? 'white' : 'black'}}
                        ref={msgInput}
                        />
                    </FormControl>
                </Box>
            </>
        ) : (
            <Box
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
            h={'100%'}
            >
                <Text
                fontSize={'3xl'}
                pb={3}
                fontFamily={'Work sans'}
                color={darkTheme ? 'white' : 'black'}
                >
                    Click on user to start chatting
                </Text>

            </Box>
        )}
    </>
  )
}

export default SingleChat