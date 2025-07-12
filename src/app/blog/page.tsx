// src/app/blog/[slug]/page.tsx

import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostSlugs, getPostBySlug } from "@/lib/posts";

export async function generateStaticParams() {
  const slugs = getPostSlugs()
    .filter((filename) => filename.endsWith(".mdx") || filename.endsWith(".md"))
    .map((filename) => filename.replace(/\.mdx?$/, ""));

  // MUST be an array of plain objects, no promises inside
  return slugs.map((slug) => ({ slug }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  try {
    const post = await getPostBySlug(params.slug);
    const { frontmatter, mdxSource } = post;

    return (
      <article className="prose mx-auto py-12">
        <h1>{frontmatter.title}</h1>
        <p className="text-sm text-gray-500 mb-6">{frontmatter.date}</p>
        <MDXRemote source={mdxSource} components={{}} />
      </article>
    );
  } catch {
    return notFound();
  }
}
