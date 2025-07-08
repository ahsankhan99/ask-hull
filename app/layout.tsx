import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ask Hull",
  description: "University of Hull student assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col justify-start items-center bg-gray-50`}
      >
        <nav className="items-start w-full px-6 py-4 min-h-[8dvh]">
          <div className="max-w-7xl mx-auto flex items-center cursor-pointer">
            <span className="text-xl font-medium text-white">ask hull</span>
          </div>
        </nav>

        <main className="h-full flex-1 px-6 py-2 max-h-[92dvh]">{children}</main>
      </body>
    </html>
  );
}
