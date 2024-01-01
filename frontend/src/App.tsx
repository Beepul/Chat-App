import {Routes, Route} from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import { Suspense, lazy } from 'react'
import Loader from './components/public/Loader'


const HomePage = lazy(() => import("./pages/HomePage"))
const StartPage = lazy(() => import("./pages/StartPage"))
const ChatPage = lazy(() => import("./pages/ChatPage"))
const NotFound = lazy(() => import("./pages/NotFound"))


function App() {

  return (
    <div>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/start" element={<StartPage />}/>
          <Route path='/chats' element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
