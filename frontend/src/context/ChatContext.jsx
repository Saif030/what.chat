import { createContext } from "react";
import axios from "axios";

export const ChatContext = createContext();

const models = [
  {
    "name" : "Minimax",
    "model" : "minimaxai/minimax-m2.7"
  },
  {
    "name" : "Mistral",
    "model" : "mistralai/mistral-large-3-675b-instruct-2512"
  },
  {
    "name" : "GPT OSS 120B",
    "model" : "openai/gpt-oss-120b"
  }
]

const chat = async (chatId, payload , model) => {
    try{
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/start-chat/${chatId}`, { ...payload, model: model?.model }, { withCredentials: true });
    return response.data;
    }
    catch(error){
        console.log("Error in chat function:");
        console.log(error);
    }
}

const chatStart = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/create-chat`, { withCredentials: true });
    return response.data;
}

const getChat = async (chatId) => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/get-chat/${chatId}`, { withCredentials: true });
    return response.data;
}

const getAllChats = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/get-all-chats`, { withCredentials: true });
    return response.data;
}

const chatDelete = async (chatId) => {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/delete-chat`, { chatId }, { withCredentials: true });
    return response.data;
}

const renameChat = async (chatId, newTitle) => {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/rename-chat`, { chatId, newTitle }, { withCredentials: true });
    return response.data;
}

const ChatContextProvider = ({ children }) => {
    return (
        <ChatContext.Provider value={{chat, models, chatStart, getChat, getAllChats, chatDelete, renameChat}}>
            {children}
        </ChatContext.Provider>
    );
};

export default ChatContextProvider;