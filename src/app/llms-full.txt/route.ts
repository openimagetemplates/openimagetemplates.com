import { docs } from "@/lib/docs";
import {
  absoluteUrl,
  categoryPath,
  tagPath,
  SITE_DESCRIPTION,
  SITE_NAME,
  templateCategories,
  templateJsonUrl,
  templateTags,
  templateUrl,
} from "@/lib/seo";
import { TEMPLATE_SCHEMA_VERSION, templates } from "@/lib/templates";

export function GET() {
  const body = [
    `# ${SITE_NAME} Full AI Index`,
    "",
    SITE_DESCRIPTION,
    "",
    `Schema version: ${TEMPLATE_SCHEMA_VERSION}`,
    `Raw JSON Schema: ${absoluteUrl("/open-image-template.schema.json")}`,
    "",
    "## Docs",
    ...docs.flatMap((doc) => [`### ${doc.title}`, doc.description, absoluteUrl(`/docs/${doc.slug}`), ""]),
    "## Categories",
    ...templateCategories.map((category) => `- ${category}: ${absoluteUrl(categoryPath(category))}`),
    "",
    "## Tags",
    ...templateTags.map((tag) => `- ${tag}: ${absoluteUrl(tagPath(tag))}`),
    "",
    "## Templates",
    ...templates.flatMap((template) => [
      `### ${template.title}`,
      `URL: ${templateUrl(template)}`,
      `JSON: ${templateJsonUrl(template)}`,
      `Category: ${template.category}`,
      `Tags: ${template.tags.join(", ")}`,
      `Suggested model: ${template.suggestedModelLabel ?? template.suggestedModel}`,
      `Generated: ${template.generatedAt}`,
      `License: ${template.license}`,
      `Description: ${template.description}`,
      `Prompt: ${template.prompt}`,
      "",
    ]),
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
