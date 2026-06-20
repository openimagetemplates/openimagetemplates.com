"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { type AnalyticsProperties, trackEngagement } from "@/lib/analytics-events";

type CopyButtonProps = {
  value: string;
  label?: string;
  className?: string;
  iconOnly?: boolean;
  trackEventName?: string;
  trackEventProperties?: AnalyticsProperties;
};

export function CopyButton({ value, label = "Copy", className = "", iconOnly = false, trackEventName, trackEventProperties }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    if (trackEventName) {
      trackEngagement(trackEventName, trackEventProperties);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : label}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-4 text-sm font-medium text-zinc-950 shadow-sm transition hover:border-black/20 hover:bg-zinc-50 ${className}`}
    >
      {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
      {iconOnly ? <span className="sr-only">{copied ? "Copied" : label}</span> : copied ? "Copied" : label}
    </button>
  );
}
