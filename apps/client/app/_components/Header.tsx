"use client"

import { AuthContext } from "@/provider/AuthProvider"
import fileLogo from "@/public/brand/it-build-file-logo.svg"
import itBuildLogo from "@/public/brand/it-build-logo.svg"
import Image from "next/image"
import Link from "next/link"
import { useContext } from "react"

export default function Header() {

    const authContext = useContext(AuthContext)
    const { profile } = authContext as any

    return (
        <div className="flex h-18 items-center container mx-auto px-4 justify-between">
            <Link href="/" className="flex items-center hover:opacity-75">
                <Image src={fileLogo} alt="IT Build File | Logo" className="h-12 w-auto block" />
                <div className="border-r mx-1 hidden md:block border-emerald-500 h-8" />
                <Image src={itBuildLogo} alt="IT Build | Logo" className="h-12 w-auto hidden md:block" />
            </Link>
            <div className="flex items-center space-x-4 md:space-x-10">
                {profile && (
                <div className="text-black">
                    <Link className="hover:underline" href={"upload"}>อัปโหลดไฟล์</Link>
                </div>
                )}
                {profile && (
                <Link className="bg-emerald-500 text-white text-xl py-2 px-6 rounded-sm hover:bg-emerald-600" href={"/profile"}>โพรไฟล์</Link>
                )}
                {!profile && (
                <Link className="bg-emerald-500 text-white text-xl py-2 px-6 rounded-sm hover:bg-emerald-600" href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}>เข้าสู่ระบบ</Link>
                )}
            </div>
        </div>
    )
}