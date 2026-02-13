import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "TssVPN - Современный и быстрый VPN",
  description: "Минималистичный, быстрый и безопасный VPN-сервис. Настройка за 2 минуты.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} font-sans antialiased gradient-mesh min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
