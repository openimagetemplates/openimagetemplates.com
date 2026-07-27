import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { categoryPath, tagPath } from "@/lib/seo";
import type { ImageTemplate } from "@/lib/templates";
import { SensitiveContentBoundary } from "@/components/SensitiveContentBoundary";
import { TemplatePreviewImage } from "@/components/TemplatePreviewImage";

type TemplateCardProps = {
  template: ImageTemplate;
  priority?: boolean;
};

export function TemplateCard({ template, priority = false }: TemplateCardProps) {
  const previewDimensions = getPreviewDimensions(template);

  return (
    <article className="group mb-5 break-inside-avoid overflow-hidden rounded-[8px] border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="relative bg-zinc-100">
        <SensitiveContentBoundary
          sensitive={template.nsfw}
          label={`${template.title} preview`}
        >
          <Link href={`/templates/${template.id}`} className="block">
            <span
              className="block overflow-hidden bg-zinc-100"
              style={{ aspectRatio: `${previewDimensions.width} / ${previewDimensions.height}` }}
            >
              <TemplatePreviewImage
                src={template.image}
                alt={template.imageAlt}
                className="h-full w-full object-cover"
                width={previewDimensions.width}
                height={previewDimensions.height}
                loading={priority ? "eager" : "lazy"}
                fetchPriority={priority ? "high" : "auto"}
              />
            </span>
          </Link>
        </SensitiveContentBoundary>
        <Link
          href={categoryPath(template.category)}
          className="absolute left-3 top-3 z-30 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur"
        >
          {template.category}
        </Link>
        {template.nsfw ? (
          <span className="absolute right-3 top-3 z-30 rounded-full border border-white/25 bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            18+
          </span>
        ) : null}
      </div>
      <div className="space-y-4 p-4">
        <div>
          <Link href={`/templates/${template.id}`} className="block">
            <h2 className="text-base font-semibold tracking-tight text-zinc-950 group-hover:underline">
              {template.title}
            </h2>
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
        <div>
          <Link
            href={`/templates/${template.id}`}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-zinc-950 px-3 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            <Sparkles size={15} aria-hidden="true" />
            Modify
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function getPreviewDimensions(template: ImageTemplate) {
  const resolution = template.suggestedSettings.resolution;
  if (typeof resolution !== "string") return { width: 1024, height: 768 };

  const match = resolution.match(/^(\d+)x(\d+)$/);
  if (!match) return { width: 1024, height: 768 };

  const width = Number(match[1]);
  const height = Number(match[2]);

  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return { width: 1024, height: 768 };
  }

  return { width, height };
}
