import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { docs } from "@/lib/docs";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Docs",
  description: "Documentation for Open Image Templates, the free schema and gallery for reusable AI image generation prompts.",
  alternates: {
    canonical: "/docs",
  },
};

export default function DocsIndexPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Open Image Templates Docs",
          url: absoluteUrl("/docs"),
          isPartOf: {
            "@type": "WebSite",
            name: SITE_NAME,
            url: absoluteUrl("/"),
          },
        }}
      />
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">Documentation</p>
      <h1 className="mt-4 text-5xl font-semibold tracking-tight text-zinc-950">Open Image Templates Docs</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600">
        Learn how the open schema works, how to use templates, and how to build a compatible gallery or image generation flow.
      </p>
      <div className="mt-10 grid gap-4">
        {docs.map((doc) => (
          <Link key={doc.slug} href={`/docs/${doc.slug}`} className="rounded-[8px] border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <h2 className="text-xl font-semibold tracking-tight text-zinc-950">{doc.title}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{doc.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
