# NanoGPT Integration Contract

Open Image Templates owns the public catalogue and all public assets used by that catalogue. NanoGPT lists and applies those templates as a consumer.

## Public inputs

| Purpose | URL |
| --- | --- |
| Full catalogue | `https://www.openimagetemplates.com/templates.json` |
| One template | `https://www.openimagetemplates.com/templates/{id}.json` |
| JSON schema | `https://www.openimagetemplates.com/open-image-template.schema.json` |
| Images | URLs below `https://assets.openimagetemplates.com/` supplied by the feed |

NanoGPT should fetch the full catalogue on the server or during its build, validate `standard` and the supported `schema_version`, then cache the last valid result. A refresh failure must not replace a valid cached catalogue with an empty list.

## Field mapping

| NanoGPT use | Portable field |
| --- | --- |
| Stable key | `id` |
| Browser title and description | `title`, `description` |
| Filters | `category`, `tags` |
| Compact prompt and applied prompt | `summary_prompt`, `prompt` |
| No-input fallback | `demo_prompt` |
| Editable inputs | `slots`, `controls` |
| Preview | `examples[0].image_url`, `examples[0].image_alt` |
| Suggested model and defaults | `suggested_models[0].id`, `suggested_models[0].settings` |
| Safety/input UI | `content_tier`, `input_requirements` |
| Attribution | `canonical_url`, `creator`, `license` |

NanoGPT may layer private UI state or model-specific defaults over a template, but the visible prompt, discovery metadata, preview URL, and attribution must come from the public feed. If NanoGPT needs a new portable field, add it to the Open Image Template schema and catalogue first.

## Cutover checklist

1. Add `assets.openimagetemplates.com` to NanoGPT's image and content-security allowlists.
2. Replace the static `app/media/promptTemplates.ts` catalogue with a feed adapter.
3. Stop importing preview images from `public/prompt-templates` and look thumbnails from `public/prompt-template-knobs`.
4. Keep personal/local templates separate from the public feed and give their IDs a distinct namespace.
5. Exercise search, category filtering, slot compilation, suggested-model selection, missing-image fallback, and last-known-good fallback.
6. Remove the duplicated public files only after production traffic is reading the Open Image Templates URLs.

The safe release order is assets, Open Image Templates metadata, NanoGPT consumer, then deletion of NanoGPT duplicates.
