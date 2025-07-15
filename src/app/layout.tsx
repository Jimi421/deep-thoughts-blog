// src/app/layout.tsx
import "@/styles/globals.css"; // your global Tailwind CSS
import type { ReactNode } from "react";
import Header from "@/components/Header"; // your header
import Footer from "@/components/Footer"; // your footer
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

export const metadata = {
  title: "Deep Thoughts",
  description: "A minimal blog built with Next.js, MDX, and Tailwind CSS",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`antialiased ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body
        className="flex flex-col min-h-screen 
                       bg-white text-gray-800 
                       dark:bg-gray-900 dark:text-gray-100"
      >
        {/* site header with dark-mode toggle */}
        <Header />

        {/* page content */}
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>

        {/* site footer */}
        <Footer />
      </body>
    </html>
  );
}
