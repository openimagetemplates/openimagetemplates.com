import type { Metadata } from "next";
import Link from "next/link";
import { GalleryExplorer } from "@/components/GalleryExplorer";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME, templateUrl } from "@/lib/seo";
import { selectDiverseTemplates, templates } from "@/lib/templates";

const galleryTemplates = selectDiverseTemplates(templates, templates.length, {
  startCategoryIndex: 2,
  startTemplateIndex: 8,
});

export const metadata: Metadata = {
  title: "Browse AI Image Templates",
  description: `Browse ${templates.length} open, copyable AI image templates with visible prompts, editable controls, preview images, and portable JSON schema.`,
  alternates: {
    canonical: "/templates",
  },
  openGraph: {
    title: "Browse AI Image Templates",
    description: "Browse open AI image templates with visible prompts, editable controls, preview images, and portable JSON schema.",
    url: absoluteUrl("/templates"),
    siteName: SITE_NAME,
    type: "website",
  },
};

export default function TemplatesPage() {
  return (
    <main className="bg-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Browse AI Image Templates",
          description: SITE_DESCRIPTION,
          url: absoluteUrl("/templates"),
          isPartOf: {
            "@type": "WebSite",
            name: SITE_NAME,
            url: absoluteUrl("/"),
            potentialAction: {
              "@type": "SearchAction",
              target: `${absoluteUrl("/templates")}?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          },
          mainEntity: {
            "@type": "ItemList",
            itemListElement: galleryTemplates.map((template, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: templateUrl(template),
              name: template.title,
              image: template.image,
            })),
          },
        }}
      />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">Templates</p>
            <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-tight text-zinc-950 sm:text-6xl">
              Browse image templates for AI generators
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600">
              Search, filter, copy, and customize reusable image prompt templates. Every template has a visible prompt,
              editable slots, preview image, and JSON endpoint.
            </p>
          </div>
          <Link
            href="/templates/create"
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Create template
          </Link>
        </div>
      </section>
      <GalleryExplorer templates={galleryTemplates} loadingMode="infinite" />
    </main>
  );
}
