import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Callout from "@/components/Callout";
import { getPostSlugs, getPostBySlug } from "@/lib/posts";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
});

function formatDate(input: string): string {
  const parsed = new Date(input);
  return Number.isNaN(parsed.getTime()) ? input : dateFormatter.format(parsed);
}

const mdxComponents = {
  Callout,
};

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const slugs = getPostSlugs()
    .filter(
      (filename: string) =>
        filename.endsWith(".mdx") || filename.endsWith(".md"),
    )
    .map((filename: string) => filename.replace(/\.mdx?$/, ""));

  return slugs.map((slug: string) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  let post;
  try {
    post = await getPostBySlug(slug);
  } catch {
    return notFound();
  }

  const { frontmatter, mdxSource } = post;
  const formattedDate = formatDate(frontmatter.date);
  const tags = Array.isArray(frontmatter.tags)
    ? (frontmatter.tags as string[])
    : undefined;

  return (
    <article className="mx-auto max-w-3xl space-y-8 py-12">
      <header className="space-y-4">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm font-medium text-blue-400 transition hover:text-blue-200"
        >
          ← Back to all writing
        </Link>
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
            {frontmatter.category ?? "Uncategorized"}
          </p>
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
            {frontmatter.title}
          </h1>
          <p className="text-sm text-zinc-400">{formattedDate}</p>
          {frontmatter.excerpt ? (
            <p className="text-base text-zinc-200">{frontmatter.excerpt}</p>
          ) : null}
        </div>
        {tags?.length ? (
          <ul className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium uppercase tracking-wide text-zinc-200"
              >
                #{tag}
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      <div className="prose prose-invert max-w-none">
        <MDXRemote source={mdxSource} components={mdxComponents} />
      </div>
    </article>
  );
}
