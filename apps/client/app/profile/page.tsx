"use client"

import Link from "next/link";

export default function Page() {    
    return (
        <div className="container mx-auto p-4 min-h-[calc(100dvh-5rem)]">
            <div className="p-4 border border-zinc-300 rounded-md">
                <h1>Website is under construction <Link className="text-emerald-500 hover:text-emerald-400" href={"/"}>Back to Home</Link></h1>
                
            </div>
        </div>
    );
}