import { ArrowLeft, Braces } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ImagePreviewButton } from "@/components/ImagePreviewButton";
import { TemplateJsonDisclosure } from "@/components/TemplateJsonDisclosure";
import { TemplateCreator } from "@/components/TemplateCreator";
import { TemplatePromptBuilder } from "@/components/TemplatePromptBuilder";
import { TemplateCollectionGrid } from "@/components/TemplateCollectionGrid";
import { absoluteUrl, categoryPath, getRelatedTemplates, tagPath, templateJsonUrl, templatePath, templateUrl } from "@/lib/seo";
import {
  getTemplateAspectRatio,
  getTemplateById,
  TEMPLATE_LICENSE_URL,
  templates,
  toPortableTemplateJson,
} from "@/lib/templates";

type TemplatePageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return templates.map((template) => ({ id: template.id }));
}

export async function generateMetadata({ params }: TemplatePageProps): Promise<Metadata> {
  const { id } = await params;
  const template = getTemplateById(id);
  if (!template) return {};
  const socialPreviewImage = template.nsfw
    ? absoluteUrl("/opengraph-image.png")
    : template.image;
  const description = `${template.description} Customize the visible AI image prompt, use the suggested ${template.suggestedModelLabel ?? template.suggestedModel} model, or fetch portable JSON.`;

  return {
    title: `${template.title} AI Image Prompt Template`,
    description,
    keywords: [
      template.title,
      `${template.category} AI image template`,
      "AI image prompt template",
      "Open Image Templates",
      ...template.tags,
    ],
    alternates: {
      canonical: templatePath(template),
      types: {
        "application/json": templateJsonUrl(template),
      },
    },
    openGraph: {
      title: `${template.title} AI Image Prompt Template`,
      description,
      url: templateUrl(template),
      type: "article",
      images: [
        {
          url: socialPreviewImage,
          alt: template.nsfw ? "Open Image Templates" : template.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${template.title} AI Image Prompt Template`,
      description,
      images: [socialPreviewImage],
    },
  };
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  const { id } = await params;
  const template = getTemplateById(id);
  if (!template) notFound();

  const templateJson = JSON.stringify(toPortableTemplateJson(template), null, 2);
  const templateJsonPathForPage = `/templates/${template.id}.json`;
  const relatedTemplates = getRelatedTemplates(template);
  const pageUrl = templateUrl(template);
  const imageDimensions = parseResolution(template.suggestedSettings.resolution);
  const aspectRatio = getTemplateAspectRatio(template);
  const quality =
    typeof template.suggestedSettings.quality === "string" ? template.suggestedSettings.quality : undefined;
  const imageInput = template.inputRequirements?.image;
  const creatorUrl = absoluteUrl("/");
  const imageObjectId = `${pageUrl}#example-image`;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Templates",
                item: absoluteUrl("/templates"),
              },
              {
                "@type": "ListItem",
                position: 2,
                name: template.category,
                item: absoluteUrl(categoryPath(template.category)),
              },
              {
                "@type": "ListItem",
                position: 3,
                name: template.title,
                item: templateUrl(template),
              },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": pageUrl,
            name: `${template.title} AI Image Prompt Template`,
            description: template.description,
            url: pageUrl,
            mainEntity: {
              "@id": `${pageUrl}#template`,
            },
            ...(template.nsfw
              ? {}
              : {
                  primaryImageOfPage: {
                    "@id": imageObjectId,
                  },
                }),
            isPartOf: {
              "@type": "WebSite",
              name: "Open Image Templates",
              url: absoluteUrl("/"),
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "@id": `${pageUrl}#template`,
            name: template.title,
            description: template.description,
            url: pageUrl,
            mainEntityOfPage: {
              "@id": pageUrl,
            },
            ...(template.nsfw
              ? {}
              : {
                  image: {
                    "@type": "ImageObject",
                    "@id": imageObjectId,
                    url: template.image,
                    contentUrl: template.image,
                    caption: template.imageAlt,
                    ...(imageDimensions ?? {}),
                    representativeOfPage: true,
                    license: TEMPLATE_LICENSE_URL,
                    acquireLicensePage: absoluteUrl("/license"),
                    creditText: `${template.title} example by ${template.creator}`,
                    creator: {
                      "@type": "Organization",
                      name: template.creator,
                      url: creatorUrl,
                    },
                  },
                }),
            dateCreated: template.generatedAt,
            dateModified: template.generatedAt,
            keywords: template.tags.join(", "),
            genre: template.category,
            about: template.tags,
            creator: {
              "@type": "Organization",
              name: template.creator,
              url: creatorUrl,
            },
            license: TEMPLATE_LICENSE_URL,
            acquireLicensePage: absoluteUrl("/license"),
            isAccessibleForFree: true,
            usageInfo: absoluteUrl("/license"),
            encoding: {
              "@type": "DigitalDocument",
              "@id": `${pageUrl}#json`,
              name: `${template.title} JSON`,
              encodingFormat: "application/json",
              url: templateJsonUrl(template),
              contentUrl: templateJsonUrl(template),
            },
            text: template.prompt,
          },
        ]}
      />
      <Link href="/templates" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-950">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to gallery
      </Link>
      <div className="mt-8 grid min-w-0 gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="order-2 self-start lg:order-1">
          <div className="overflow-hidden rounded-[8px] border border-black/10 bg-white shadow-sm">
            <ImagePreviewButton
              src={template.image}
              alt={template.imageAlt}
              label={template.title}
              imageClassName="w-full object-cover transition duration-300 hover:scale-[1.01]"
              imageWidth={683}
              imageHeight={1024}
              loading="eager"
              fetchPriority="high"
              sensitive={template.nsfw}
            />
          </div>
          <TemplateCreator baseTemplate={template} />
        </div>
        <div className="order-1 min-w-0 lg:order-2">
          <div className="flex flex-wrap gap-2">
            <Link href={categoryPath(template.category)} className="rounded-full bg-zinc-950 px-3 py-1 text-xs font-medium text-white">
              {template.category}
            </Link>
            <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-zinc-700">
              Schema {template.schemaVersion}
            </span>
            <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-zinc-700">
              Suggested model: {template.suggestedModel}
            </span>
            {template.nsfw ? (
              <span className="rounded-full bg-zinc-950 px-3 py-1 text-xs font-semibold text-white">
                18+ sensitive
              </span>
            ) : null}
          </div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-950">{template.title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600">{template.description}</p>
          <p className="mt-3 text-sm text-zinc-600">
            Generated {template.generatedAt} with Open Image Template schema {template.schemaVersion}. JSON endpoint:{" "}
            <a href={templateJsonPathForPage} className="font-medium text-zinc-950 underline">
              {templateJsonPathForPage}
            </a>
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {template.tags.map((tag) => (
              <Link key={tag} href={tagPath(tag)} className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-zinc-700 hover:border-black/25 hover:text-zinc-950">
                #{tag}
              </Link>
            ))}
          </div>

          <TemplatePromptBuilder template={template} />

          <TemplateJsonDisclosure
            json={templateJson}
            templateId={template.id}
            category={template.category}
            suggestedModel={template.suggestedModel}
          />

          <Link href="/schema" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-zinc-950 hover:underline">
            <Braces size={16} aria-hidden="true" />
            Read the open template schema
          </Link>
          <a
            href={templateJsonPathForPage}
            className="ml-0 mt-3 inline-flex items-center gap-2 text-sm font-semibold text-zinc-950 hover:underline sm:ml-5"
          >
            <Braces size={16} aria-hidden="true" />
            View this template as JSON
          </a>

        </div>
      </div>

      <section className="mt-14 border-t border-black/10 pt-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-600">Template guide</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
              About this AI image prompt template
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600">
              Use {template.title} when you need {template.description.toLowerCase()} The template keeps its core{" "}
              {template.category.toLowerCase()} composition stable while exposing the details that are most useful to
              change. It is especially relevant for {formatList(template.tags.slice(0, 4))}.
            </p>
            {template.sourceNotes ? (
              <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-600">
                <span className="font-semibold text-zinc-950">Source note:</span> {template.sourceNotes}
              </p>
            ) : null}
          </div>
          <div className="rounded-[8px] border border-black/10 bg-[#f5f3ef] p-6 shadow-sm">
            <h2 className="text-xl font-semibold tracking-tight text-zinc-950">Recommended setup</h2>
            <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 text-sm">
              <TemplateFact label="Model" value={template.suggestedModelLabel ?? template.suggestedModel} />
              <TemplateFact label="Aspect ratio" value={aspectRatio ?? "Model default"} />
              <TemplateFact
                label="Resolution"
                value={
                  typeof template.suggestedSettings.resolution === "string"
                    ? template.suggestedSettings.resolution
                    : "Model default"
                }
              />
              <TemplateFact label="Quality" value={quality ?? "Model default"} />
              <TemplateFact
                label="Image input"
                value={imageInput ? (imageInput.required ? "Required" : "Optional") : "Not required"}
              />
              <TemplateFact label="Content tier" value={template.contentTier} />
            </dl>
            {imageInput ? <p className="mt-5 text-sm leading-6 text-zinc-600">{imageInput.description}</p> : null}
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <section className="rounded-[8px] border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">How to customize it</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Start with the editable slots below, then apply optional look controls. Change one visual layer at a
              time when you want to compare results.
            </p>
            <dl className="mt-5 grid gap-4">
              {template.slots.map((slot) => (
                <div key={slot.name}>
                  <dt className="text-sm font-semibold text-zinc-950">{slot.label}</dt>
                  <dd className="mt-1 text-sm leading-6 text-zinc-600">Example: {slot.example}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="rounded-[8px] border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Reuse and attribution</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Created by {template.creator} and published as {template.license}. You can copy the prompt, adapt the
              structured template, or import its JSON into a compatible tool. Preserve the creator, license, canonical
              URL, and schema version when republishing template data.
            </p>
            <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold">
              <Link href="/license" className="text-zinc-950 underline">
                License and attribution
              </Link>
              <a href={templateJsonPathForPage} className="text-zinc-950 underline">
                Portable template JSON
              </a>
            </div>
          </section>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Related templates</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Similar templates by category, tags, or suggested model.
        </p>
        <div className="mt-5">
          <TemplateCollectionGrid templates={relatedTemplates} />
        </div>
      </section>
    </main>
  );
}

function TemplateFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">{label}</dt>
      <dd className="mt-1 font-medium text-zinc-950">{value}</dd>
    </div>
  );
}

function parseResolution(value: unknown) {
  if (typeof value !== "string") return undefined;
  const match = value.match(/^(\d+)x(\d+)$/);
  if (!match) return undefined;
  return {
    width: Number(match[1]),
    height: Number(match[2]),
  };
}

function formatList(values: string[]) {
  if (values.length === 0) return "reusable AI image generation";
  if (values.length === 1) return values[0];
  return `${values.slice(0, -1).join(", ")}, and ${values.at(-1)}`;
}
