// src/components/mdx/Callout.tsx
import { ReactNode } from "react";

export default function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-4 my-4 rounded">
      {children}
    </div>
  );
}
