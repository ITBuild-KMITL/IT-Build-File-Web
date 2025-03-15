"use client"

import { api } from "@/utils/api";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRef, useState } from "react";
import { File } from 'node:node:buffer'

export default function Page() {

    const inputFile = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<File | string>("");
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    async function uploadFile() {
        try {
            setLoading(true);
            const formdata = new FormData();
            formdata.append("file", file as Blob);
            const data = await api.post("/file", formdata ,{
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentLoaded = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setLoadingProgress(percentLoaded);
                    }
                }
            });
            setSuccessMsg(data.data.path);
        }
        catch (e) {
            if (e instanceof AxiosError) {
                setErrorMsg(e.message)
            }
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="container mx-auto p-4">
            <div className="max-w-md mx-auto border p-4 border-zinc-300 rounded-md">
                <h1 className="font-cpu text-emerald-500 text-4xl mb-4">Upload</h1>
                <div className="space-y-2 mb-4">
                    <p>เว็บไซต์อยู่ระหว่างพัฒนา <span className="text-red-500">โปรดสำรองข้อมูลของคุณ</span> เพื่อป้องกันการสูญหายของข้อมูล</p>
                    <p className="text-red-500" >เมื่อคุณอัปโหลดไฟล์ ทุกคนสามารถเข้าถึงไฟล์ของคุณได้โดยไม่มีการป้องกันใดๆ</p>
                </div>
                <input ref={inputFile} type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || "")} />
                <div className="flex flex-col gap-2">
                    <button onClick={() => { inputFile.current!.click() }} className=" text-black py-2 px-6 rounded-md border border-zinc-300 hover:opacity-50">เลือกไฟล์</button>
                    <button onClick={uploadFile} disabled={!(file instanceof File)} className="bg-emerald-500 text-white py-2 px-6 rounded-md uppercase hover:bg-emerald-400 mb-2 disabled:opacity-50 disabled:hover:bg-emerald-500">{loading ? `${loadingProgress}%` : 'Upload'}</button>
                </div>
                {errorMsg && <p className="text-red-500">{errorMsg}</p>}
                {successMsg && <Link href={` ${process.env.NEXT_PUBLIC_API_URL}/file/path/${successMsg}`} target="_blank" className="text-emerald-500">{` ${process.env.NEXT_PUBLIC_API_URL}/file/path/${successMsg}`}</Link>}
            </div>
        </div>
    );
}

export const dynamic = "force-dynamic";