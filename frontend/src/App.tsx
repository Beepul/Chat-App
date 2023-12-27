import { Button } from "@chakra-ui/button"
import {Routes, Route} from 'react-router-dom'
import ChatPage from "./pages/ChatPage"
import NotFound from "./pages/NotFound"
import HomePage from "./pages/HomePage"
import { useChatState } from "./context/ChatProvider"

function App() {

  const {darkTheme} = useChatState()

  return (
    <div className="App"
    style={{backgroundColor: darkTheme ? '#2b2b31' : '#7a98b2', transition: 'all ease 0.35s'}}
    >
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path='/chats' element={<ChatPage />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
