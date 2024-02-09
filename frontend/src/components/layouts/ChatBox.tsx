import React from 'react'
import { useChatState } from '../../context/ChatProvider'
import { Box } from '@chakra-ui/react'
import SingleChat from './SingleChat';

type ChatBoxProps = {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>
}

const ChatBox: React.FC<ChatBoxProps> = ({fetchAgain, setFetchAgain})=> {
  const {selectedChat, darkTheme} = useChatState()
  return (
    <Box
    display={{base: selectedChat ? 'flex' : 'none', md: 'flex'}}
    alignItems={'center'}
    flexDir={'column'}
    p={3}
    bg={darkTheme ? '#171718' : 'white'}
    w={{base: '100%', md: '68%'}}
    borderRadius={'lg'}
    borderWidth={'5px'}
    borderColor={darkTheme ? '#171718' : '#E0E6EE'}
    transition={'all ease 0.35s'}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  )
}

export default ChatBox