import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@pages/components/Sidebar";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

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

export const metadata = {
  title: "SIAP for LSI",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Sidebar />
        <div className="content-area">{children}</div>
        <ToastContainer
          position="bottom-right" // Change position to bottom-right
          autoClose={1500} // Auto close after 1.5 seconds
          hideProgressBar={false} // Show progress bar
          newestOnTop={false} // Display newest toasts on top
          closeOnClick // Allow closing toast on click
          rtl={false} // Enable right-to-left layout if necessary
          pauseOnFocusLoss // Pause toast on focus loss
          draggable // Allow dragging of toasts
          pauseOnHover // Pause on hover
        />
      </body>
    </html>
  );
}
