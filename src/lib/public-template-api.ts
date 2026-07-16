export const PUBLIC_TEMPLATE_API_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD",
  "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
} as const;
