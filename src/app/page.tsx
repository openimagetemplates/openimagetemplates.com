/* eslint-disable @next/next/no-img-element */
import { ArrowRight, Braces, Code2, Download, Globe2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { GalleryExplorer } from "@/components/GalleryExplorer";
import { featuredTemplates, templates } from "@/lib/templates";

export default function Home() {
  return (
    <main>
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-10 pt-8 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:pb-16">
        <div className="flex flex-col justify-center">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Sponsored by NanoGPT
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-zinc-950 sm:text-6xl">
            Open, portable templates for AI image generation.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
            Open Image Templates is a free schema and community gallery for reusable image prompts.
            Copy the full prompt, inspect the JSON, adapt the variables, or generate with NanoGPT in one click.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#gallery"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Browse templates
              <ArrowRight size={17} aria-hidden="true" />
            </a>
            <Link
              href="/schema"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-5 text-sm font-semibold text-zinc-950 shadow-sm transition hover:bg-zinc-50"
            >
              View schema
              <Braces size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3 text-sm text-zinc-600">
            <div className="rounded-[8px] border border-black/10 bg-white p-3">
              <strong className="block text-xl text-zinc-950">{templates.length}</strong>
              starter templates
            </div>
            <div className="rounded-[8px] border border-black/10 bg-white p-3">
              <strong className="block text-xl text-zinc-950">1.0.0</strong>
              schema version
            </div>
            <div className="rounded-[8px] border border-black/10 bg-white p-3">
              <strong className="block text-xl text-zinc-950">0</strong>
              hidden prompts
            </div>
          </div>
        </div>
        <div className="columns-2 gap-4 lg:pt-2">
          {featuredTemplates.map((template, index) => (
            <Link
              key={template.id}
              href={`/templates/${template.id}`}
              className={`mb-4 block break-inside-avoid overflow-hidden rounded-[8px] border border-black/10 bg-white shadow-sm ${
                index % 2 === 0 ? "translate-y-4" : ""
              }`}
            >
              <img src={template.image} alt={template.imageAlt} className="h-auto w-full object-cover" />
              <div className="p-3">
                <p className="text-sm font-semibold text-zinc-950">{template.title}</p>
                <p className="mt-1 text-xs text-zinc-500">{template.category}</p>
              </div>
            </Link>
          ))}
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

      <GalleryExplorer templates={templates} />

      <section className="border-t border-black/10 bg-zinc-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">Architecture</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Built for a large global image library.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Store originals and derivatives in Cloudflare R2.",
              "Serve public assets through a Cloudflare custom domain with long immutable cache headers.",
              "Keep template JSON in git first; move submissions to R2/KV or D1 when community volume grows.",
              "Use small WebP/AVIF preview derivatives for gallery cards and only load originals on detail pages.",
            ].map((item) => (
              <div key={item} className="rounded-[8px] border border-white/10 bg-white/5 p-4 text-sm leading-6 text-zinc-200">
                {item}
              </div>
            ))}
          </div>
          <Link href="/architecture" className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:underline">
            Read the implementation notes
            <Code2 size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
