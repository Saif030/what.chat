import { createContext } from "react";
import axios from "axios";

export const AuthContext = createContext();

const login = async (data) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL || ''}/api/v1/users/login`, data, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
};

const signup = async (data) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL || ''}/api/v1/users/register`, data, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getUser = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL || ''}/api/v1/users/me`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const logOut = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL || ''}/api/v1/users/logout`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const AuthContextProvider = ({ children }) => {
    return (
        <AuthContext.Provider value={{login, signup , getUser, logOut}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;