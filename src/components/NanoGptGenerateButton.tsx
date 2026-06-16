import { ArrowUpRight } from "lucide-react";
import { getNanoGptGenerateUrl } from "@/lib/nanogpt-url";
import type { ImageTemplate } from "@/lib/templates";
import { NanoGptMark } from "./NanoGptMark";

type NanoGptGenerateButtonProps = {
  template: ImageTemplate;
  prompt?: string;
  label?: string;
  className?: string;
};

export function NanoGptGenerateButton({ template, prompt, label = "Generate with NanoGPT", className = "" }: NanoGptGenerateButtonProps) {
  return (
    <a
      href={getNanoGptGenerateUrl(template, prompt)}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 text-sm font-semibold text-white transition hover:bg-zinc-800 ${className}`}
      target="_blank"
      rel="noreferrer"
    >
      <NanoGptMark />
      {label}
      <ArrowUpRight size={16} aria-hidden="true" />
    </a>
  );
}
