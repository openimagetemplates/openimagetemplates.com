"use client";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { TemplateLookControls } from "@/components/TemplateLookControls";
import { templateLookGroups, type TemplateLookGroupName } from "@/lib/prompt-builder";

type DemoFieldName = "subject" | "material" | "lighting";

const demoFields: Array<{ name: DemoFieldName; label: string }> = [
  { name: "subject", label: "Subject" },
  { name: "material", label: "Material" },
  { name: "lighting", label: "Lighting" },
];

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
  const [lookValues, setLookValues] = useState<Partial<Record<TemplateLookGroupName, string>>>({ style: "3D render" });
  const [openGroups, setOpenGroups] = useState<Partial<Record<TemplateLookGroupName, boolean>>>({ style: true });

  const adjustedPrompt = useMemo(() => {
    const style = lookValues.style ?? "3D render";
    const opener = stylePromptOpeners[style] ?? `Create a ${style.toLowerCase()} image of`;
    const creativeControls = templateLookGroups
      .map((group) => {
        const value = lookValues[group.name]?.trim();
        return value ? `${group.promptLabel}: ${value}` : null;
      })
      .filter(Boolean)
      .join("; ");
    const controlSentence = creativeControls ? ` Apply these creative controls: ${creativeControls}.` : "";

    return `${opener} a ${fields.subject || "subject"} in ${fields.material || "the chosen material"}, ${fields.lighting || "natural lighting"}, tactile studio details, natural imperfections, and warm craft atmosphere.${controlSentence}`;
  }, [fields, lookValues]);

  function setField(name: DemoFieldName, value: string) {
    setFields((current) => ({ ...current, [name]: value }));
  }

  function selectLookValue(name: TemplateLookGroupName, value: string) {
    setLookValues((current) => ({ ...current, [name]: value }));
  }

  function clearLookValue(name: TemplateLookGroupName) {
    setLookValues((current) => ({ ...current, [name]: undefined }));
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

        <div className="mt-4">
          <TemplateLookControls
            groups={templateLookGroups}
            lookValues={lookValues}
            openGroups={openGroups}
            onToggleGroup={(name) => setOpenGroups((current) => ({ ...current, [name]: !current[name] }))}
            onSelect={selectLookValue}
            onClear={clearLookValue}
            optionTestIdPrefix="homepage-look"
          />
        </div>

        <div className="mt-4 rounded-[8px] bg-zinc-950 p-4 text-zinc-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Created prompt</p>
          <p className="mt-4 text-sm leading-7 text-zinc-200">{adjustedPrompt}</p>
        </div>
        <Link
          href="/templates"
          className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800 sm:w-auto"
        >
          Select a template to get started
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
