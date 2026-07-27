import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";
import { getTemplatesForUseCase, useCases } from "@/lib/use-cases";

export const metadata: Metadata = {
  title: "AI Image Prompt Templates by Use Case",
  description:
    "Find curated AI image prompt templates for portraits, product photography, selfies, cinematic art, graphic design, and characters.",
  alternates: {
    canonical: "/use-cases",
  },
};

export default function UseCasesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "AI Image Prompt Templates by Use Case",
          description:
            "Curated collections of reusable AI image prompts organized by creative workflow and intended output.",
          url: absoluteUrl("/use-cases"),
          isPartOf: {
            "@type": "WebSite",
            name: SITE_NAME,
            url: absoluteUrl("/"),
          },
          mainEntity: {
            "@type": "ItemList",
            itemListElement: useCases.map((useCase, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: useCase.title,
              url: absoluteUrl(`/use-cases/${useCase.slug}`),
            })),
          },
        }}
      />
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-600">Use cases</p>
      <h1 className="mt-3 max-w-4xl text-5xl font-semibold tracking-tight text-zinc-950">
        Find an AI image prompt for the job
      </h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600">
        These curated collections group templates by creative workflow, with practical advice for choosing,
        customizing, and reviewing each type of prompt.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {useCases.map((useCase) => {
          const count = getTemplatesForUseCase(useCase).length;
          return (
            <Link
              key={useCase.slug}
              href={`/use-cases/${useCase.slug}`}
              className="rounded-[8px] border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                {count} templates
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">{useCase.title}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">{useCase.description}</p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
