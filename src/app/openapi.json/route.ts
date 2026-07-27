import { absoluteUrl } from "@/lib/seo";
import { TEMPLATE_SCHEMA_VERSION } from "@/lib/templates";

export const dynamic = "force-static";

const compactTemplateSchema = {
  type: "object",
  required: [
    "id",
    "title",
    "description",
    "category",
    "tags",
    "suggested_model",
    "content_tier",
    "requires_image",
    "canonical_url",
    "json_url",
    "generated_at",
  ],
  properties: {
    id: { type: "string" },
    title: { type: "string" },
    description: { type: "string" },
    category: { type: "string" },
    tags: { type: "array", items: { type: "string" } },
    aspect_ratio: { type: "string" },
    suggested_model: { type: "string" },
    content_tier: { type: "string", enum: ["sfw", "suggestive-capable"] },
    requires_image: { type: "boolean" },
    canonical_url: { type: "string", format: "uri" },
    json_url: { type: "string", format: "uri" },
    image_url: { type: "string", format: "uri" },
    image_alt: { type: "string" },
    generated_at: { type: "string" },
  },
} as const;

export function GET() {
  return Response.json(
    {
      openapi: "3.1.0",
      info: {
        title: "Open Image Templates Discovery API",
        version: TEMPLATE_SCHEMA_VERSION,
        description:
          "Read-only public API for finding and retrieving reusable AI image prompt templates. No authentication is required.",
        license: {
          name: "CC BY 4.0",
          url: "https://creativecommons.org/licenses/by/4.0/",
        },
      },
      servers: [{ url: absoluteUrl("/") }],
      paths: {
        "/api/templates/search": {
          get: {
            operationId: "searchTemplates",
            summary: "Search the template catalog",
            description:
              "Returns compact ranked template records. Fetch a result's json_url only when the complete prompt and controls are needed.",
            parameters: [
              {
                name: "q",
                in: "query",
                description: "Free-text search across title, tags, category, description, and summary prompt.",
                schema: { type: "string", maxLength: 120 },
              },
              {
                name: "category",
                in: "query",
                schema: {
                  type: "string",
                  enum: ["Portrait", "Lifestyle", "Product", "Character", "Cinematic", "Design", "Other"],
                },
              },
              { name: "tag", in: "query", schema: { type: "string" } },
              { name: "model", in: "query", schema: { type: "string" } },
              { name: "aspect_ratio", in: "query", schema: { type: "string" } },
              {
                name: "content_tier",
                in: "query",
                schema: { type: "string", enum: ["sfw", "suggestive-capable"] },
              },
              {
                name: "include_nsfw",
                in: "query",
                description: "Sensitive templates are excluded unless explicitly requested.",
                schema: { type: "boolean", default: false },
              },
              {
                name: "limit",
                in: "query",
                schema: { type: "integer", minimum: 1, maximum: 100, default: 20 },
              },
              {
                name: "offset",
                in: "query",
                schema: { type: "integer", minimum: 0, maximum: 10000, default: 0 },
              },
            ],
            responses: {
              "200": {
                description: "Ranked compact template results.",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        pagination: {
                          type: "object",
                          properties: {
                            total: { type: "integer" },
                            offset: { type: "integer" },
                            limit: { type: "integer" },
                            returned: { type: "integer" },
                            has_more: { type: "boolean" },
                          },
                        },
                        results: { type: "array", items: compactTemplateSchema },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "/templates-index.json": {
          get: {
            operationId: "listTemplates",
            summary: "List the compact template catalog",
            responses: {
              "200": {
                description: "Compact catalog without full prompt payloads.",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        total: { type: "integer" },
                        templates: { type: "array", items: compactTemplateSchema },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "/templates/{id}.json": {
          get: {
            operationId: "getTemplate",
            summary: "Get one complete portable template",
            parameters: [
              {
                name: "id",
                in: "path",
                required: true,
                schema: { type: "string" },
              },
            ],
            responses: {
              "200": {
                description: "Complete template following the Open Image Template JSON Schema.",
                content: {
                  "application/json": {
                    schema: {
                      $ref: absoluteUrl("/open-image-template.schema.json"),
                    },
                  },
                },
              },
              "404": {
                description: "Template not found.",
              },
            },
          },
        },
      },
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300, s-maxage=86400, stale-while-revalidate=86400",
        "Content-Type": "application/vnd.oai.openapi+json; charset=utf-8",
        "X-Robots-Tag": "noindex",
      },
    },
  );
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
