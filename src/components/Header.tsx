import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full py-6 px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="max-w-3xl mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-xl font-bold text-brand-dark dark:text-brand-light"
        >
          Deep Thoughts
        </Link>
        <Link href="/blog" className="text-sm font-semibold hover:underline">
          Blog
        </Link>
      </div>
    </header>
  );
}
