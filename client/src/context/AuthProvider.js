import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000"; // Backend server
axios.defaults.withCredentials = true; // Include cookies with requests

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);


    // Check Login State
    useEffect(()=>{
        const checkToken = async () => {
            try {
                const response = await axios.get("/auth/validate-token");
                setUser(response.data.user);
                setIsLoggedIn(true);
            } catch (error) {
                console.error("Token validation failed: ", error);
                setIsLoggedIn(false);
                setUser(null);
            }
        }

        checkToken();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post("auth/login", {email, password});
            setUser(response.data.user);
            setIsLoggedIn(true);
        } catch (error) {
            console.error("Login failed: ", error.message);
            setIsLoggedIn(false);
            throw error("throw error to prevent switching to welcome page in loginPage"); 
        }
    };

    const logout = async () => {
        try {
            await axios.post("/auth/logout");
            setUser(null);
            setIsLoggedIn(false);
        } catch (error) {
            console.error("logout failed", error);
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext)