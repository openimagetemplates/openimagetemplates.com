"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { TemplatePreviewImage } from "@/components/TemplatePreviewImage";

type ImagePreviewButtonProps = {
  src: string;
  alt: string;
  label: string;
  className?: string;
  imageClassName?: string;
  imageWidth?: number;
  imageHeight?: number;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
};

export function ImagePreviewButton({
  src,
  alt,
  label,
  className = "",
  imageClassName = "",
  imageWidth = 1024,
  imageHeight = 1024,
  loading = "lazy",
  fetchPriority = "auto",
}: ImagePreviewButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={`block w-full text-left ${className}`} aria-label={`Open ${label} preview`}>
        <TemplatePreviewImage
          src={src}
          alt={alt}
          className={imageClassName}
          width={imageWidth}
          height={imageHeight}
          loading={loading}
          fetchPriority={fetchPriority}
        />
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${label} preview`}
          onClick={() => setOpen(false)}
        >
          <div className="w-full max-w-5xl overflow-hidden rounded-[8px] bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between gap-4 border-b border-black/10 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-600">Example image</p>
                <h3 className="mt-1 text-xl font-semibold tracking-tight text-zinc-950">{label}</h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white text-zinc-950 transition hover:bg-zinc-50"
                aria-label="Close preview"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <TemplatePreviewImage src={src} alt={alt} className="max-h-[78vh] w-full bg-zinc-100 object-contain" fallbackClassName="min-h-[24rem]" />
          </div>
        </div>
      ) : null}
    </>
  );
}
