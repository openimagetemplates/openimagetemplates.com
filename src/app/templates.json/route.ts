import { toPortableTemplateCatalogJson } from "@/lib/templates";

export function GET() {
  return Response.json(toPortableTemplateCatalogJson(), {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
