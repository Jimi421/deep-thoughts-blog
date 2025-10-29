import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "src", "data", "posts");
const OUTPUT_PATH = path.join(process.cwd(), "docs", "post-inventory.csv");

type InventoryRow = {
  slug: string;
  title: string;
  wordCount: number;
  readingTimeMinutes: number;
  effort: "Outline" | "Light" | "Medium" | "Heavy";
};

async function main() {
  const files = await collectMdxFiles(POSTS_DIR);
  const rows: InventoryRow[] = [];

  for (const file of files) {
    const fileContent = await fs.readFile(file, "utf8");
    const { data, content } = matter(fileContent);
    const slug = path.basename(file, path.extname(file));
    const title =
      typeof data.title === "string" && data.title.trim().length > 0
        ? data.title.trim()
        : slug;
    const wordCount = countWords(content);
    const readingTimeMinutes = +(wordCount / 200).toFixed(1);
    const effort = categorizeEffort(wordCount);

    rows.push({ slug, title, wordCount, readingTimeMinutes, effort });
  }

  rows.sort((a, b) => a.slug.localeCompare(b.slug));

  const header = "slug,title,wordCount,readingTimeMinutes,effort";
  const csvLines = rows.map((row) =>
    [
      row.slug,
      escapeCsv(row.title),
      row.wordCount,
      row.readingTimeMinutes,
      row.effort,
    ].join(","),
  );

  const csv = [header, ...csvLines].join("\n");
  await fs.writeFile(OUTPUT_PATH, csv, "utf8");

  console.log(`Inventory generated for ${rows.length} posts.`);
  console.log(`Saved to ${path.relative(process.cwd(), OUTPUT_PATH)}`);
}

async function collectMdxFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectMdxFiles(fullPath)));
    } else if (entry.isFile() && fullPath.endsWith(".mdx")) {
      files.push(fullPath);
    }
  }

  return files;
}

function countWords(content: string): number {
  const stripped = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/[^A-Za-z0-9']+/g, " ")
    .trim();

  if (!stripped) {
    return 0;
  }

  return stripped.split(/\s+/).length;
}

function categorizeEffort(wordCount: number): InventoryRow["effort"] {
  if (wordCount < 150) return "Outline";
  if (wordCount < 400) return "Light";
  if (wordCount < 800) return "Medium";
  return "Heavy";
}

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

main().catch((error) => {
  console.error("Failed to generate inventory.");
  console.error(error);
  process.exitCode = 1;
});
