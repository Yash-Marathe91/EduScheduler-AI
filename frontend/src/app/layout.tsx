import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { PremiumBackground } from "@/components/layout/premium-background";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduScheduler AI",
  description: "Enterprise AI-Powered College Timetable Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative text-on-background bg-background">
        <PremiumBackground />
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
