import { ArrowLeft, ArrowRight, Check, Download, Globe2, ShieldCheck, SlidersHorizontal } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { GalleryExplorer } from "@/components/GalleryExplorer";
import { HomepageHero } from "@/components/HomepageHero";
import { HomepagePromptBuilderDemo } from "@/components/HomepagePromptBuilderDemo";
import { JsonLd } from "@/components/JsonLd";
import { TemplatePreviewImage } from "@/components/TemplatePreviewImage";
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME, templateUrl } from "@/lib/seo";
import { selectDiverseTemplates, TEMPLATE_SCHEMA_VERSION, templates } from "@/lib/templates";

const showcaseColors = ["#e9ff8f", "#4bb3f0", "#5cc878", "#bdb8f8", "#a9c1b6", "#f6a66d"];
const heroTemplates = selectDiverseTemplates(templates, 18);
const makingTemplates = selectDiverseTemplates(templates, 6, {
  excludeIds: heroTemplates.slice(0, 6).map((template) => template.id),
  startCategoryIndex: 1,
  startTemplateIndex: 2,
});
const collageTemplates = selectDiverseTemplates(templates, 6, {
  excludeIds: [...heroTemplates.slice(0, 6), ...makingTemplates].map((template) => template.id),
  startCategoryIndex: 3,
  startTemplateIndex: 4,
});
const bottomShowcaseTemplates = selectDiverseTemplates(templates, 12, {
  excludeIds: [...heroTemplates.slice(0, 6), ...makingTemplates, ...collageTemplates].map((template) => template.id),
  startCategoryIndex: 5,
  startTemplateIndex: 6,
});
const galleryTemplates = selectDiverseTemplates(templates, templates.length, {
  startCategoryIndex: 2,
  startTemplateIndex: 8,
});

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <main>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_NAME,
            url: absoluteUrl("/"),
            sameAs: ["https://nano-gpt.com"],
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            url: absoluteUrl("/"),
            description: SITE_DESCRIPTION,
          },
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Open Image Templates Gallery",
            description: SITE_DESCRIPTION,
            url: absoluteUrl("/"),
            mainEntity: {
              "@type": "ItemList",
              itemListElement: templates.slice(0, 24).map((template, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: templateUrl(template),
                name: template.title,
                image: template.image,
              })),
            },
          },
        ]}
      />
      <HomepageHero templates={heroTemplates} templateCount={templates.length} schemaVersion={TEMPLATE_SCHEMA_VERSION} />

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <h2 className="max-w-4xl text-5xl font-semibold tracking-tight text-zinc-950 sm:text-6xl">
            Explore what people are making
          </h2>

          <div className="mt-12 grid gap-x-7 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
            {makingTemplates.map((template) => (
              <Link key={template.id} href={`/templates/${template.id}`} className="group block">
                <div className="aspect-[16/9] overflow-hidden rounded-[8px] bg-zinc-100">
                  <TemplatePreviewImage
                    src={template.image}
                    alt={template.imageAlt}
                    className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-950 group-hover:underline">
                  {template.title}
                </h3>
              </Link>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <Link href="/templates" className="border-b border-zinc-950 text-lg font-medium text-zinc-950 hover:text-zinc-600">
              Explore more
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">
          <div className="flex gap-3">
            <Globe2 className="mt-1 text-zinc-950" size={22} aria-hidden="true" />
            <div>
              <h2 className="font-semibold text-zinc-950">Vendor-neutral</h2>
              <p className="mt-1 text-sm leading-6 text-zinc-600">Templates are plain JSON and prompts are visible by default.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Download className="mt-1 text-zinc-950" size={22} aria-hidden="true" />
            <div>
              <h2 className="font-semibold text-zinc-950">Copy-first</h2>
              <p className="mt-1 text-sm leading-6 text-zinc-600">Every template can be copied and used in any generator.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <ShieldCheck className="mt-1 text-zinc-950" size={22} aria-hidden="true" />
            <div>
              <h2 className="font-semibold text-zinc-950">Reviewable</h2>
              <p className="mt-1 text-sm leading-6 text-zinc-600">Public submissions can be moderated before entering the gallery.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-b border-black/10 bg-white">
        <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-center justify-center px-4 py-20 sm:px-6 lg:min-h-[680px] lg:px-8">
          <div className="oit-shape-float absolute left-5 top-12 hidden h-56 w-44 rotate-[-8deg] rounded-[8px] border border-black/10 bg-white p-4 shadow-2xl md:block lg:left-16 lg:top-20">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffd166]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#5cc878]" />
            </div>
            <div className="mt-5 h-24 rounded-[8px] bg-zinc-950" />
            <div className="mt-4 h-3 w-28 rounded-full bg-zinc-300" />
            <div className="mt-2 h-3 w-20 rounded-full bg-zinc-200" />
          </div>

          <div className="oit-shape-drift absolute left-10 bottom-16 hidden h-52 w-72 rounded-[8px] bg-[#e9ff8f] p-5 shadow-xl md:block lg:left-28">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50">Slot</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <span className="rounded-[8px] bg-white/75 px-3 py-3 text-sm font-semibold">Subject</span>
              <span className="rounded-[8px] bg-white/75 px-3 py-3 text-sm font-semibold">Style</span>
              <span className="rounded-[8px] bg-white/75 px-3 py-3 text-sm font-semibold">Light</span>
              <span className="rounded-[8px] bg-white/75 px-3 py-3 text-sm font-semibold">Mood</span>
            </div>
          </div>

          <div className="oit-shape-rise absolute left-[42%] top-10 hidden w-72 rotate-3 rounded-[8px] bg-zinc-950 p-5 text-left text-zinc-100 shadow-2xl lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">Template JSON</p>
            <pre className="mt-4 text-xs leading-5 text-zinc-200"><code>{'{\n  "schema_version": "1.0.0",\n  "prompt": "visible",\n  "slots": ["subject"]\n}'}</code></pre>
          </div>

          <div className="oit-shape-float absolute right-8 top-24 hidden h-64 w-80 rotate-[6deg] rounded-[8px] bg-[#4bb3f0] p-4 shadow-2xl lg:block">
            <div className="h-full overflow-hidden rounded-[8px] bg-white/35 p-3">
              <TemplatePreviewImage
                src={collageTemplates[0]?.image}
                alt={collageTemplates[0]?.imageAlt ?? "Template preview"}
                className="h-full w-full rounded-[8px] object-cover object-top shadow-xl"
              />
            </div>
          </div>

          <div className="oit-shape-drift absolute bottom-10 right-24 hidden h-56 w-56 rounded-[8px] bg-[#bdb8f8] p-5 shadow-xl md:block">
            <div className="grid h-full grid-cols-2 gap-3">
              {collageTemplates.slice(1, 5).map((template) => (
                <TemplatePreviewImage
                  key={template.id}
                  src={template.image}
                  alt={template.imageAlt}
                  className="h-full w-full rounded-[8px] object-cover object-top"
                />
              ))}
            </div>
          </div>

          <div className="absolute left-1/2 top-1/2 z-10 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 px-4 text-center">
            <p className="mx-auto max-w-3xl text-5xl font-semibold tracking-tight text-zinc-950 sm:text-6xl lg:text-7xl">
              Open Image Templates is forever free.
            </p>
            <Link
              href="/templates"
              className="mt-8 inline-flex rounded-[8px] bg-zinc-950 px-6 py-3 text-2xl font-semibold tracking-tight text-white transition hover:bg-zinc-800 sm:text-3xl"
            >
              Start browsing
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-24">
          <div className="flex flex-col">
            <div className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#e4fbf6] text-[#017e9e]">
              <SlidersHorizontal size={23} aria-hidden="true" />
            </div>
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Prompt builder
            </p>
            <h2 className="mt-3 max-w-2xl text-5xl font-semibold tracking-tight text-zinc-950 sm:text-6xl">
              Change the look without rewriting the prompt
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600">
              Templates are not just long prompts. Pick a subject, then click visual options for style, palette,
              lighting, material, and medium. The final prompt updates for you.
            </p>
            <div className="mt-8 grid gap-3 text-sm font-medium text-zinc-800 sm:grid-cols-2">
              {[
                "Start from a proven composition",
                "Change reusable details in plain fields",
                "Add visual direction with one click",
                "Copy a polished prompt when ready",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-zinc-950 text-white">
                    <Check size={14} strokeWidth={3} aria-hidden="true" />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <HomepagePromptBuilderDemo />
        </div>
      </section>

      <GalleryExplorer templates={galleryTemplates} />

      <section className="border-t border-black/10 bg-zinc-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Start with a template. Make just about anything.
              </h2>
              <Link
                href="/templates"
                className="mt-8 inline-flex h-12 items-center justify-center rounded-[8px] border border-white/60 px-5 text-sm font-semibold text-white transition hover:border-white hover:bg-white hover:text-zinc-950"
              >
                Explore all templates
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Previous template"
                className="grid h-12 w-12 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
              >
                <ArrowLeft size={24} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next template"
                className="grid h-12 w-12 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
              >
                <ArrowRight size={24} aria-hidden="true" />
              </button>
            </div>
          </div>

          <p className="mt-12 text-lg text-white/90">Showing {bottomShowcaseTemplates.length} of {templates.length}</p>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {bottomShowcaseTemplates.map((template, index) => (
              <Link
                key={template.id}
                href={`/templates/${template.id}`}
                className="group block overflow-hidden rounded-[8px] bg-white text-zinc-950 transition duration-200 hover:-translate-y-1"
                style={{ backgroundColor: showcaseColors[index % showcaseColors.length] }}
              >
                <div className="p-6">
                  <p className="text-2xl font-semibold tracking-tight">{template.category}</p>
                  <p className="mt-2 text-sm font-medium text-black/60">{template.title}</p>
                </div>
                <div className="h-72 overflow-hidden px-5 pb-5">
                  <TemplatePreviewImage
                    src={template.image}
                    alt={template.imageAlt}
                    className="h-full w-full rounded-[8px] object-cover object-top shadow-2xl transition duration-300 group-hover:scale-[1.03]"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
