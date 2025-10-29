import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "src/data/posts");

export type PostFrontmatter = {
  title: string;
  date: string;
  category: string;
  excerpt?: string;
  tags?: string[];
  [key: string]: unknown;
};

export type PostSummary = {
  slug: string;
  frontmatter: PostFrontmatter;
};

export type GroupedPosts = {
  category: string;
  posts: PostSummary[];
};

export function getPostSlugs(): string[] {
  return fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
}

export async function getPostBySlug(slug: string): Promise<{
  frontmatter: PostFrontmatter;
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

  const { data, content } = matter(fileContents);

  const frontmatter: PostFrontmatter = {
    ...data,
    title: typeof data.title === "string" ? data.title : "Untitled",
    date:
      typeof data.date === "string" && data.date.trim().length > 0
        ? data.date
        : new Date().toISOString(),
    category:
      typeof data.category === "string" && data.category.trim().length > 0
        ? data.category
        : "Uncategorized",
    excerpt: typeof data.excerpt === "string" ? data.excerpt : undefined,
    tags: Array.isArray(data.tags)
      ? (data.tags as string[])
      : typeof data.tags === "string"
        ? [data.tags]
        : undefined,
  };

  return {
    frontmatter,
    mdxSource: content,
  };
}

export async function getAllPosts(): Promise<PostSummary[]> {
  const slugs = getPostSlugs().map((filename) =>
    filename.replace(/\.mdx?$/, ""),
  );

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const { frontmatter } = await getPostBySlug(slug);
      return { slug, frontmatter } satisfies PostSummary;
    }),
  );

  return posts.sort((a, b) => {
    const aTime = Date.parse(a.frontmatter.date);
    const bTime = Date.parse(b.frontmatter.date);

    if (Number.isNaN(aTime) && Number.isNaN(bTime)) {
      return a.frontmatter.title.localeCompare(b.frontmatter.title);
    }

    if (Number.isNaN(aTime)) {
      return 1;
    }

    if (Number.isNaN(bTime)) {
      return -1;
    }

    return bTime - aTime;
  });
}

export function groupPostsByCategory(posts: PostSummary[]): GroupedPosts[] {
  const map = new Map<string, PostSummary[]>();

  for (const post of posts) {
    const category = post.frontmatter.category || "Uncategorized";
    const bucket = map.get(category);
    if (bucket) {
      bucket.push(post);
    } else {
      map.set(category, [post]);
    }
  }

  return [...map.entries()]
    .map(([category, categoryPosts]) => ({
      category,
      posts: [...categoryPosts].sort((a, b) => {
        const aTime = Date.parse(a.frontmatter.date);
        const bTime = Date.parse(b.frontmatter.date);

        if (Number.isNaN(aTime) && Number.isNaN(bTime)) {
          return a.frontmatter.title.localeCompare(b.frontmatter.title);
        }

        if (Number.isNaN(aTime)) {
          return 1;
        }

        if (Number.isNaN(bTime)) {
          return -1;
        }

        return bTime - aTime;
      }),
    }))
    .sort((a, b) => a.category.localeCompare(b.category));
}
