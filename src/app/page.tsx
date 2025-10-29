import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllPosts } from "@/lib/posts";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
});

function formatDate(input: string): string {
  const parsed = new Date(input);
  return Number.isNaN(parsed.getTime()) ? input : dateFormatter.format(parsed);
}

export default async function Home() {
  const allPosts = await getAllPosts();
  const latestPosts = allPosts.slice(0, 3);
  const categoryCounts = allPosts.reduce((acc, post) => {
    const category = post.frontmatter.category ?? "Uncategorized";
    acc.set(category, (acc.get(category) ?? 0) + 1);
    return acc;
  }, new Map<string, number>());

  const highlightedCategories = Array.from(categoryCounts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return (
    <div className="space-y-24">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 p-10 text-white shadow-2xl">
        <div
          className="absolute inset-y-0 right-[-40%] w-[120%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent)]"
          aria-hidden
        />
        <div className="relative max-w-2xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">
            Deep Thoughts
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            Sharpen your network instincts.
          </h1>
          <p className="text-lg text-slate-100/90">
            Field notes, mental models, and study tactics for builders pursuing
            the CompTIA Network+ and beyond.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              Explore the library
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a
              href="#latest"
              className="inline-flex items-center gap-2 rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              Latest insights
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>
      </section>

      <section className="space-y-10" id="latest">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              Fresh from the notebook
            </h2>
            <p className="text-sm text-zinc-400">
              Hand-picked highlights from the newest essays.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-300 transition hover:text-blue-100"
          >
            View all posts
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {latestPosts.map(({ slug, frontmatter }) => (
            <article
              key={slug}
              className="group flex h-full flex-col justify-between rounded-2xl border border-white/5 bg-white/5 p-6 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
            >
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-200">
                  {frontmatter.category ?? "Uncategorized"}
                </p>
                <h3 className="text-xl font-semibold text-white transition group-hover:text-emerald-200">
                  <Link href={`/blog/${slug}`}>{frontmatter.title}</Link>
                </h3>
                {frontmatter.excerpt ? (
                  <p className="text-sm text-zinc-200">{frontmatter.excerpt}</p>
                ) : null}
              </div>
              <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
                {formatDate(frontmatter.date)}
              </p>
            </article>
          ))}
        </div>
      </section>

      {highlightedCategories.length ? (
        <section className="space-y-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                Explore by focus area
              </h2>
              <p className="text-sm text-zinc-400">
                Dive straight into the subjects that matter most.
              </p>
            </div>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {highlightedCategories.map(({ category, count }) => (
              <li key={category}>
                <Link
                  href="/blog"
                  className="flex h-full flex-col justify-between rounded-2xl border border-white/5 bg-zinc-900/80 p-6 shadow-lg transition hover:-translate-y-1 hover:border-white/20 hover:bg-zinc-800/80"
                >
                  <div>
                    <p className="text-lg font-semibold text-white">
                      {category ?? "Uncategorized"}
                    </p>
                    <p className="mt-2 text-sm text-zinc-400">
                      {count} {count === 1 ? "article" : "articles"}
                    </p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300">
                    Browse insights
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
