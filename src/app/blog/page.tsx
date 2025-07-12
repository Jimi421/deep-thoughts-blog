import Link from "next/link";
import { getPostSlugs, getPostBySlug } from "@/lib/posts";

export default async function Page() {
  const slugs = getPostSlugs().map((filename) => filename.replace(/\.mdx?$/, ""));
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const { frontmatter } = await getPostBySlug(slug);
      return { slug, title: frontmatter.title as string };
    })
  );

  return (
    <div className="prose mx-auto py-12">
      <h1>Blog</h1>
      <ul>
        {posts.map(({ slug, title }) => (
          <li key={slug}>
            <Link href={`/blog/${slug}`}>{title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
