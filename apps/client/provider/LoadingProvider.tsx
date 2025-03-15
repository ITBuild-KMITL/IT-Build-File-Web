"use client"

import { ReactNode, useState , createContext } from "react";
import Logo from "@/public/brand/it-build-file-logo.svg"
import Image from "next/image";

import { Dispatch, SetStateAction } from "react";

const loadContext = createContext<{ loading: boolean; setLoading: Dispatch<SetStateAction<boolean>> }>({
    loading: false,
    setLoading: () => {},
});
export default function LoadingProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <loadContext.Provider value={{ loading, setLoading }}>
            {loading && (
                <div className="fixed top-0 left-0 w-dvw h-dvh bg-white/10 backdrop-blur-xl z-50 flex items-center justify-center duration-75">
                    <div className="w-full max-w-[350px] p-4 bg-white rounded-sm flex flex-col items-center justify-center">
                        <Image src={Logo} alt="Loading" className="h-14 w-auto animate-pulse mb-2" />
                        <p className="animate-bounce">กำลังโหลด...</p>
                    </div>
                </div>
            )}
            {children}
        </loadContext.Provider>
    )
}

export { loadContext }