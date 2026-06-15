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

## Production Asset Strategy

Local demo images live in `public/templates`. For production, upload preview derivatives to R2 and set:

```bash
NEXT_PUBLIC_TEMPLATE_ASSET_BASE_URL=https://img.openimagetemplates.com
```

The template data prepends this base URL to `/templates/...`, so the same catalogue works locally and against CDN-hosted assets.

See [docs/architecture.md](docs/architecture.md) for cache and moderation details.

## Schema

The Open Image Template schema is published at:

```text
/open-image-template.schema.json
```

Current schema version: `1.0.0`.

## Project Structure

```text
src/lib/templates.ts              Template catalogue and JSON conversion helpers
src/components/GalleryExplorer.tsx Search and category filtering
src/components/TemplateCard.tsx    Gallery cards
src/app/templates/[id]/page.tsx    Static template detail pages
src/app/schema/page.tsx            Schema documentation
src/app/architecture/page.tsx      Production architecture notes
public/templates                   Local demo preview assets
```
