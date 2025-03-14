"use client"

import { api } from "@/utils/api";
import { useEffect, useState } from "react";

export default function Home() {

  const [file, setFile] = useState([]);

  async function getFile() { 
    try {
      const data = await api.get("/file/list");
      setFile(data.data.data);
    }
    catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getFile();
  }, []);

  return (
    <div>
      <h1>Website is under construction</h1>
      <p>any file that you upload can access from anyone</p>
      {file.map((f, i) => (
        <div key={i}>
          {JSON.stringify(f)}
        </div>
      ))}
    </div>
  );
}
