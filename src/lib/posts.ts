// src/lib/posts.ts

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";

const postsDir = path.join(process.cwd(), "src", "data", "posts");

/**
 * Returns an array of post filenames (only .md or .mdx)
 */
export function getPostSlugs(): string[] {
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
}

/**
 * Given a slug (filename without extension), returns
 * frontmatter and serialized MDX source
 */
export async function getPostBySlug(slug: string) {
  const fullPath = path.join(postsDir, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const mdxSource = await serialize(content);
  return {
    frontmatter: data,
    mdxSource,
  };
}
