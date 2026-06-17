import { ArrowLeft, Braces } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { CopyButton } from "@/components/CopyButton";
import { ImagePreviewButton } from "@/components/ImagePreviewButton";
import { NanoGptGenerateButton } from "@/components/NanoGptGenerateButton";
import { TemplateJsonDisclosure } from "@/components/TemplateJsonDisclosure";
import { TemplateCreator } from "@/components/TemplateCreator";
import { TemplatePromptBuilder } from "@/components/TemplatePromptBuilder";
import { TemplateCollectionGrid } from "@/components/TemplateCollectionGrid";
import { absoluteUrl, categoryPath, getRelatedTemplates, tagPath, templateJsonUrl, templatePath, templateUrl } from "@/lib/seo";
import { getTemplateById, templates, toPortableTemplateJson } from "@/lib/templates";

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

  return {
    title: template.title,
    description: template.description,
    alternates: {
      canonical: templatePath(template),
    },
    openGraph: {
      title: template.title,
      description: template.description,
      url: templateUrl(template),
      type: "article",
      images: [
        {
          url: template.image,
          alt: template.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: template.title,
      description: template.description,
      images: [template.image],
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
            "@type": "CreativeWork",
            name: template.title,
            description: template.description,
            url: templateUrl(template),
            image: {
              "@type": "ImageObject",
              url: template.image,
              caption: template.imageAlt,
              representativeOfPage: true,
            },
            dateCreated: template.generatedAt,
            keywords: template.tags.join(", "),
            genre: template.category,
            creator: {
              "@type": "Organization",
              name: template.creator,
            },
            license: template.license,
            encoding: {
              "@type": "DigitalDocument",
              name: `${template.title} JSON`,
              encodingFormat: "application/json",
              url: templateJsonUrl(template),
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
        <div className="self-start overflow-hidden rounded-[8px] border border-black/10 bg-white shadow-sm">
          <ImagePreviewButton
            src={template.image}
            alt={template.imageAlt}
            label={template.title}
            imageClassName="w-full object-cover transition duration-300 hover:scale-[1.01]"
          />
        </div>
        <div className="min-w-0">
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
          </div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-950">{template.title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600">{template.description}</p>
          <p className="mt-3 text-sm text-zinc-500">
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

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CopyButton value={template.prompt} label="Copy full prompt" className="h-12 px-5 text-sm font-semibold" />
            <NanoGptGenerateButton template={template} className="h-12 px-5" />
          </div>

          <TemplatePromptBuilder template={template} />

          <TemplateCreator baseTemplate={template} />

          <section className="mt-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">Full prompt</h2>
              <div className="flex flex-col gap-2 sm:flex-row">
                <CopyButton value={template.prompt} label="Copy prompt" className="h-10" />
                <NanoGptGenerateButton template={template} className="h-10 px-4" />
              </div>
            </div>
            <div className="mt-4 rounded-[8px] border border-black/10 bg-white p-5 text-sm leading-7 text-zinc-700">
              {template.prompt}
            </div>
          </section>

          <TemplateJsonDisclosure json={templateJson} />

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

          <section className="mt-12">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Related templates</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Similar templates by category, tags, or suggested model.
            </p>
            <div className="mt-5">
              <TemplateCollectionGrid templates={relatedTemplates} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
