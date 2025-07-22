import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostSlugs, getPostBySlug } from "@/lib/posts";

// Generate static params for all posts
export function generateStaticParams() {
  const slugs = getPostSlugs()
    .filter(
      (filename: string) =>
        filename.endsWith(".mdx") || filename.endsWith(".md"),
    )
    .map((filename: string) => filename.replace(/\.mdx?$/, ""));

  return slugs.map((slug: string) => ({ slug }));
}

// Page component with proper typing for async params
interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: Props) {
  // Await the params since they're now a Promise
  const { slug } = await params;

  let post;
  try {
    post = await getPostBySlug(slug);
  } catch {
    return notFound();
  }

  const { frontmatter, mdxSource } = post;

  return (
    <article className="prose prose-invert mx-auto py-12">
      <h1 className="text-4xl font-bold">{frontmatter.title}</h1>
      <p className="text-sm text-gray-500 mb-6">{frontmatter.date}</p>
      <MDXRemote source={mdxSource} components={{}} />
    </article>
  );
}
