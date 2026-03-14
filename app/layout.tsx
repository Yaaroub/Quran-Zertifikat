import type { Metadata } from "next";
import { Amiri } from "next/font/google";
import "./globals.css";

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Quran Certificates",
  description: "Premium certificate generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={amiri.className}>{children}</body>
    </html>
  );
}