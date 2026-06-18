# Open Image Templates Architecture

## Goal

Open Image Templates should be mostly static, crawlable, and cheap to operate even with a large image catalogue.

## Recommended Production Shape

- Next.js app on Vercel or Cloudflare Pages for HTML, routes, and static data.
- Cloudflare R2 as the image origin.
- Cloudflare custom domain for public assets: `assets.openimagetemplates.com`.
- Template metadata in git for curated public templates.
- Community submissions stored in a private R2 prefix until moderation.

## Image Delivery

Do not route gallery images through the application server.

Open Image Templates owns the public asset URLs. NanoGPT and other generators should consume template JSON and preview images from this project and the `assets.openimagetemplates.com` asset host.

Store these derivatives per template:

- `preview.webp`: 512-768px wide for cards.
- `detail.webp`: 1200-1600px wide for detail pages.
- `original`: retained for provenance or future derivatives.

Use immutable object keys:

```text
templates/{templateId}/{generatedAt}/schema-{schemaVersion}/preview.webp
templates/{templateId}/{generatedAt}/schema-{schemaVersion}/detail.webp
```

Recommended cache headers:

```text
Cache-Control: public, max-age=31536000, immutable
Content-Type: image/webp
```

## Why R2

R2 is a good fit because the object store is close to Cloudflare's edge and avoids Cloudflare egress fees. The app only serves HTML and JSON. The expensive path, image bytes, is handled by CDN caching.

## Moderation Flow

1. User submits template JSON and optional example image.
2. Store raw submission in private R2.
3. Notify review channel.
4. Review schema validity, prompt quality, rights, and content tier.
5. Generate approved preview derivatives.
6. Publish JSON to the catalogue and move images to the public R2 prefix.

## Scaling Path

Start with static metadata in this repo. Move to a generated `catalogue.json` when the template count grows. Use D1, Postgres, or Turso only when editorial workflows need multi-user review state.
