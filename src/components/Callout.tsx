import { ReactNode } from "react";

type CalloutProps = {
  children: ReactNode;
  emoji?: string;
  title?: string;
};

export default function Callout({ children, emoji, title }: CalloutProps) {
  return (
    <div className="my-6 flex gap-3 rounded-lg border border-blue-400/40 bg-blue-50/80 p-5 text-blue-900 shadow-sm dark:border-blue-400/30 dark:bg-blue-900/20 dark:text-blue-100">
      {emoji ? (
        <span className="text-2xl" aria-hidden>
          {emoji}
        </span>
      ) : null}
      <div>
        {title ? (
          <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-200">
            {title}
          </p>
        ) : null}
        <div className="space-y-2 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
