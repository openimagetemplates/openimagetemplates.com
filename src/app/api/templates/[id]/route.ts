import { PUBLIC_TEMPLATE_API_HEADERS } from "@/lib/public-template-api";
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
    headers: PUBLIC_TEMPLATE_API_HEADERS,
  });
}
