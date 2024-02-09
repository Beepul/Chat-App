import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types/UserType";
import { ChatType } from "../types/ChatType";
import { Message } from "../types/MessageType";



type ChatContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  selectedChat: ChatType | null;
  setSelectedChat: React.Dispatch<React.SetStateAction<ChatType | null>>;
  chats: ChatType[] | [];
  setChats: React.Dispatch<React.SetStateAction<ChatType[]>>;
  notification: Message[];
  setNotification:React.Dispatch<React.SetStateAction<Message[]>>;
  darkTheme: boolean;
  setDarkTheme: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChatContext = createContext<ChatContextType | null>(null);

type ChatProviderProps = {
  children: React.ReactNode;
}

const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedChat, setSelectedChat] = useState<ChatType | null>(null)
  const [chats, setChats] = useState<ChatType[]>([])
  const [notification,setNotification] = useState<Message[]>([])
  const [darkTheme, setDarkTheme] = useState<boolean>(true)

  useEffect(() => {
    const userData = localStorage.getItem('userInfo')
   
    if(userData){
        const userInfo = JSON.parse(userData)
        setUser(userInfo)
    }
  },[])
  return (
    <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, notification, setNotification,darkTheme,setDarkTheme }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatState = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }

  return context;
};

export default ChatProvider;
