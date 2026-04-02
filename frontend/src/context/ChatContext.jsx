import { createContext } from "react";
import axios from "axios";

export const ChatContext = createContext();

const models = [
  {
    "name":"kimi-k4",
    "model":"moonshotai/kimi-k2-instruct"

  },
  {
    "name" : "Mistral",
    "model" : "mistralai/devstral-2-123b-instruct-2512"
  },
  {
    "name" : "Qwen3",
    "model" : "qwen/qwen3-coder-480b-a35b-instruct"
  },
  {
    "name":"deepseek",
    "model":"deepseek-ai/deepseek-v3.2"
  },
  {
    "name":"falcon",
    "model":"tiiuae/falcon3-7b-instruct"
  }
]

const chat = async (chatId, payload , model) => {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/start-chat/${chatId}`, { ...payload, model: model?.model }, { withCredentials: true });
    return response.data;
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