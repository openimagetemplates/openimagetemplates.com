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

## Canonical Catalogue

This repository is the source of truth for public template metadata. Edit and review the canonical catalogue here:

```text
src/data/templates.json
```

Public template previews and visual-control thumbnails are served from the Open Image Templates R2-backed asset domain:

```text
https://assets.openimagetemplates.com
```

NanoGPT and other integrations consume the published catalogue and asset URLs. They must not define a second public catalogue or copy these assets into their application deployments.

Validate catalogue changes before committing:

```bash
npm run validate:catalog
```

Publish a directory of immutable previews before referencing them from the catalogue:

```bash
npm run assets:publish -- \
  --source-dir /path/to/previews \
  --prefix prompt-templates \
  --env-file /path/to/cloudflare.env
```

Consumers can fetch the full public catalogue from:

```text
https://www.openimagetemplates.com/templates.json
```

Individual portable templates are available at:

```text
https://www.openimagetemplates.com/templates/{id}.json
```

Both endpoints allow cross-origin reads and publish CDN cache headers. See [the NanoGPT integration contract](docs/nanogpt-integration.md) for the consumer mapping and release order.

## Schema

The Open Image Template schema is published at:

```text
/open-image-template.schema.json
```

Current schema version: `1.1.0`.

## Project Structure

```text
scripts/validate-template-catalog.mjs Validate canonical metadata and asset ownership
src/data/templates.json             Canonical public template catalogue
src/lib/templates.ts              Template adapter and JSON conversion helpers
src/components/GalleryExplorer.tsx Search and category filtering
src/components/TemplateCard.tsx    Gallery cards
src/app/templates/[id]/page.tsx    Static template detail pages
src/app/api/templates/[id]/route.ts JSON template endpoint behind /templates/{id}.json
src/app/schema/page.tsx            Schema documentation
```
