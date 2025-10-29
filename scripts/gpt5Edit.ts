import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { OpenAI } from "openai";

interface CliOptions {
  sourcePath: string;
  outPath?: string;
  dryRun?: boolean;
  notes?: string;
}

interface PlaceholderExtraction {
  contentWithPlaceholders: string;
  placeholderMap: Map<string, string>;
}

const MODEL_NAME = process.env.GPT5_MODEL ?? "gpt-5.0";

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!options) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const absoluteSource = path.resolve(process.cwd(), options.sourcePath);
  const sourceFile = await fs.readFile(absoluteSource, "utf8");
  const parsed = matter(sourceFile);

  const { contentWithPlaceholders, placeholderMap } = extractPlaceholders(
    parsed.content,
  );
  const editorialSummary = await loadEditorialSummary();

  const prompt = buildPrompt({
    editorialSummary,
    content: contentWithPlaceholders,
    notes: options.notes,
  });

  if (options.dryRun) {
    console.log("--- DRY RUN ---");
    console.log(prompt);
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is required unless running with --dry-run.",
    );
  }

  const client = new OpenAI({ apiKey });
  const response = await client.responses.create({
    model: MODEL_NAME,
    input: [
      {
        role: "system",
        content:
          "You are a senior technical editor who specializes in CompTIA Network+ study materials. Elevate grammar, clarity, and flow while preserving the structure, headings, and any placeholder tokens.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.2,
  });

  const outputText = response.output_text?.trim();
  if (!outputText) {
    throw new Error("GPT-5 response did not include any text.");
  }

  const restoredContent = restorePlaceholders(outputText, placeholderMap);
  const finalDocument = matter.stringify(restoredContent, parsed.data);

  const targetPath = options.outPath
    ? path.resolve(process.cwd(), options.outPath)
    : absoluteSource;
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, finalDocument, "utf8");

  console.log(
    `Edited content written to ${path.relative(process.cwd(), targetPath)}`,
  );
}

function parseArgs(args: string[]): CliOptions | null {
  if (args.length === 0) {
    return null;
  }

  const options: CliOptions = { sourcePath: args[0] };

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--out" && args[i + 1]) {
      options.outPath = args[++i];
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--notes" && args[i + 1]) {
      options.notes = args[++i];
    }
  }

  return options;
}

function extractPlaceholders(content: string): PlaceholderExtraction {
  const placeholderMap = new Map<string, string>();
  let placeholderIndex = 1;

  const pattern =
    /<([A-Z][\w-]*)([^>]*)>([\s\S]*?)<\/\1>|<([A-Z][\w-]*)([^>]*)\/>/g;

  const contentWithPlaceholders = content.replace(pattern, (match) => {
    const token = `[[MDX_BLOCK_${placeholderIndex++}]]`;
    placeholderMap.set(token, match);
    return token;
  });

  return { contentWithPlaceholders, placeholderMap };
}

function restorePlaceholders(
  content: string,
  placeholderMap: Map<string, string>,
): string {
  let restored = content;
  for (const [token, original] of placeholderMap.entries()) {
    const regex = new RegExp(
      token.replace(/[[\]]/g, (char) => `\\${char}`),
      "g",
    );
    restored = restored.replace(regex, original);
  }
  return restored;
}

async function loadEditorialSummary(): Promise<string> {
  const playbookPath = path.join(
    process.cwd(),
    "docs",
    "editorial-playbook.md",
  );
  try {
    const summary = await fs.readFile(playbookPath, "utf8");
    return summary;
  } catch {
    console.warn("Warning: Unable to load editorial playbook.");
    return "Follow the established editorial guidelines for CompTIA Network+ study materials.";
  }
}

function buildPrompt({
  editorialSummary,
  content,
  notes,
}: {
  editorialSummary: string;
  content: string;
  notes?: string;
}): string {
  return [
    "Polish the following MDX article according to the editorial rules.",
    "",
    "Editorial summary:",
    editorialSummary,
    "",
    notes ? `Additional notes: ${notes}` : "",
    "",
    "Remember:",
    "- Keep all placeholder tokens such as [[MDX_BLOCK_1]] exactly as provided.",
    "- Preserve the existing heading hierarchy and tables.",
    "- Improve grammar, clarity, and cohesion.",
    "- Expand terse bullet lists into flowing prose when appropriate.",
    "",
    "--- BEGIN MDX CONTENT ---",
    content,
    "--- END MDX CONTENT ---",
  ]
    .filter(Boolean)
    .join("\n");
}

function printUsage() {
  console.log(
    'Usage: npx tsx scripts/gpt5Edit.ts <path-to-mdx> [--out <output-file>] [--dry-run] [--notes "additional guidance"]',
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
