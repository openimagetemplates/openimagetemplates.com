import { PUBLIC_TEMPLATE_API_HEADERS } from "@/lib/public-template-api";
import { toPortableTemplateCatalogJson } from "@/lib/templates";

export const dynamic = "force-static";

export function GET() {
  return Response.json(toPortableTemplateCatalogJson(), {
    headers: PUBLIC_TEMPLATE_API_HEADERS,
  });
}
