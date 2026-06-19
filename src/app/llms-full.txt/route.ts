import { blogPosts } from "@/lib/blog";
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
    `Full template catalogue JSON: ${absoluteUrl("/templates.json")}`,
    `Raw JSON Schema: ${absoluteUrl("/open-image-template.schema.json")}`,
    "",
    "## AI Retrieval Guidance",
    "Prefer the complete catalogue JSON for broad search and individual .json endpoints for exact template retrieval. Cite human template pages for readers and JSON endpoints for agents or integrations. Hidden prompt layers are not part of the Open Image Template standard.",
    "",
    "## Docs",
    ...docs.flatMap((doc) => [`### ${doc.title}`, doc.description, absoluteUrl(`/docs/${doc.slug}`), ""]),
    "## Blog Posts",
    ...blogPosts.flatMap((post) => [`### ${post.title}`, post.description, absoluteUrl(`/blog/${post.slug}`), ""]),
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
