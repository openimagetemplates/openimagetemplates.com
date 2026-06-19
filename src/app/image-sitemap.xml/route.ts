import { templateUrl } from "@/lib/seo";
import { templates } from "@/lib/templates";

export const revalidate = 86400;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const entries = templates.map((template) => `  <url>
    <loc>${escapeXml(templateUrl(template))}</loc>
    <image:image>
      <image:loc>${escapeXml(template.image)}</image:loc>
      <image:title>${escapeXml(template.title)}</image:title>
      <image:caption>${escapeXml(template.imageAlt || template.description)}</image:caption>
    </image:image>
  </url>`).join("\n");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries}
</urlset>
`, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
