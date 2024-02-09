import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import  {BrowserRouter} from 'react-router-dom'
import ChatProvider from './context/ChatProvider.tsx'
import { disableReactDevTools } from '@fvilers/disable-react-devtools'

if(import.meta.env.VITE_NODE_ENV === 'production') disableReactDevTools()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ChatProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </ChatProvider>
  </BrowserRouter>,
)
