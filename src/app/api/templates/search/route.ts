import { buildPublicTemplateApiHeaders } from "@/lib/public-template-api";
import {
  searchTemplates,
  TEMPLATE_CATALOG_GENERATED_AT,
  TEMPLATE_SCHEMA_VERSION,
  toCompactTemplateJson,
} from "@/lib/templates";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = boundedValue(searchParams.get("q"), 120);
  const category = boundedValue(searchParams.get("category"), 40);
  const tag = boundedValue(searchParams.get("tag"), 80);
  const model = boundedValue(searchParams.get("model"), 80);
  const aspectRatio = boundedValue(searchParams.get("aspect_ratio"), 20);
  const contentTier = boundedValue(searchParams.get("content_tier"), 40);
  const includeNsfw = searchParams.get("include_nsfw") === "true";
  const limit = boundedInteger(searchParams.get("limit"), DEFAULT_LIMIT, 1, MAX_LIMIT);
  const offset = boundedInteger(searchParams.get("offset"), 0, 0, 10_000);

  const matches = searchTemplates({
    query,
    category,
    tag,
    model,
    aspectRatio,
    contentTier,
    includeNsfw,
  });
  const results = matches.slice(offset, offset + limit).map(toCompactTemplateJson);
  const queryString = searchParams.toString();

  return Response.json(
    {
      standard: "open-image-template-search",
      schema_version: TEMPLATE_SCHEMA_VERSION,
      generated_at: TEMPLATE_CATALOG_GENERATED_AT,
      query: {
        q: query || null,
        category: category || null,
        tag: tag || null,
        model: model || null,
        aspect_ratio: aspectRatio || null,
        content_tier: contentTier || null,
        include_nsfw: includeNsfw,
      },
      pagination: {
        total: matches.length,
        offset,
        limit,
        returned: results.length,
        has_more: offset + results.length < matches.length,
      },
      results,
    },
    {
      headers: buildPublicTemplateApiHeaders({
        canonicalPath: "/templates",
        entityTag: `search-${TEMPLATE_SCHEMA_VERSION}-${TEMPLATE_CATALOG_GENERATED_AT}-${hashKey(queryString)}`,
        lastModified: TEMPLATE_CATALOG_GENERATED_AT,
        totalCount: matches.length,
      }),
    },
  );
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: buildPublicTemplateApiHeaders({
      canonicalPath: "/templates",
      entityTag: `search-${TEMPLATE_SCHEMA_VERSION}-${TEMPLATE_CATALOG_GENERATED_AT}`,
      lastModified: TEMPLATE_CATALOG_GENERATED_AT,
    }),
  });
}

function boundedValue(value: string | null, maxLength: number) {
  return value?.trim().slice(0, maxLength) || undefined;
}

function boundedInteger(value: string | null, fallback: number, min: number, max: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function hashKey(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
}
