"use client";

import { api } from "@/utils/api";
import { useContext, useEffect, useState } from "react";
import FileComponent from "./_components/FileComponent";
import Link from "next/link";
import { Github } from "lucide-react";
import Image from "next/image";
import { AuthContext } from "@/provider/AuthProvider";
import { loadContext } from "@/provider/LoadingProvider";

export interface FileResponse {
  id: string;
  accountId: string;
  fileName: string;
  path: string;
  createdAt: Date;
}

export default function Home() {
  const { profile } = useContext(AuthContext);
  const { loading, setLoading } = useContext(loadContext);

  const [file, setFile] = useState([]);
  const [allFilesCount, setAllFilesCount] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  async function getFile() {
    setLoading(true);
    try {
      const data = await api.get("/file/list?page=" + page + "&perPage=" + perPage);
      setFile(data.data.files);
      setAllFilesCount(data.data.pagination.total);
    } catch (e) {
      console.log(e);
    }
    finally {
      setTimeout(() => {
        setLoading(false);
      }
      , 300);
    }
  }

  useEffect(() => {
    if (!profile) return;
    {
      getFile();
    }
  }, [profile]);

  return (
    <>
      <div className="py-10 bg-linear-180 from-zinc-50 to-emerald-100 ">
        <div className="flex flex-col items-center justify-center container mx-auto px-4">
          <p className="text-sm py-1 px-4 text-center bg-emerald-50 border border-emerald-300 rounded-full block mb-14">
            ฝากไฟล์ไว้ในใจเธอ
          </p>
          <h1 className="font-cpu text-5xl block text-white mb-4 text-center">
            <span className="" style={{ WebkitTextStroke: "3px #000000" }}>
              ไอทีบิ้ว
            </span>
            <span style={{ WebkitTextStroke: "3px #00BC7D" }}>ไฟล์</span>
          </h1>
          <p className="max-w-xl text-center text-zinc-500 mb-6">
            ที่ที่เอาไว้ฝากไฟล์... ฝากทำไม use case เช่น จะไปปริ้นงานในห้อง IT
            Support แต่ขี้เกียจ Login Google Account หรือ
            มีเว็บแต่ไม่มีที่เก็บไฟล์? จะ Contribute it22.dev
            แต่ไม่มีที่เก็บไฟล์
          </p>
          <div className="flex items-center gap-4">
            {!profile ? (
              <Link
                href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
                className="bg-emerald-500 text-white py-2 px-6 rounded-md hover:bg-emerald-600"
              >
                เข้าสู่ระบบ
              </Link>
            ) : (
              <Link
                href={`/upload`}
                className="bg-emerald-500 text-white py-2 px-6 rounded-md hover:bg-emerald-600"
              >
                อัปโหลดไฟล์
              </Link>
            )}
            <Link
              href={`https://build.it22.dev`}
              className="bg-white text-black py-2 px-6 rounded-md hover:opacity-75 uppercase"
            >
              itbuild space
            </Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-10">
        <div className="space-y-2 mb-4">
          {!profile ? (
          <p className="text-red-500 mb-6">
            You have to{" "}
            <Link
              className="underline hover:text-red-800"
              href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
            >
              login
            </Link>{" "}
            first.
          </p>
          ): (
              <p className="text-yellow-500 mb-6">
                You are login as {profile.user?.firstName}
              </p>
          )}
          <h1 className="text-2xl md:text-4xl font-cpu text-emerald-500">
            Your file{" "}
            <span className="text-black text-xl md:text-2xl">
              ( {allFilesCount} files )
            </span>
          </h1>
          <p className="text-zinc-500">
            ไฟล์ที่คุณอัปโหลด จะสามารถเข้าถึงได้แบบสาธารณะ
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {file.map((file: FileResponse, index) => (
            <FileComponent key={index} file={file} getFile={getFile} />
          ))}
        </div>
      </div>
      <div className="bg-emerald-100 py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-emerald-500 font-cpu mb-4">
            We Are Opensource.
          </h2>
          <p className="mb-4">
            เว็บไซต์นี้เปิดโค้ด และหากคุณสนใจที่จะพัฒนาชุมชน และ เว็บไซต์
            คุณสามารถร่วม Contribute Project นี้ หรือเข้าร่วม ITBuild ได้
          </p>
          <div className="flex items-center gap-4 mb-10">
            <Link
              href={"https://github.com/ITBuild-KMITL/IT-Build-File-Web"}
              target="_blank"
              className="bg-black hover:opacity-75 text-white py-2 px-4 rounded-sm inline-flex gap-2 items-center"
            >
              {" "}
              <Github /> View on Github
            </Link>
            <Link
              href={"https:build.it22.dev"}
              target="_blank"
              className="bg-white hover:opacity-75 text-black py-2 px-4 rounded-sm inline-flex gap-2 items-center"
            >
              {" "}
              ITBuild Space
            </Link>
          </div>
          <div className="mb-10">
            <h3 className="text-emerald-500 font-cpu text-2xl mb-2">
              My Stack
            </h3>
            <ul className="list-disc list-inside marker:text-emerald-500">
              <li>
                <span className="text-emerald-500">Fontend :</span> NextJS
              </li>
              <li>
                <span className="text-emerald-500">Backend :</span> Hono
              </li>
              <li>
                <span className="text-emerald-500">Database :</span> Cloudflare
                D1
              </li>
              <li>
                <span className="text-emerald-500">Storage :</span> Cloudflare
                R2
              </li>
              <li>
                <span className="text-emerald-500">Deployment :</span>{" "}
                Cloudflare Page
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-emerald-500 font-cpu text-2xl mb-2">
              Project Founder
            </h3>
            <div className="flex items-center gap-4">
              <Image
                src={`https://api.file.itbuild.it22.dev/file/path/user-dd1effca-221a-45e4-a21d-106071de7a8bCreate+Next+App+Image+1405.jpeg=`}
                width={50}
                height={50}
                alt="Founder"
                className="rounded-full aspect-square object-cover"
              />
              <div>
                <h4 className="mb-2">Suwijak Promsatid (IT22@KMITL)</h4>
                <p className="text-zinc-500">ITBuild Co-Founder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
