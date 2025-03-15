"use client"

export interface Account {
    id?: number;
    googleId?: string;
    userId?: number;
    isSuspended?: boolean;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
}

export interface User {
    id?: number;
    accountId?: number;
    email?: string;
    userProfileURL?: string;
    firstName?: string;
    lastName?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface UserWithAccount {
    account?: Account;
    user?: User;
}


import { ReactNode, useEffect, useState } from "react";
import { createContext } from "react";
import { api } from "@/utils/api";

const AuthContext = createContext<{ profile: UserWithAccount | null }>({ profile: null });

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [profile, setProfile] = useState<UserWithAccount>({})

    useEffect(() => {
        getProfile()
    }, [])

    async function getProfile() {
        try {
            const res = await api.get<UserWithAccount>("/@me")
            setProfile(res.data)
        }
        catch (err) {
            console.error(err)
        }
    }


    return (
        <AuthContext.Provider value={{ profile }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext }