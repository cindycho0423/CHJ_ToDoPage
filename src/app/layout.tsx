import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import ModalProvider from "@/components/common/modal/modal-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kanban TodoList",
  description: "할 일 목록을 만들어보세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        {children}
        <ModalProvider />
      </body>
    </html>
  );
}
