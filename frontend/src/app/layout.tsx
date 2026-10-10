import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import ContactWidget from "@/components/ContactWidget"; // Nhập component nút liên hệ nổi

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "OpenEdu - Nền tảng học tập trực tuyến",
  description: "Hệ thống học tập và ôn thi trực tuyến",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 min-w-0">{children}</div>
        </div>
        {/* Hiển thị nút liên hệ nổi ở góc dưới bên phải */}
        <ContactWidget />
      </body>
    </html>
  );
}