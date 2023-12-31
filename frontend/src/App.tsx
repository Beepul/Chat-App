import {Routes, Route, Navigate, useNavigate} from 'react-router-dom'
import ChatPage from "./pages/ChatPage"
import NotFound from "./pages/NotFound"
import StartPage from "./pages/StartPage"
import HomePage from "./pages/HomePage"
import { useChatState } from './context/ChatProvider'
import { ReactNode, useEffect } from 'react'

type ProtectedRouteProps = {
  children: ReactNode;
}


const ProtectedRoute:React.FC<ProtectedRouteProps> = ({children}) => {
  const navigate = useNavigate()

  useEffect(() => {
    const userDataString = localStorage.getItem('userInfo') ;

    let userData = null
    if(userDataString){
      userData = JSON.parse(userDataString)
    }
  
    if (!userData) {
      navigate('/start');
      return
    }
  }, []);
  return children
}

function App() {

  

  return (
    <div 
    
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/start" element={<StartPage />}/>
        <Route path='/chats' element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
