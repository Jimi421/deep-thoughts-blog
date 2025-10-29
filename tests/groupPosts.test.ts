import { strict as assert } from "node:assert";
import test from "node:test";

import { groupPostsByCategory, type PostSummary } from "../src/lib/posts";

test("groupPostsByCategory sorts categories alphabetically and posts by date", () => {
  const posts: PostSummary[] = [
    {
      slug: "b",
      frontmatter: {
        title: "Second",
        date: "2024-01-10",
        category: "General",
      },
    },
    {
      slug: "a",
      frontmatter: {
        title: "First",
        date: "2023-12-30",
        category: "General",
      },
    },
    {
      slug: "network-post",
      frontmatter: {
        title: "Network",
        date: "2024-02-01",
        category: "Network+ Exam",
      },
    },
  ];

  const grouped = groupPostsByCategory(posts);

  assert.equal(grouped.length, 2);
  assert.deepEqual(
    grouped.map((group) => ({
      category: group.category,
      slugs: group.posts.map((post) => post.slug),
    })),
    [
      { category: "General", slugs: ["b", "a"] },
      { category: "Network+ Exam", slugs: ["network-post"] },
    ],
  );
});
