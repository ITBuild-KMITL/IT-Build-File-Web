"use client";

import dayjs from "dayjs";
import { FileResponse } from "../page";
import { api } from "@/utils/api";
import Image from "next/image";
import { File } from "lucide-react";
import { loadContext } from "@/provider/LoadingProvider";
import { useContext } from "react";

export default function FileComponent({
    file,
    getFile,
}: {
    file: FileResponse;
    getFile: () => void;
    }) {
    
    const { loading, setLoading } = useContext(loadContext);
    
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
        </div>
    );
}
