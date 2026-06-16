"use client";

/* eslint-disable @next/next/no-img-element */
import { ArrowUpRight, ChevronDown, Copy } from "lucide-react";
import { useMemo, useState } from "react";
import { templateLookGroups } from "@/lib/prompt-builder";
import { getNanoGptGenerateUrl } from "@/lib/nanogpt-url";
import { NanoGptMark } from "@/components/NanoGptMark";

type DemoFieldName = "subject" | "material" | "lighting";

const demoFields: Array<{ name: DemoFieldName; label: string }> = [
  { name: "subject", label: "Subject" },
  { name: "material", label: "Material" },
  { name: "lighting", label: "Lighting" },
];

const collapsedRows = ["Add a color palette", "Add lighting", "Add a photography style", "Add a material", "Add a medium"];
const styleOptions = templateLookGroups
  .find((group) => group.name === "style")
  ?.options.filter((option) => ["Photo", "3D render", "Anime poster"].includes(option.label)) ?? [];
const stylePromptOpeners: Record<string, string> = {
  Photo: "Create a photo of",
  "3D render": "Create a realistic 3D render of",
  "Anime poster": "Create an anime poster of",
};

export function HomepagePromptBuilderDemo() {
  const [fields, setFields] = useState<Record<DemoFieldName, string>>({
    subject: "ceramic vase",
    material: "wet clay",
    lighting: "dusty sunlight",
  });
  const [style, setStyle] = useState("3D render");
  const [copied, setCopied] = useState(false);

  const adjustedPrompt = useMemo(() => {
    const opener = stylePromptOpeners[style] ?? `Create a ${style.toLowerCase()} image of`;
    return `${opener} a ${fields.subject || "subject"} in ${fields.material || "the chosen material"}, ${fields.lighting || "natural lighting"}, tactile studio details, natural imperfections, and warm craft atmosphere.`;
  }, [fields, style]);

  const tryNowUrl = getNanoGptGenerateUrl(
    {
      suggestedModel: "gpt-image-2",
      prompt: adjustedPrompt,
    },
    adjustedPrompt,
  );

  function setField(name: DemoFieldName, value: string) {
    setFields((current) => ({ ...current, [name]: value }));
  }

  async function copyPrompt() {
    await navigator.clipboard.writeText(adjustedPrompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="rounded-[8px] border border-black/10 bg-white p-4 shadow-[0_24px_70px_rgba(24,24,27,0.12)] sm:p-5">
      <div className="rounded-[8px] bg-zinc-50 p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Adjust this template</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {demoFields.map((field) => (
            <label key={field.name} className="rounded-[8px] border border-black/10 bg-white p-3">
              <span className="text-sm font-semibold text-zinc-950">{field.label}</span>
              <input
                value={fields[field.name]}
                onChange={(event) => setField(field.name, event.target.value)}
                className="mt-3 h-10 w-full rounded-[8px] border border-black/10 bg-white px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950"
              />
            </label>
          ))}
        </div>

        <div className="mt-4 overflow-hidden rounded-[8px] border border-black/10 bg-white">
          <div className="border-b border-black/10 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-zinc-950">Style: {style}</p>
                <p className="mt-1 text-xs font-medium text-blue-600">Click a tile to update the prompt</p>
              </div>
              <ChevronDown className="rotate-180 text-zinc-700" size={18} aria-hidden="true" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {styleOptions.map((option) => {
                const isSelected = option.label === style;
                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setStyle(option.label)}
                    className={`overflow-hidden rounded-[8px] border bg-white text-left transition hover:border-black/25 ${
                      isSelected ? "border-blue-500 text-blue-600 ring-2 ring-blue-100" : "border-black/10 text-zinc-700"
                    }`}
                  >
                    {option.image ? (
                      <span className="block aspect-[4/3] overflow-hidden bg-zinc-100">
                        <img src={option.image} alt={`${option.label} style preview`} className="h-full w-full object-cover" />
                      </span>
                    ) : null}
                    <span className="flex min-h-10 items-center justify-between gap-2 px-3 py-2 text-sm font-semibold">
                      {option.label}
                      {isSelected ? <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" /> : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {collapsedRows.map((row) => (
            <div key={row} className="flex items-center justify-between border-b border-black/10 px-4 py-3 last:border-b-0">
              <span className="text-sm font-semibold text-zinc-950">{row}</span>
              <ChevronDown size={17} aria-hidden="true" />
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-[8px] bg-zinc-950 p-4 text-zinc-100">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Adjusted prompt</p>
            <button
              type="button"
              onClick={copyPrompt}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100"
            >
              <Copy size={15} aria-hidden="true" />
              {copied ? "Copied" : "Copy adjusted prompt"}
            </button>
          </div>
          <p className="mt-4 text-sm leading-7 text-zinc-200">{adjustedPrompt}</p>
          <a
            href={tryNowUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-white text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100 sm:w-auto sm:px-5"
          >
            <NanoGptMark />
            Try it now
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
