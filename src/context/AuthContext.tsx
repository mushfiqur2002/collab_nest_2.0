import { getCurrentUser } from '@/lib/appwrite/api';
import type { IUser } from '@/types';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';


export const INITIAL_USER = {
    accountID: '',
    email: '',
    username: '',
    avatarURL: ''
}

const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    setUser: () => { },
    isAuthenticated: false,
    setIsAuthenticated: () => { },
    checkAuthUser: async () => false as boolean
}

type IContextType = {
    user: IUser;
    isLoading: boolean;
    setUser: React.Dispatch<React.SetStateAction<IUser>>;
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    checkAuthUser: () => Promise<boolean>;
}

const AuthContext = createContext<IContextType>(INITIAL_STATE)
function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<IUser>(INITIAL_USER);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    const checkAuthUser = async () => {
        try {
            const currentAccount = await getCurrentUser();
            if (currentAccount) {
                setUser({
                    accountID: currentAccount.accountID,
                    email: currentAccount.email,
                    username: currentAccount.username,
                    avatarURL: currentAccount.avatarURL
                })
                setIsAuthenticated(true);
                return true;
            }
            return false;

        } catch (error) {
            console.log('error', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    }

    // checking auth and if null navigate in sign-in
    useEffect(()=>{
        if(
            localStorage.getItem('cookieFallback') === '[]' ||
            localStorage.getItem('cookieFallback') === null
        ) navigate('/sign-in');
        checkAuthUser();
    },[])

    const value = {
        user,
        isLoading,
        isAuthenticated,
        setUser,
        setIsAuthenticated,
        setIsLoading,
        checkAuthUser
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;
export const useUserContext = () => {
    return useContext(AuthContext)
}
