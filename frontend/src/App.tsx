import { Button } from "@chakra-ui/button"
import {Routes, Route} from 'react-router-dom'
import ChatPage from "./pages/ChatPage"
import NotFound from "./pages/NotFound"
import { useChatState } from "./context/ChatProvider"
import StartPage from "./pages/StartPage"
import HomePage from "./pages/HomePage"

function App() {

  const {darkTheme} = useChatState()

  return (
    <div 
    
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/start" element={<StartPage />}/>
        <Route path='/chats' element={<ChatPage />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
