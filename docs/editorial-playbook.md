# Editorial Playbook for Network+ Study Notes

This playbook defines how we will transform the existing Network+ MDX notes into polished, world-class references. Treat it as the single source of truth for voice, structure, formatting, and workflow expectations when collaborating with GPT-5 or performing manual revisions.

## Voice & Tone

- **Professional and encouraging.** Sound like an experienced instructor guiding exam candidates with confidence.
- **Plain-language precision.** Favor short, declarative sentences that explain acronyms on first use.
- **Exam-aware.** Connect concepts to CompTIA Network+ objectives and call out real-world scenarios where appropriate.
- **Active voice.** Avoid filler phrases and passive constructions when practical.

## Structural Principles

1. **Hooking introduction**
   - Summarize the scenario or concept in 2–3 sentences.
   - Mention why the reader should care (exam domain, troubleshooting payoff, etc.).
2. **Concept blocks**
   - Use level-2 (`##`) headings for the primary themes inside each article.
   - Within each block, progress from definition → mechanics → implications.
3. **Actionable anchors**
   - Preserve existing callouts such as **Must Know**, **Exam Tip**, and tables.
   - When expanding bullets into prose, keep the exam objective or practical step explicit.
4. **Wrap-up**
   - Close with a short recap, checklist, or reflection that reinforces retention.

## Formatting Rules

- Retain front matter exactly as written unless a field needs a deliberate update.
- Respect MDX components and shortcodes. Placeholder tokens such as `[[MDX_BLOCK_1]]` will be used in the GPT workflow to prevent accidental edits.
- Use sentence case for headings unless the term is a proper noun (e.g., "Layer 2 – Data Link").
- Convert dense bullet lists into paragraphs or concise tables when clarity improves.
- Code fences should specify the language when obvious (e.g., ```bash for command snippets).
- Keep tables as GitHub-flavored Markdown with descriptive headers.

## Style Guardrails

- Expand abbreviations on first mention: "Quality of Service (QoS)".
- Ensure numerals below 10 are spelled out unless they refer to standards (e.g., "802.1X").
- Replace slang with professional terminology ("nail down" → "validate").
- Prefer "should" or "must" over "you gotta" and similar colloquialisms.

## Review Checklist

Before finalizing an edited MDX file:

1. Verify the front matter is unchanged and the slug still matches the title.
2. Confirm the introduction states the stakes of the concept.
3. Ensure every heading is followed by at least one paragraph of explanatory prose.
4. Validate that tables render correctly and column headings are meaningful.
5. Run `npm run lint` to catch formatting issues introduced during editing.
6. Conduct a spot factual accuracy check—especially for security controls, port numbers, and protocol behaviors.

## Collaboration Workflow

1. **Batch Planning**
   - Use the generated post inventory CSV to identify upcoming editing batches.
   - Group related topics so terminology and tone stay consistent across the set.
2. **GPT-5 Editing Loop**
   - Run the `scripts/gpt5Edit.ts` CLI (documented in `docs/gpt5-editing-loop.md`).
   - Provide GPT-5 with the style summary above plus the raw content.
   - Preserve placeholder tokens and reinject MDX components after GPT editing.
3. **Manual QA**
   - Editors review GPT output in a side-by-side diff.
   - Note any outstanding factual checks or terminology adjustments in the progress tracker spreadsheet.
4. **Sign-off**
   - Once satisfied, commit the changes and move the entry to "Ready for Review" on the project board.

---

Keep this document updated as the editorial strategy evolves. All contributors should reference it before launching a new editing batch.
