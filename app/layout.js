import localFont from "next/font/local";
import "./globals.css";
import { TaskProvider } from "@/contexts/TaskContext";
import RegisterServiceWorker from "./register-service-worker";

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
  title: "Create Next App",
  description: "Generated by create next app",
  manifest: '/manifest.json'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <TaskProvider>
                {children}
             <RegisterServiceWorker/>
          </TaskProvider>
        
      </body>
    </html>
  );
}
