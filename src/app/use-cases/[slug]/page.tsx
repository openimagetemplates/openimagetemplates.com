import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { TemplateCollectionGrid } from "@/components/TemplateCollectionGrid";
import { absoluteUrl, SITE_NAME, templateUrl } from "@/lib/seo";
import { getTemplatesForUseCase, getUseCaseBySlug, useCases } from "@/lib/use-cases";

type UseCasePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return useCases.map((useCase) => ({ slug: useCase.slug }));
}

export async function generateMetadata({ params }: UseCasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const useCase = getUseCaseBySlug(slug);
  if (!useCase) return {};

  return {
    title: useCase.title,
    description: useCase.description,
    alternates: {
      canonical: `/use-cases/${useCase.slug}`,
    },
    openGraph: {
      title: useCase.title,
      description: useCase.description,
      url: absoluteUrl(`/use-cases/${useCase.slug}`),
      siteName: SITE_NAME,
      type: "website",
    },
  };
}

export default async function UseCasePage({ params }: UseCasePageProps) {
  const { slug } = await params;
  const useCase = getUseCaseBySlug(slug);
  if (!useCase) notFound();

  const matchingTemplates = getTemplatesForUseCase(useCase);
  const pageUrl = absoluteUrl(`/use-cases/${useCase.slug}`);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Use cases",
                item: absoluteUrl("/use-cases"),
              },
              {
                "@type": "ListItem",
                position: 2,
                name: useCase.title,
                item: pageUrl,
              },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: useCase.title,
            description: useCase.description,
            url: pageUrl,
            isPartOf: {
              "@type": "WebSite",
              name: SITE_NAME,
              url: absoluteUrl("/"),
            },
            about: useCase.bestFor,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: matchingTemplates.length,
              itemListElement: matchingTemplates.map((template, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: template.title,
                url: templateUrl(template),
              })),
            },
          },
        ]}
      />
      <Link href="/use-cases" className="text-sm font-semibold text-zinc-600 hover:text-zinc-950">
        Back to use cases
      </Link>
      <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-600">Prompt collection</p>
      <h1 className="mt-3 max-w-4xl text-5xl font-semibold tracking-tight text-zinc-950">{useCase.title}</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600">{useCase.intro}</p>

      <div className="mt-9 grid gap-5 lg:grid-cols-3">
        <section className="rounded-[8px] border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-950">Best for</h2>
          <ul className="mt-4 grid gap-2 text-sm leading-6 text-zinc-600">
            {useCase.bestFor.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-[8px] border border-black/10 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-950">How to choose a template</h2>
          <ul className="mt-4 grid gap-3 text-sm leading-6 text-zinc-600">
            {useCase.choosingTips.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6 rounded-[8px] border border-black/10 bg-[#f5f3ef] p-6 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Recommended workflow</h2>
        <ol className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {useCase.workflow.map((step, index) => (
            <li key={step} className="rounded-[8px] bg-white p-4 text-sm leading-6 text-zinc-600">
              <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Step {index + 1}
              </span>
              <span className="mt-2 block">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        {useCase.faq.map((item) => (
          <div key={item.question} className="rounded-[8px] border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-950">{item.question}</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">{item.answer}</p>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">
          Browse {matchingTemplates.length} matching templates
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600">
          Every result includes a visible prompt, editable controls, suggested model settings, and a portable JSON
          endpoint for agents and integrations.
        </p>
        <div className="mt-6">
          <TemplateCollectionGrid templates={matchingTemplates} />
        </div>
      </section>
    </main>
  );
}
