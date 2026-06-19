import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { categorySeoCopy } from "@/lib/category-copy";
import { TemplateCollectionGrid } from "@/components/TemplateCollectionGrid";
import {
  absoluteUrl,
  categoryPath,
  categorySlug,
  getCategoryBySlug,
  getTemplatesByCategory,
  SITE_NAME,
  templateCategories,
  templateUrl,
} from "@/lib/seo";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return templateCategories.map((category) => ({ category: categorySlug(category) }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};

  const copy = categorySeoCopy[category];
  const title = `${category} AI Image Templates`;
  const description = `${copy.intro} Browse open, copyable ${category.toLowerCase()} AI image templates with visible prompts and JSON schema.`;

  return {
    title,
    description,
    keywords: [`${category} AI image templates`, `${category} prompt templates`, "AI image prompt templates", "Open Image Templates"],
    alternates: {
      canonical: categoryPath(category),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(categoryPath(category)),
      siteName: SITE_NAME,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const categoryTemplates = getTemplatesByCategory(category);
  const copy = categorySeoCopy[category];
  const pageUrl = absoluteUrl(categoryPath(category));

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${category} Image Templates`,
          description: copy.intro,
          url: pageUrl,
          isPartOf: {
            "@type": "WebSite",
            name: SITE_NAME,
            url: absoluteUrl("/"),
          },
          mainEntity: {
            "@type": "ItemList",
            itemListElement: categoryTemplates.map((template, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: templateUrl(template),
              name: template.title,
            })),
          },
        }}
      />
      <Link href="/templates" className="text-sm font-semibold text-zinc-600 hover:text-zinc-950">
        Back to all templates
      </Link>
      <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-600">Category</p>
      <h1 className="mt-3 text-5xl font-semibold tracking-tight text-zinc-950">{category} AI Image Templates</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600">
        {copy.intro}
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <section className="rounded-[8px] border border-black/10 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-950">Common uses</h2>
          <ul className="mt-4 grid gap-2 text-sm leading-6 text-zinc-600">
            {copy.useCases.map((useCase) => (
              <li key={useCase}>- {useCase}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-[8px] border border-black/10 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-950">What is included</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            Browse {categoryTemplates.length} open templates for {category.toLowerCase()} image generation. Every template includes a visible prompt, editable controls, a preview image, and a portable JSON endpoint.
          </p>
        </section>
      </div>
      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {copy.faq.map((item) => (
          <div key={item.question} className="rounded-[8px] border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-950">{item.question}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{item.answer}</p>
          </div>
        ))}
      </section>
      <div className="mt-10">
        <TemplateCollectionGrid templates={categoryTemplates} />
      </div>
    </main>
  );
}
