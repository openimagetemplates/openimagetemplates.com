/* eslint-disable @next/next/no-img-element */
import { ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { getNanoGptGenerateUrl, type ImageTemplate } from "@/lib/templates";
import { CopyButton } from "./CopyButton";

type TemplateCardProps = {
  template: ImageTemplate;
};

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <article className="group mb-5 break-inside-avoid overflow-hidden rounded-[8px] border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
      <Link href={`/templates/${template.id}`} className="block">
        <div className="relative bg-zinc-100">
          <img
            src={template.image}
            alt={template.imageAlt}
            className="h-auto w-full object-cover"
            loading="lazy"
          />
          <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            {template.category}
          </div>
        </div>
      </Link>
      <div className="space-y-4 p-4">
        <div>
          <Link href={`/templates/${template.id}`} className="block">
            <h3 className="text-base font-semibold tracking-tight text-zinc-950 group-hover:underline">
              {template.title}
            </h3>
          </Link>
          <p className="mt-1 text-sm leading-5 text-zinc-600">{template.description}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {template.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <CopyButton value={template.prompt} label="Copy prompt" className="h-9 flex-1" />
          <a
            href={getNanoGptGenerateUrl(template)}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-zinc-950 px-3 text-sm font-medium text-white transition hover:bg-zinc-800"
            target="_blank"
            rel="noreferrer"
          >
            <Sparkles size={15} aria-hidden="true" />
            Generate
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}
