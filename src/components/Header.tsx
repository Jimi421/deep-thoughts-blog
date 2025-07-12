"use client"; // this file uses client-side hooks
import Link from "next/link";
import DarkToggle from "@/components/DarkToggle";

export default function Header() {
  return (
    <header className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <span className="text-xl font-bold cursor-pointer">
            Deep Thoughts
          </span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/blog">
            <span className="hover:underline cursor-pointer">Blog</span>
          </Link>
          <DarkToggle />
        </nav>
      </div>
    </header>
  );
}
