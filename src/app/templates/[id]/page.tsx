/* eslint-disable @next/next/no-img-element */
import { ArrowLeft, ArrowUpRight, Braces, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/CopyButton";
import { getNanoGptGenerateUrl, getTemplateById, templates, toPortableTemplateJson } from "@/lib/templates";

type TemplatePageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return templates.map((template) => ({ id: template.id }));
}

export async function generateMetadata({ params }: TemplatePageProps): Promise<Metadata> {
  const { id } = await params;
  const template = getTemplateById(id);
  if (!template) return {};

  return {
    title: `${template.title} | Open Image Templates`,
    description: template.description,
  };
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  const { id } = await params;
  const template = getTemplateById(id);
  if (!template) notFound();

  const templateJson = JSON.stringify(toPortableTemplateJson(template), null, 2);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/#gallery" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-950">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to gallery
      </Link>
      <div className="mt-8 grid min-w-0 gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="self-start overflow-hidden rounded-[8px] border border-black/10 bg-white shadow-sm">
          <img src={template.image} alt={template.imageAlt} className="w-full object-cover" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-zinc-950 px-3 py-1 text-xs font-medium text-white">{template.category}</span>
            <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-zinc-700">
              Schema {template.schemaVersion}
            </span>
            <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-zinc-700">
              Suggested model: {template.suggestedModel}
            </span>
          </div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-950">{template.title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600">{template.description}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CopyButton value={template.prompt} label="Copy full prompt" className="h-12" />
            <a
              href={getNanoGptGenerateUrl(template)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800"
              target="_blank"
              rel="noreferrer"
            >
              <Sparkles size={17} aria-hidden="true" />
              Generate with NanoGPT
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>

          <section className="mt-10">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">Editable slots</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {template.slots.map((slot) => (
                <div key={slot.name} className="rounded-[8px] border border-black/10 bg-white p-4">
                  <p className="text-sm font-semibold text-zinc-950">{slot.label}</p>
                  <p className="mt-1 text-sm text-zinc-500">{slot.example}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">Full prompt</h2>
              <CopyButton value={template.prompt} label="Copy prompt" />
            </div>
            <div className="mt-4 rounded-[8px] border border-black/10 bg-white p-5 text-sm leading-7 text-zinc-700">
              {template.prompt}
            </div>
          </section>

          <section className="mt-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">Template JSON</h2>
              <CopyButton value={templateJson} label="Copy JSON" />
            </div>
            <pre className="mt-4 max-h-[520px] min-w-0 overflow-auto whitespace-pre-wrap break-words rounded-[8px] border border-black/10 bg-zinc-950 p-5 text-sm leading-6 text-zinc-100">
              <code>{templateJson}</code>
            </pre>
          </section>

          <Link href="/schema" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-zinc-950 hover:underline">
            <Braces size={16} aria-hidden="true" />
            Read the open template schema
          </Link>
        </div>
      </div>
    </main>
  );
}
