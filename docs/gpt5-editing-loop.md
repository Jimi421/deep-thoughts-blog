# GPT-5 Editing Loop

This guide explains how to run the automated editing workflow that prepares MDX posts for GPT-5, sends them to the model, and reconstructs the final article.

## Prerequisites

- Node.js 18+
- An `OPENAI_API_KEY` environment variable with access to GPT-5 (or the selected editing model)
- `npm install` executed to ensure local dependencies are available

## Command Overview

```bash
npx tsx scripts/gpt5Edit.ts <path-to-mdx> [--out <output-file>] [--dry-run]
```

### Required Argument

- `<path-to-mdx>`: Relative path to the MDX file that should be processed.

### Optional Flags

- `--out <output-file>`: Write the edited content to this path instead of overwriting the source file. Useful when drafting or comparing versions.
- `--dry-run`: Skip the OpenAI request and only display the prompt that would be sent. Helpful for verifying placeholders or debugging.
- `--notes <text>`: Provide extra guidance (e.g., "focus on simplifying the VLAN explanation").

## How It Works

1. **Front matter isolation** – The script uses `gray-matter` to separate YAML front matter from the MDX body.
2. **Placeholder extraction** – MDX components such as `<Callout>` blocks are replaced with numbered tokens (`[[MDX_BLOCK_1]]`). The original snippets are stored for re-injection.
3. **Prompt construction** – The editorial playbook is summarized, the raw content is embedded, and explicit instructions remind GPT-5 to preserve tokens and formatting while improving clarity.
4. **Model call** – The prompt is sent to GPT-5 unless `--dry-run` is specified.
5. **Reassembly** – The edited prose is merged with the saved front matter and placeholders, producing a clean MDX document that is ready for manual QA.

## Example

```bash
OPENAI_API_KEY=sk-... npx tsx scripts/gpt5Edit.ts src/data/posts/osi-model.mdx --out drafts/osi-model-polished.mdx
```

After the command completes, review the output file, confirm the callouts render correctly, and then replace the original MDX when satisfied.

## Troubleshooting

- **Placeholders altered**: If GPT-5 changes a placeholder token, rerun the command with `--dry-run` and remind the model to keep tokens exactly as provided.
- **Formatting drift**: Run `npm run lint` after accepting the output to fix spacing or Markdown alignment.
- **API errors**: Ensure the `OPENAI_API_KEY` is present and the account has access to the requested model name.

Keep this workflow in sync with any updates to the editorial playbook or OpenAI API requirements.
