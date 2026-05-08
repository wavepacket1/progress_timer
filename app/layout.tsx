import type { Metadata } from "next";
import { Bebas_Neue, Share_Tech_Mono, DM_Sans } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mono",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "進捗タイマー",
  description: "進捗を管理するためのタイマーアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${shareTechMono.variable} ${dmSans.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
