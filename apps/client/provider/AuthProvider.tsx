"use client"
import { ReactNode, useEffect, useState } from "react";
import { createContext } from "react";
import { api } from "@/utils/api";

const AuthContext = createContext({});

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [profile, setProfile] = useState(null)

    useEffect(() => {
        getProfile()
    }, [])

    async function getProfile() {
        try {
            const res = await api.get("/@me")
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