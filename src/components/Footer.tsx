export default function Footer() {
  return (
    <footer className="w-full py-6 px-4 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 mt-12">
      © {new Date().getFullYear()} Deep Thoughts. All rights reserved.
    </footer>
  );
}
