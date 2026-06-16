# Open Image Templates

A free, open prompt-template standard and gallery for AI image generation, sponsored by NanoGPT.

The site is designed to be:

- Open: every prompt is visible and copyable.
- Portable: templates are JSON and can be used with any generator.
- Fast: app routes are static-first and image delivery is CDN/R2 oriented.
- NanoGPT-powered: each template can be generated on NanoGPT in one click.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Template Source Of Truth

The public template catalogue is synced from the NanoGPT app catalogue at:

```text
/Users/dev1/worktrees/worktree/white/app/media/promptTemplates.ts
```

Run this after adding or editing templates in NanoGPT:

```bash
npm run sync:templates
```

This writes `src/data/nanogpt-prompt-templates.json`, which the site uses to generate template pages and `/templates/{id}.json` endpoints. The public site filters out templates tagged `candid`.

By default, synced preview images point at `https://nano-gpt.com/prompt-templates/...`. Override with:

```bash
NANOGPT_PROJECT_DIR=/path/to/nano-gpt \
NANOGPT_TEMPLATE_ASSET_BASE_URL=https://your-asset-host.example \
npm run sync:templates
```

## Schema

The Open Image Template schema is published at:

```text
/open-image-template.schema.json
```

Current schema version: `1.0.0`.

## Project Structure

```text
scripts/sync-nanogpt-templates.mjs Sync NanoGPT templates into this project
src/data/nanogpt-prompt-templates.json Generated public template catalogue
src/lib/templates.ts              Template adapter and JSON conversion helpers
src/components/GalleryExplorer.tsx Search and category filtering
src/components/TemplateCard.tsx    Gallery cards
src/app/templates/[id]/page.tsx    Static template detail pages
src/app/api/templates/[id]/route.ts JSON template endpoint behind /templates/{id}.json
src/app/schema/page.tsx            Schema documentation
```
