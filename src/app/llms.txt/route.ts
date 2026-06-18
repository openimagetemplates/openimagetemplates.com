import { docs } from "@/lib/docs";
import { absoluteUrl, categoryPath, SITE_DESCRIPTION, SITE_NAME, templateCategories, templateJsonUrl, templateUrl } from "@/lib/seo";
import { TEMPLATE_SCHEMA_VERSION, templates } from "@/lib/templates";

export function GET() {
  const featured = templates.slice(0, 20);
  const body = [
    `# ${SITE_NAME}`,
    "",
    SITE_DESCRIPTION,
    "",
    `Open Image Template schema version: ${TEMPLATE_SCHEMA_VERSION}`,
    "",
    "## Core URLs",
    `- Homepage: ${absoluteUrl("/")}`,
    `- Full template catalogue JSON: ${absoluteUrl("/templates.json")}`,
    `- Schema page: ${absoluteUrl("/schema")}`,
    `- Raw JSON Schema: ${absoluteUrl("/open-image-template.schema.json")}`,
    `- Full AI index: ${absoluteUrl("/llms-full.txt")}`,
    "",
    "## How Templates Work",
    "- Human template pages live at /templates/{template_id}.",
    "- Machine-readable template JSON lives at /templates/{template_id}.json.",
    "- Template JSON includes visible prompt, slots, controls, examples, provenance, suggested models, creator, and license.",
    "- Prompts are visible and copyable; hidden prompts are not part of the standard.",
    "",
    "## Categories",
    ...templateCategories.map((category) => `- ${category}: ${absoluteUrl(categoryPath(category))}`),
    "",
    "## Important Docs",
    ...docs.map((doc) => `- ${doc.title}: ${absoluteUrl(`/docs/${doc.slug}`)}`),
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
    },
  });
}
