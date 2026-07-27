import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";
import { TEMPLATE_LICENSE_URL } from "@/lib/templates";

export const metadata: Metadata = {
  title: "Template License and Attribution",
  description:
    "License and attribution guidance for prompts, metadata, example images, and derivative Open Image Templates.",
  alternates: {
    canonical: "/license",
  },
};

export default function LicensePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Open Image Templates License and Attribution",
          description:
            "License and attribution guidance for Open Image Templates and their published examples.",
          url: absoluteUrl("/license"),
          isPartOf: {
            "@type": "WebSite",
            name: SITE_NAME,
            url: absoluteUrl("/"),
          },
          license: TEMPLATE_LICENSE_URL,
        }}
      />
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-600">Usage</p>
      <h1 className="mt-3 text-5xl font-semibold tracking-tight text-zinc-950">
        Template license and attribution
      </h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600">
        Templates published in the canonical catalog identify their creator and license in both the human page and
        portable JSON. The current catalog is published under Creative Commons Attribution 4.0.
      </p>

      <section className="mt-10 rounded-[8px] border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">CC BY 4.0</h2>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          You may share and adapt the licensed material, including for commercial use, provided that you give
          appropriate credit, link to the license, and indicate whether changes were made. The license itself controls
          if this summary and its legal terms differ.
        </p>
        <a
          href={TEMPLATE_LICENSE_URL}
          className="mt-5 inline-flex font-semibold text-zinc-950 underline"
          target="_blank"
          rel="license noreferrer"
        >
          Read the Creative Commons Attribution 4.0 license
        </a>
      </section>

      <section className="mt-6 rounded-[8px] border border-black/10 bg-[#f5f3ef] p-6 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Suggested attribution</h2>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          “Template by Open Image Templates, licensed under CC BY 4.0,” followed by a link to the original template
          page and the license. If you modify the prompt or schema data, say that the template was adapted.
        </p>
      </section>

      <section className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="rounded-[8px] border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-950">Generated outputs</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            A template license does not guarantee exclusive rights in generated outputs. Image-model terms, reference
            material, trademarks, publicity rights, and local law may also apply.
          </p>
        </div>
        <div className="rounded-[8px] border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-950">Third-party integrations</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            Preserve the creator, license, canonical template URL, and schema version when importing or republishing
            template data.
          </p>
        </div>
      </section>

      <Link href="/schema" className="mt-8 inline-flex text-sm font-semibold text-zinc-950 underline">
        Read the open template schema
      </Link>
    </main>
  );
}
