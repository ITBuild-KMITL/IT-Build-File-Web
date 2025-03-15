import type { Metadata } from "next";
import "./globals.css";
import Header from "./_components/Header";
import AuthProvider from "@/provider/AuthProvider";
import Loading from "@/provider/LoadingProvider";



export const metadata: Metadata = {
  title: {
    template: "%s | IT Build File",
    default:
      "File X IT Build | เก็บผมไว้ใน ใจ(Cloud) ของคุณ",
  },
  authors: [{ name: "IT Build" }],
  description:
    "ที่ที่เอาไว้ฝากไฟล์... ฝากทำไม use case เช่น จะไปปริ้นงานในห้อง IT Support แต่ขี้เกียจ Login Google Account",
  keywords: [
    "IT Build",
    "File X IT Build",
    "IT Build File",
    "IT KMITL",
    
  ],
  creator: "IT Build Team",
  publisher: "IT Build Space",
  metadataBase: new URL("https://build.it22.dev"),
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: "File X IT Build",
    images: {
      url: "https://api.file.itbuild.it22.dev/file/path/user-5bfcae57-097e-46f7-b80d-57d90398a0ebit-build-og.jpg=",
      alt: "File X IT Build | เก็บผมไว้ใน ใจ(Cloud) ของคุณ",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#00BC7D" />
      </head>
      <body
        className={`font-amd antialiased bg-zinc-50 text-black h-screen`}
      >
        <AuthProvider>
          <Loading>
            <Header />
            <div>
              {children}
            </div>
          </Loading>
        </AuthProvider>
      </body>
    </html>
  );
}
