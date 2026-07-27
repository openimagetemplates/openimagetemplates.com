import { absoluteUrl } from "@/lib/seo";

export const PUBLIC_TEMPLATE_API_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Expose-Headers": "ETag, Last-Modified, Link, X-Total-Count",
  "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
  "X-Robots-Tag": "noindex",
} as const;

type PublicApiHeaderOptions = {
  canonicalPath: string;
  entityTag: string;
  lastModified?: string;
  totalCount?: number;
};

export function buildPublicTemplateApiHeaders({
  canonicalPath,
  entityTag,
  lastModified,
  totalCount,
}: PublicApiHeaderOptions) {
  return {
    ...PUBLIC_TEMPLATE_API_HEADERS,
    ETag: `W/"${entityTag}"`,
    ...(lastModified ? { "Last-Modified": new Date(lastModified).toUTCString() } : {}),
    ...(typeof totalCount === "number" ? { "X-Total-Count": String(totalCount) } : {}),
    Link: [
      `<${absoluteUrl(canonicalPath)}>; rel="canonical"; type="text/html"`,
      `<${absoluteUrl("/open-image-template.schema.json")}>; rel="describedby"; type="application/schema+json"`,
      `<${absoluteUrl("/openapi.json")}>; rel="service-desc"; type="application/vnd.oai.openapi+json"`,
    ].join(", "),
  };
}
