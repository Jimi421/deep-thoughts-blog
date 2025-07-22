import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "src/data/posts");

export function getPostSlugs(): string[] {
  return fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
}

export async function getPostBySlug(slug: string): Promise<{
  frontmatter: {
    title: string;
    date: string;
    excerpt?: string;
    [key: string]: unknown;
  };
  mdxSource: string;
}> {
  const realSlug = slug.replace(/\.mdx?$/, "");

  // Try .mdx first, then .md
  let fullPath = path.join(postsDirectory, `${realSlug}.mdx`);
  if (!fs.existsSync(fullPath)) {
    fullPath = path.join(postsDirectory, `${realSlug}.md`);
  }

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Post not found: ${realSlug}`);
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Don't use type assertion, let gray-matter return its default type
  const { data, content } = matter(fileContents);

  // Validate and transform the data
  const frontmatter = {
    title: (data.title as string) || "Untitled",
    date: (data.date as string) || new Date().toISOString(),
    excerpt: data.excerpt as string | undefined,
    ...data, // Include any other properties
  };

  return {
    frontmatter,
    mdxSource: content,
  };
}
