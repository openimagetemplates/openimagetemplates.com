/* eslint-disable @next/next/no-img-element */
import { ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { getNanoGptGenerateUrl } from "@/lib/nanogpt-url";
import { categoryPath, tagPath } from "@/lib/seo";
import type { ImageTemplate } from "@/lib/templates";
import { CopyButton } from "./CopyButton";

type TemplateCardProps = {
  template: ImageTemplate;
};

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <article className="group mb-5 break-inside-avoid overflow-hidden rounded-[8px] border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="relative bg-zinc-100">
        <Link href={`/templates/${template.id}`} className="block">
          <img
            src={template.image}
            alt={template.imageAlt}
            className="h-auto w-full object-cover"
            loading="lazy"
          />
        </Link>
        <Link
          href={categoryPath(template.category)}
          className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur"
        >
          {template.category}
        </Link>
      </div>
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
            <Link key={tag} href={tagPath(tag)} className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-200">
              {tag}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <CopyButton value={template.prompt} label="Copy" className="h-9 flex-1" />
          <a
            href={getNanoGptGenerateUrl(template)}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-zinc-950 px-3 text-sm font-medium text-white transition hover:bg-zinc-800"
            target="_blank"
            rel="noreferrer"
          >
            <Sparkles size={15} aria-hidden="true" />
            Modify
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}
