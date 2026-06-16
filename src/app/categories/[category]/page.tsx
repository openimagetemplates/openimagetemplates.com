import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
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

  const title = `${category} Image Templates`;
  const description = `Browse open, copyable ${category.toLowerCase()} AI image templates with visible prompts, JSON schema, preview images, and NanoGPT generation links.`;

  return {
    title,
    description,
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
  const pageUrl = absoluteUrl(categoryPath(category));

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${category} Image Templates`,
          description: `Open Image Templates in the ${category} category.`,
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
      <Link href="/#gallery" className="text-sm font-semibold text-zinc-600 hover:text-zinc-950">
        Back to all templates
      </Link>
      <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">Category</p>
      <h1 className="mt-3 text-5xl font-semibold tracking-tight text-zinc-950">{category} Image Templates</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600">
        Browse {categoryTemplates.length} open templates for {category.toLowerCase()} image generation. Every template includes
        a visible prompt, editable controls, a preview image, and a portable JSON endpoint.
      </p>
      <div className="mt-10">
        <TemplateCollectionGrid templates={categoryTemplates} />
      </div>
    </main>
  );
}
