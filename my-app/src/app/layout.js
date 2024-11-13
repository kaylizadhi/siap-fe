"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@pages/components/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }) {
  const router = usePathname();
  useEffect(()=> {
    console.log(router.pathname);
  }, [router.pathname])
  const noSidebar =
    router.pathname === "/app" ||
    router.pathname === "/login" ||
    router.pathname === "/forgot-password";
    console.log(router.pathname)

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {!noSidebar && <Sidebar />}
        <div className={noSidebar ? "" : "content-area"}>{children}</div>
        <ToastContainer
          position="bottom-right"
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <p>{router.pathname}</p>
      </body>
    </html>
  );
}