import { getTemplateById, templates, toPortableTemplateJson } from "@/lib/templates";

type TemplateJsonRouteProps = {
  params: Promise<{ id: string }>;
};

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
          "Cache-Control": "public, max-age=60",
        },
      },
    );
  }

  return Response.json(toPortableTemplateJson(template), {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
