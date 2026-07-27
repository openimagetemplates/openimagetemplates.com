import { buildPublicTemplateApiHeaders, PUBLIC_TEMPLATE_API_HEADERS } from "@/lib/public-template-api";
import { getTemplateById, templates, toPortableTemplateJson } from "@/lib/templates";

type TemplateJsonRouteProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-static";

export function generateStaticParams() {
  return templates.map((template) => ({ id: template.id }));
}

export async function GET(_request: Request, { params }: TemplateJsonRouteProps) {
  const { id } = await params;
  const template = getTemplateById(id);

  if (!template) {
    return Response.json(
      { error: "Template not found" },
      {
        status: 404,
        headers: {
          ...PUBLIC_TEMPLATE_API_HEADERS,
          "Cache-Control": "public, max-age=60",
        },
      },
    );
  }

  return Response.json(toPortableTemplateJson(template), {
    headers: buildPublicTemplateApiHeaders({
      canonicalPath: `/templates/${template.id}`,
      entityTag: `${template.id}-${template.schemaVersion}-${template.generatedAt}`,
      lastModified: template.generatedAt,
    }),
  });
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: PUBLIC_TEMPLATE_API_HEADERS,
  });
}
