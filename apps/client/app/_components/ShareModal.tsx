import { Share } from "lucide-react";
import QRCode from "react-qr-code";

export default function ShareModal({ url , setShare }: { url: string; setShare: (value: boolean) => void; }) {
    
    function haddleShare(e: React.MouseEvent<HTMLInputElement>) {
        const input = e.target as HTMLInputElement;
        input.select();
        input.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(input.value)
    }

    function shareLink() { 
        try {
            navigator.share({ url })
        }
        catch (e) { 
            navigator.clipboard.writeText(url)
        }
    }

    return (
        <div className="fixed w-dvw h-dvh top-0 left-0 bg-white/20 backdrop-blur-md z-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-md w-80 shadow">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-300 ">
                    <h1 className="text-xl">Share</h1>
                    <button onClick={() => setShare(false)} className="text-red-500">Close</button>
                </div>
                <div className="flex justify-center items-center py-4">
                    <QRCode value={url} />
                </div>
                <div className="flex items-center gap-2">
                    <input type="text" readOnly onClick={haddleShare} className="h-11 flex-1 w-full focus:outline-emerald-400 focus:outline-1 outline-transparent border border-zinc-300 rounded-sm py-1 px-2" value={url} />
                    <button onClick={shareLink} className="h-11 aspect-square flex items-center justify-center border-zinc-300 border p-1 rounded-sm hover:text-emerald-500 hover:border-emerald-500" ><Share /></button>
                </div>
            </div>
        </div>
    )
}