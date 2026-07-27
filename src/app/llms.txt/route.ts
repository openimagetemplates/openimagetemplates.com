import { getPublishedBlogPosts } from "@/lib/blog";
import { docs } from "@/lib/docs";
import { absoluteUrl, categoryPath, SITE_DESCRIPTION, SITE_NAME, templateCategories, templateJsonUrl, templateUrl } from "@/lib/seo";
import { TEMPLATE_SCHEMA_VERSION, templates } from "@/lib/templates";

export const revalidate = 3600;

export function GET() {
  const featured = templates.slice(0, 20);
  const publishedPosts = getPublishedBlogPosts();
  const body = [
    `# ${SITE_NAME}`,
    "",
    SITE_DESCRIPTION,
    "",
    `Open Image Template schema version: ${TEMPLATE_SCHEMA_VERSION}`,
    "",
    "## Core URLs",
    `- Homepage: ${absoluteUrl("/")}`,
    `- Compact discovery index: ${absoluteUrl("/templates-index.json")}`,
    `- Search API: ${absoluteUrl("/api/templates/search")}`,
    `- OpenAPI document: ${absoluteUrl("/openapi.json")}`,
    `- Full template catalogue JSON: ${absoluteUrl("/templates.json")}`,
    `- Curated use cases: ${absoluteUrl("/use-cases")}`,
    `- Schema page: ${absoluteUrl("/schema")}`,
    `- License and attribution: ${absoluteUrl("/license")}`,
    `- Blog: ${absoluteUrl("/blog")}`,
    `- Blog RSS: ${absoluteUrl("/rss.xml")}`,
    `- Image sitemap: ${absoluteUrl("/image-sitemap.xml")}`,
    `- Raw JSON Schema: ${absoluteUrl("/open-image-template.schema.json")}`,
    `- Full AI index: ${absoluteUrl("/llms-full.txt")}`,
    "",
    "## How Templates Work",
    "- Human template pages live at /templates/{template_id}.",
    "- Machine-readable template JSON lives at /templates/{template_id}.json.",
    "- Template JSON includes visible prompt, slots, controls, examples, provenance, suggested models, creator, and license.",
    "- Prompts are visible and copyable; hidden prompts are not part of the standard.",
    "",
    "## AI Retrieval Guidance",
    "- Prefer /api/templates/search for ranked discovery with q, category, tag, model, aspect_ratio, content_tier, limit, and offset filters.",
    "- Prefer /templates-index.json when you need to scan the compact catalogue without downloading full prompts.",
    "- Prefer /templates/{template_id}.json when you need one exact template.",
    "- Use /templates.json only when you explicitly need every full template record in one response.",
    "- Prefer /schema and /open-image-template.schema.json when explaining or implementing the standard.",
    "- Sensitive templates are excluded from search unless include_nsfw=true is explicitly requested.",
    "- Cite the human template URL for users and the JSON URL for tools.",
    "",
    "## Categories",
    ...templateCategories.map((category) => `- ${category}: ${absoluteUrl(categoryPath(category))}`),
    "",
    "## Important Docs",
    ...docs.map((doc) => `- ${doc.title}: ${absoluteUrl(`/docs/${doc.slug}`)}`),
    "",
    "## Blog Posts",
    ...publishedPosts.map((post) => `- ${post.title}: ${absoluteUrl(`/blog/${post.slug}`)}`),
    "",
    "## Featured Templates",
    ...featured.map((template) => `- ${template.title}: ${templateUrl(template)} | JSON: ${templateJsonUrl(template)}`),
    "",
    "## Usage and License",
    "- The schema is intended as an open, portable prompt-template format.",
    "- Template pages list creator and license metadata.",
    "- Public examples should preserve visible prompt, provenance, and schema version.",
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex",
    },
  });
}
