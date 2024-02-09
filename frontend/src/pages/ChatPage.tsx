import { useState } from 'react'
import { useChatState } from '../context/ChatProvider'
import { Box } from '@chakra-ui/react'
import MyChats from '../components/layouts/MyChats'
import ChatBox from '../components/layouts/ChatBox'
import ChatNavBar from '../components/miscellaneous/ChatNavBar'

const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false)
  const { user , darkTheme} = useChatState()

  return (
    <div
    className="App"
      style={{ backgroundColor: darkTheme ? '#2b2b31' : '#7a98b2', transition: 'all ease 0.35s'}}
    >
      <div 
      style={{
        width: '100%',
      }}
      >
        { user && <ChatNavBar />}
        <Box
        display={'flex'}
        justifyContent={'space-between'}
        width={'100%'}
        height={'91.5vh'}
        padding={'10px 0'}
        maxWidth={'1270px'}
        margin={'0 auto'}
        >
          {user && <MyChats fetchAgain={fetchAgain}/>}
          {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
        </Box>
      </div>
    </div>
  )
}

export default ChatPage