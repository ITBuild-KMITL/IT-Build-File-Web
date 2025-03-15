"use client"

import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import FileComponent from "./_components/FileComponent";

export interface FileResponse {
  id: string;
  accountId: string;
  fileName: string;
  path: string;
  createdAt: Date;
}

export default function Home() {

  const [file, setFile] = useState([]);
  const [allFilesCount, setAllFilesCount] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  async function getFile() {
    try {
      const data = await api.get("/file/list");
      setFile(data.data.files);
      setAllFilesCount(data.data.pagination.total);
    }
    catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getFile();
  }, []);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="space-y-2 mb-4">
        <h1 className="text-4xl font-cpu text-emerald-500">Your file {" "}
          <span className="text-black text-2xl">
            ( {allFilesCount} files )
          </span></h1>
        <p className="text-zinc-500">ไฟล์ที่คุณอัปโหลด จะสามารถเข้าถึงได้แบบสาธารณะ</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {file.map((file: FileResponse, index) => (
          <FileComponent key={index} file={file} getFile={getFile} />
        ))}
      </div>
    </div>
  );
}
