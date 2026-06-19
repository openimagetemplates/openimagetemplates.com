"use client";

/* eslint-disable @next/next/no-img-element */
import { ImageIcon } from "lucide-react";
import { useState } from "react";

type TemplatePreviewImageProps = {
  src?: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
  width?: number;
  height?: number;
};

export function TemplatePreviewImage({
  src,
  alt,
  className = "",
  fallbackClassName = "",
  loading = "lazy",
  fetchPriority = "auto",
  width = 1024,
  height = 1024,
}: TemplatePreviewImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex h-full min-h-32 w-full flex-col items-center justify-center gap-2 bg-zinc-100 px-4 text-center text-zinc-600 ${fallbackClassName}`}
        role="img"
        aria-label={alt}
      >
        <ImageIcon size={24} aria-hidden="true" />
        <span className="text-sm font-medium">Preview coming soon</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={loading}
      fetchPriority={fetchPriority}
      onError={() => setFailed(true)}
    />
  );
}
