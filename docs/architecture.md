# Open Image Templates Architecture

## Goal

Open Image Templates should be mostly static, crawlable, and cheap to operate even with a large image catalogue.

## Production Ownership

- Next.js app on Vercel or Cloudflare Pages for HTML, routes, and static data.
- Cloudflare R2 as the image origin.
- Cloudflare custom domain for public assets: `assets.openimagetemplates.com`.
- Canonical template metadata in `src/data/templates.json` in this repository.
- Community submissions stored in a private R2 prefix until moderation.
- NanoGPT is a catalogue consumer and generator integration, not a metadata or asset origin.

## Image Delivery

Do not route gallery images through the application server.

Open Image Templates owns the public asset URLs. NanoGPT and other generators should consume template JSON and preview images from this project and the `assets.openimagetemplates.com` asset host.

The current immutable public prefixes are:

```text
prompt-templates/*
prompt-template-knobs/*
```

Neither prefix may resolve to, redirect to, or be generated from a NanoGPT deployment URL at request time.

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

## Release Order

1. Upload new immutable image objects to the Open Image Templates R2 bucket.
2. Verify every public asset URL returns the expected content type and immutable cache headers.
3. Update `src/data/templates.json` and run `npm run validate:catalog`.
4. Deploy Open Image Templates and verify `/templates.json` plus changed per-template JSON routes.
5. Let NanoGPT refresh its cached copy of the public catalogue.

Publishing assets before metadata prevents consumers from observing broken images. A rollback reverts the metadata commit; immutable assets can remain safely in R2.

## Consumer Contract

The public feed at `/templates.json` is the integration boundary. It is CORS-readable, statically generated, and CDN cached. Consumers should cache the last valid response and retain it if a refresh fails or returns an unsupported schema version. They should render `examples[0].image_url` directly and never proxy or re-upload the image bytes.

NanoGPT-specific mapping and rollout details live in [nanogpt-integration.md](nanogpt-integration.md).

## Scaling Path

Keep curated metadata in git while review is single-writer. Move authoring state to D1, Postgres, or Turso only when editorial workflows need multi-user review, but continue generating the same public feed so consumers remain decoupled from the storage implementation.
