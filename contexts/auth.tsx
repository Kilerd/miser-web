import React, {createContext, useContext, useEffect, useState} from 'react'
import Cookies from 'js-cookie'
import {useRouter} from 'next/router'
import {Spinner} from "@blueprintjs/core";
import api, {BASE_ENV, IS_DEV} from '../api'
import {User} from "../types";


export interface AuthContextType {
    isAuthenticated: boolean,
    user: User | undefined,
    loading: boolean,

    login(email: string, password: string): void,

    register(email: string, username: string, password: string): void,

    logout(): void,

    loginWithToken(token: string): void;
}

const UNAUTHENTICATED_ROUTE = ["/login", '/register']
const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(undefined);
    const [loading, setLoading] = useState(true);

    const token = Cookies.get('token')
    if (token) {
        api.client.defaults.headers.Authorization = `Bearer ${token}`;
    }
    useEffect(() => {
        async function loadUserFromCookies() {
            const user = await api.getUserInfo()
            if (user) setUser(user);
            setLoading(false);
        }

        if (token) {
            loadUserFromCookies();
        } else {
            setLoading(false);
        }
    }, [])


    const loginWithToken = async (token) => {
        if (IS_DEV) {
            Cookies.set('token', token, {expires: 7})
        } else {
            Cookies.set('token', token, {expires: 7, domain: BASE_ENV.domain})
        }

        api.client.defaults.headers.Authorization = `Bearer ${token}`
        const userData = await api.getUserInfo()
        setUser(userData)
    }

    const login = async (email, password) => {
        const token = await api.login(email, password)
        if (token) {
            await loginWithToken(token)
        }
    }


    const register = async (email, username, password) => {
        const token = await api.register(email, username, password)
        if (token) {
            Cookies.set('token', token, {expires: 60})
            api.client.defaults.headers.Authorization = `Bearer ${token}`
            const userData = await api.getUserInfo()
            setUser(userData)
        }
    }
    const logout = () => {
        Cookies.remove('token')
        setUser(undefined)
        delete api.client.defaults.headers.Authorization
        window.location.pathname = '/'
    }
    if (loading) {
        return <div>auth loading</div>
    }

    return (
        <AuthContext.Provider value={{isAuthenticated: !!user, user, login, loading, logout, register, loginWithToken}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)

export const ProtectRoute = (ChildComponent) => (args) => {
    const {isAuthenticated} = useAuth();
    const router = useRouter();

    if (!isAuthenticated && !UNAUTHENTICATED_ROUTE.includes(router.asPath)) {
        router.push("/");
        return <Spinner/>;
    }
    return <ChildComponent {...args} />;
};
