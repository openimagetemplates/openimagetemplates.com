"use client";

import { Eye } from "lucide-react";
import { useState } from "react";
import { useSensitiveContent } from "@/components/SensitiveContentProvider";

type SensitiveContentBoundaryProps = {
  children: React.ReactNode;
  sensitive?: boolean;
  label?: string;
  className?: string;
};

export function SensitiveContentBoundary({
  children,
  sensitive = false,
  label = "Sensitive content",
  className = "",
}: SensitiveContentBoundaryProps) {
  const {
    preferenceRevision,
    showSensitiveContent,
    setShowSensitiveContent,
  } = useSensitiveContent();
  const [revealedAtRevision, setRevealedAtRevision] = useState<number | null>(null);

  const isHidden = sensitive
    && !showSensitiveContent
    && revealedAtRevision !== preferenceRevision;

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className}`}
      data-sensitive-content={sensitive ? "true" : undefined}
      data-sensitive-hidden={isHidden ? "true" : undefined}
    >
      <div
        className={
          isHidden
            ? "h-full w-full scale-110 blur-2xl saturate-50 transition duration-300"
            : "h-full w-full transition duration-300"
        }
        aria-hidden={isHidden || undefined}
        inert={isHidden || undefined}
      >
        {children}
      </div>

      {isHidden ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-zinc-950/80 p-4 text-center text-white backdrop-blur-md">
          <div className="flex max-w-xs flex-col items-center">
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setRevealedAtRevision(preferenceRevision);
              }}
              className="group inline-flex flex-col items-center rounded-[12px] px-5 py-4 outline-none transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
              aria-label={`Reveal ${label}`}
            >
              <span className="grid h-14 w-14 place-items-center rounded-full border border-white/30 bg-white/15 shadow-lg transition group-hover:scale-105 group-hover:bg-white/20">
                <Eye size={25} aria-hidden="true" />
              </span>
              <span className="mt-3 text-sm font-semibold">18+ sensitive content</span>
              <span className="mt-1 text-xs text-white/70">Click to reveal this image</span>
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setShowSensitiveContent(true);
              }}
              className="mt-1 rounded-full border border-white/25 px-3 py-1.5 text-xs font-semibold text-white/85 transition hover:border-white/45 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Show all sensitive images
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
