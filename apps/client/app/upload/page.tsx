"use client"

import { api } from "@/utils/api";
import { useState } from "react";

export default function Page() {

    const [file, setFile] = useState<File | null>(null);

    async function uploadFile() { 
        try {
            const formdata = new FormData();
            formdata.append("file",file as Blob);
            const data = await api.post("/file",formdata);
            console.log(data);
        }
        catch (e) {
            console.log(e);
        }
    }

    return (
        <div>
        <h1>Website is under construction</h1>
            <p>any file that you upload can access from anyone</p>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)}/>
            <button onClick={uploadFile}>Upload</button>
        </div>
    );
}