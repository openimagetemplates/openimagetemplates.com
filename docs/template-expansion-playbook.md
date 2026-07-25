# Template Expansion Playbook

This playbook describes how we find, design, generate, review, and publish new Open Image Templates without drifting into duplicate prompts or hidden provider-specific behavior.

## Goal

Open Image Templates should be a curated catalogue of reusable image prompt recipes. Each template should be easy to understand, easy to modify, portable across generators, and visible as plain prompt structure rather than a hidden prompt trick.

Good templates have:

- A clear use case people repeatedly need.
- Editable variables that make the template reusable.
- A preview image that honestly represents the template.
- Metadata that makes the template searchable by humans, Google, and AI crawlers.
- Original wording, even when inspired by broader prompt trends.

## Source Signals

Start with demand before adding supply.

Use internal signals first:

- Template usage and copied prompts.
- Search terms from site analytics and Cloudflare/Vercel events.
- NanoGPT prompt template usage.
- Community submissions and rejected-but-promising ideas.
- Repeated user edits in the template builder.
- Categories where the catalogue feels thin.

Use external inspiration second:

- PromptHero and similar prompt galleries.
- Nano Banana and Midjourney prompt pages.
- Figma Community, Dribbble, Behance, editorial design references.
- Product photography, portrait, branding, fashion, cinematic, and ecommerce trend pages.

Do not copy external prompts verbatim. Treat them as signal for user intent, composition patterns, and visual language, then write an original template.

## Batch Planning

For a focused quality pass, add 5-10 templates. For a catalogue expansion pass, add 20-30 only after checking for overlap.

Before writing templates:

1. Inspect the current catalogue in `src/data/nanogpt-prompt-templates.json`.
2. List existing categories, tags, suggested models, and template titles.
3. Identify gaps by use case, not just by style.
4. Reject ideas that are only minor wording changes of existing templates.
5. Decide the batch theme, for example portraits, ecommerce products, brand visuals, cinematic scenes, or creator thumbnails.

## Selection Criteria

Choose candidates that pass most of these checks:

- **Demand:** Someone is likely to search for or reuse this more than once.
- **Difference:** It adds a meaningfully new output type, composition, or workflow.
- **Reusability:** It has editable slots that matter.
- **Preview clarity:** The difference is visible at tile size.
- **Portability:** It works as a prompt recipe, not only inside one provider.
- **Searchability:** The title, description, tags, and prompt contain natural terms people search for.
- **Safety:** Avoid celebrities, living-artist mimicry, copyrighted characters, private people, brand misuse, and explicit sexual framing.

## Template Shape

Each public template should include the same core data shape used by the catalogue:

- `id`: stable kebab-case identifier.
- `title`: human-readable and specific.
- `description`: one-sentence catalogue summary.
- `category`: use an existing category when possible.
- `tags`: search-friendly, lowercase where practical.
- `image`: public preview URL from `https://assets.openimagetemplates.com`.
- `imageAlt`: descriptive alt text for the preview.
- `prompt`: the model-ready prompt with slot references.
- `negativePrompt`: optional constraints.
- `slots`: editable variables with name, label, and example.
- `suggestedModel`: optional model hint when there is a real reason.
- `schemaVersion`: current schema version.

Prefer 2-5 slots. If a user cannot reasonably change a detail, it probably should not be a slot.

Good slot examples:

- `Subject`
- `Setting`
- `Lighting`
- `Product`
- `Material`
- `Mood`
- `Camera angle`

Avoid slots that are too vague:

- `Thing`
- `Detail`
- `Style 1`
- `Text`

## Prompt Writing Rules

Write prompts as visible composition recipes.

A strong prompt usually includes:

- The subject or product.
- The setting or background.
- Composition and framing.
- Lighting, color, material, or style direction.
- Practical constraints, such as no readable text or clean ecommerce layout.

Use editable variables in braces, for example `{Subject}` or `{Lighting}`. The prompt should still read naturally after the slot values are inserted.

Avoid:

- Hidden instructions.
- Provider names in the user-facing prompt unless the model suggestion is intentional metadata.
- Long style piles that do not change the image in a meaningful way.
- Copyrighted characters, celebrity lookalikes, or living-artist imitation.
- Overly generic prompts such as "beautiful cinematic image of subject".

## Preview Generation

The preview image is part of the template quality. It must represent the exact template, not a random good-looking image.

Preview rules:

- Generate a preview from the final prompt, using realistic slot examples.
- Use GPT Image 2 unless a different suggested model is part of the template concept.
- Prefer a single strong preview over several weak ones.
- Use portrait or tall previews where the template benefits from it.
- Keep image subjects safe and broadly usable.
- Do not use generic fallback art if a template has no preview.

Asset naming should be stable and descriptive:

```text
prompt-templates/{template-id}--generated-YYYY-MM-DD--schema-v1.0.0.webp
```

Upload public preview assets to the R2 public assets bucket and reference them through:

```text
https://assets.openimagetemplates.com/prompt-templates/{filename}.webp
```

## Adding Templates

The public catalogue currently lives in:

```text
src/data/nanogpt-prompt-templates.json
```

If templates were created or updated in NanoGPT first, sync them into this project:

```bash
npm run sync:templates
```

Useful sync environment variables:

```bash
NANOGPT_PROJECT_DIR=/path/to/NanoGPT
OIT_TEMPLATE_ASSET_BASE_URL=https://assets.openimagetemplates.com
```

Going forward, Open Image Templates should remain the source of truth. NanoGPT and other platforms should consume template JSON and preview images from OIT rather than maintaining a separate catalogue.

## Quality Checklist

Before release, verify:

- No duplicate `id`.
- No near-duplicate title or use case.
- Every preview URL returns `200` and an image content type.
- Every template has useful `imageAlt`.
- Slot names match prompt placeholders.
- Prompt remains readable after slot replacement.
- Category and tags are search-friendly.
- `/templates` shows the template correctly.
- `/templates/{id}` renders the detail page.
- `/templates/{id}.json` returns the template schema.
- `/templates.json` includes the public catalogue.
- Hidden or sensitive templates are not exposed unintentionally.

For code or catalogue changes, run:

```bash
npm run lint
npm run build
```

For doc-only changes, a diff/status check is enough.

## Community Submissions

Community-submitted templates should stay private until reviewed.

Review for:

- Schema validity.
- Clear reuse case.
- Original prompt wording.
- Safe subject matter.
- Non-infringing preview.
- No hidden provider details.
- Search-friendly metadata.

Approved submissions can be moved into the public catalogue and have their preview assets uploaded to the public R2 prefix.

## Release Notes

When announcing a batch, focus on customer-facing value:

- What users can create now.
- Which categories became stronger.
- Example before/after prompts.
- A few standout templates with direct links.

Avoid announcing internal refactors, schema chores, or moderation plumbing unless the audience is developers.

## Repeatable Batch Workflow

1. Pull internal search and usage signals.
2. Scan external inspiration for trends, not wording to copy.
3. Pick a batch theme and target count.
4. Compare against the existing catalogue.
5. Draft original template titles, slots, prompts, descriptions, tags, and categories.
6. Generate representative preview images.
7. Upload previews to R2.
8. Add templates to the catalogue.
9. QA pages, JSON endpoints, images, and search metadata.
10. Commit, deploy, and announce when ready.
