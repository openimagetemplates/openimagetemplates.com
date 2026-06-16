import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { docs, getDocBySlug } from "@/lib/docs";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

type DocPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return docs.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: DocPageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) return {};

  return {
    title: doc.title,
    description: doc.description,
    alternates: {
      canonical: `/docs/${doc.slug}`,
    },
    openGraph: {
      title: doc.title,
      description: doc.description,
      url: absoluteUrl(`/docs/${doc.slug}`),
      siteName: SITE_NAME,
      type: "article",
    },
  };
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) notFound();

  const pageUrl = absoluteUrl(`/docs/${doc.slug}`);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: doc.title,
          description: doc.description,
          url: pageUrl,
          isPartOf: {
            "@type": "WebSite",
            name: SITE_NAME,
            url: absoluteUrl("/"),
          },
        }}
      />
      <Link href="/docs" className="text-sm font-semibold text-zinc-600 hover:text-zinc-950">
        Back to docs
      </Link>
      <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">Open standard docs</p>
      <h1 className="mt-3 text-5xl font-semibold tracking-tight text-zinc-950">{doc.title}</h1>
      <p className="mt-5 text-lg leading-8 text-zinc-600">{doc.description}</p>
      <div className="mt-10 space-y-8">
        {doc.sections.map((section) => (
          <section key={section.heading} className="rounded-[8px] border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">{section.heading}</h2>
            <p className="mt-3 text-base leading-8 text-zinc-600">{section.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
