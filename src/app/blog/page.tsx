import Link from "next/link";
import { getAllPosts, groupPostsByCategory } from "@/lib/posts";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
});

function formatDate(input: string): string {
  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) {
    return input;
  }

  return dateFormatter.format(parsed);
}

export default async function Page() {
  const posts = await getAllPosts();
  const grouped = groupPostsByCategory(posts);

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Blog
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Browse the latest updates grouped by their focus area.
        </p>
      </header>

      <div className="space-y-12">
        {grouped.map(({ category, posts: categoryPosts }) => (
          <section key={category} className="space-y-4">
            <div className="flex items-baseline justify-between border-b border-border pb-2">
              <h2 className="text-2xl font-semibold text-foreground">
                {category}
              </h2>
              <span className="text-sm text-muted-foreground">
                {categoryPosts.length}{" "}
                {categoryPosts.length === 1 ? "post" : "posts"}
              </span>
            </div>

            <ul className="space-y-3">
              {categoryPosts.map(({ slug, frontmatter }) => (
                <li
                  key={slug}
                  className="group rounded-lg border border-border/0 transition hover:border-border hover:bg-muted/40"
                >
                  <Link href={`/blog/${slug}`} className="block px-4 py-3">
                    <p className="font-medium text-foreground transition group-hover:text-primary">
                      {frontmatter.title}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatDate(frontmatter.date)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
