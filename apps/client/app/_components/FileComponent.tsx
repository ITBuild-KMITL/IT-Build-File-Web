"use client";

import dayjs from "dayjs";
import { FileResponse } from "../page";
import { api } from "@/utils/api";
import Image from "next/image";
import { File, Share } from "lucide-react";
import { loadContext } from "@/provider/LoadingProvider";
import { useContext, useState } from "react";
import ShareModal from "./ShareModal";

export default function FileComponent({
    file,
    getFile,
}: {
    file: FileResponse;
    getFile: () => void;
}) {

    const [share, setShare] = useState<boolean>(false);
    const { setLoading } = useContext(loadContext);

    const photoExtendtion = ["jpg", "jpeg", "png", "gif", "svg"];

    interface HandleDownloadEvent
        extends React.MouseEvent<HTMLAnchorElement, MouseEvent> { }

    async function deleteFile(id: string): Promise<void> {
        setLoading(true);
        try {
            const confirm = window.confirm("คุณต้องการลบไฟล์นี้ใช่หรือไม่?");
            if (!confirm) return;
            await api.get(`/file/delete/${id}`);
        } catch (e) {
            console.log(e);
        } finally {
            getFile();
            setTimeout(() => {
                setLoading(false);
            }, 300);
        }
    }

    function haddleShare(e: React.MouseEvent<HTMLInputElement>) {
        const input = e.target as HTMLInputElement;
        input.select();
        input.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(input.value)
    }

    function handleDownload(file: FileResponse): void {
        setLoading(true);
        const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/file/path/${file.path}`;
        const fileName = file.fileName;

        fetch(downloadUrl)
            .then((response) => response.blob())
            .then((blob) => {
                console.log(blob);

                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.style.display = "none";
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            })
            .catch((error) => console.error("Error downloading file:", error))
            .finally(() => {
                setTimeout(() => {
                    setLoading(false);
                }
                    , 300);
            })
    }

    return (
        <>
            {share && (
                <ShareModal url={`${process.env.NEXT_PUBLIC_API_URL}/file/path/${file.path}`} setShare={setShare} />

            )}
            <div className="p-4 rounded-md border border-zinc-300 hover:border-emerald-400 mb-4 w-full space-y-2">
                <div className="bg-zinc-100 w-full aspect-video rounded-sm relative flex items-center justify-center">
                    {photoExtendtion.some(ext => file.fileName.toLowerCase().endsWith(`.${ext}`)) ? (
                        <Image
                            alt={file.fileName}
                            src={`${process.env.NEXT_PUBLIC_API_URL}/file/path/${file.path}`}
                            className="object-cover rounded-sm"
                            fill
                        />
                    ) : (
                        <File size={"3.5em"} />
                    )}

                </div>
                <div>
                    <h2 className="truncate">{file.fileName}</h2>
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-zinc-500">
                        {dayjs(file.createdAt).format("DD MMMM YYYY")}
                    </p>
                    <div className="flex space-x-4 flex-nowrap items-center">
                        <button
                            onClick={() => handleDownload(file)}
                            className="text-emerald-500 hover:cursor-pointer hover:opacity-75"
                        >
                            ดาวน์โหลด
                        </button>
                        <button
                            className="text-red-500 hover:opacity-75"
                            onClick={() => {
                                deleteFile(file.id);
                            }}
                        >
                            ลบไฟล์
                        </button>
                    </div>
                </div>
                <div className="border-t pt-4 border-zinc-300 flex items-center gap-2">
                    <input type="text" readOnly onClick={haddleShare} className="h-11 flex-1 w-full focus:outline-emerald-400 focus:outline-1 outline-transparent border border-zinc-300 rounded-sm py-1 px-2" value={`${process.env.NEXT_PUBLIC_API_URL}/file/path/${file.path}`} />
                    <button onClick={() => { setShare(true) }} className="h-11 aspect-square flex items-center justify-center border-zinc-300 border p-1 rounded-sm hover:text-emerald-500 hover:border-emerald-500" ><Share /></button>
                </div>
            </div>
        </>
    );
}
