# Open Image Template schema changelog

All notable changes to the public Open Image Template schema are recorded here.

The schema follows Semantic Versioning:

- Major versions contain breaking changes.
- Minor versions add backward-compatible fields or capabilities.
- Patch versions clarify or correct the schema without intentionally changing compatibility.

Any edit to `public/open-image-template.schema.json` must increase the version, update
`TEMPLATE_SCHEMA_VERSION` in `src/lib/templates.ts`, and add a dated entry here.
`npm run check:schema` enforces those requirements against the current Git base revision.

## [1.2.0] - 2026-07-25

### Added

- Added the optional `nsfw` boolean for sensitive 18+ preview content. It defaults to `false`.
- Added canonical catalogue metadata: `tags`, `canonical_url`, `summary_prompt`, `demo_prompt`, `content_tier`, and `input_requirements`.
- Added suggested-model `settings`, example `image_alt`, and `source_notes` metadata.
- Added an `x-schema-version` marker so the published schema advertises its own current version.

## [1.1.0] - 2026-06-16

### Added

- Added prompt-builder `controls`, including slots, look options, details, and toggles.
- Added optional suggested-model labels and expanded field descriptions.

## [1.0.0] - 2026-06-15

### Added

- Published the initial Open Image Template schema.
