import { buildPublicTemplateApiHeaders } from "@/lib/public-template-api";
import {
  TEMPLATE_CATALOG_GENERATED_AT,
  TEMPLATE_SCHEMA_VERSION,
  templates,
  toCompactTemplateCatalogJson,
} from "@/lib/templates";

export const dynamic = "force-static";

export function GET() {
  return Response.json(toCompactTemplateCatalogJson(), {
    headers: buildPublicTemplateApiHeaders({
      canonicalPath: "/templates",
      entityTag: `compact-catalog-${TEMPLATE_SCHEMA_VERSION}-${TEMPLATE_CATALOG_GENERATED_AT}`,
      lastModified: TEMPLATE_CATALOG_GENERATED_AT,
      totalCount: templates.length,
    }),
  });
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: buildPublicTemplateApiHeaders({
      canonicalPath: "/templates",
      entityTag: `compact-catalog-${TEMPLATE_SCHEMA_VERSION}-${TEMPLATE_CATALOG_GENERATED_AT}`,
      lastModified: TEMPLATE_CATALOG_GENERATED_AT,
      totalCount: templates.length,
    }),
  });
}
