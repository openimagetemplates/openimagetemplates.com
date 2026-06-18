"use client";
import { Check, Copy } from "lucide-react";
import { useMemo, useState } from "react";
import { NanoGptGenerateButton } from "@/components/NanoGptGenerateButton";
import { TemplateLookControls } from "@/components/TemplateLookControls";
import {
  compileTemplatePrompt,
  getDefaultBuilderState,
  getTemplateBuilderControls,
  type TemplateBuilderState,
  type TemplateLookGroupName,
  type TemplateToggleControl,
} from "@/lib/prompt-builder";
import type { ImageTemplate } from "@/lib/templates";

type TemplatePromptBuilderProps = {
  template: ImageTemplate;
};

export function TemplatePromptBuilder({ template }: TemplatePromptBuilderProps) {
  const controls = useMemo(() => getTemplateBuilderControls(template), [template]);
  const [state, setState] = useState<TemplateBuilderState>(() => getDefaultBuilderState(template));
  const [openGroups, setOpenGroups] = useState<Partial<Record<TemplateLookGroupName, boolean>>>({});
  const [copied, setCopied] = useState(false);

  const adjustedPrompt = useMemo(() => compileTemplatePrompt(template, state), [template, state]);

  function setSlotValue(name: string, value: string) {
    setState((current) => ({
      ...current,
      slotValues: {
        ...current.slotValues,
        [name]: value,
      },
    }));
  }

  function selectLookValue(name: TemplateLookGroupName, value: string) {
    setState((current) => ({
      ...current,
      lookValues: {
        ...current.lookValues,
        [name]: value,
      },
    }));
  }

  function clearLookValue(name: TemplateLookGroupName) {
    setState((current) => ({
      ...current,
      lookValues: {
        ...current.lookValues,
        [name]: undefined,
      },
    }));
  }

  function toggleControl(name: TemplateToggleControl["name"]) {
    setState((current) => ({
      ...current,
      toggles: {
        ...current.toggles,
        [name]: !current.toggles[name],
      },
    }));
  }

  async function copyAdjustedPrompt() {
    await navigator.clipboard.writeText(adjustedPrompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
      <section className="mt-10 rounded-[8px] border border-black/10 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">Prompt builder</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">Adjust this template</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
              Fill the reusable parts, then add optional style, palette, lighting, material, or medium direction.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-zinc-950">Main details</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {controls.slots.map((slot) => (
              <label key={slot.name} className="block rounded-[8px] border border-black/10 bg-zinc-50 p-4">
                <span className="text-sm font-semibold text-zinc-950">{slot.label}</span>
                <input
                  value={state.slotValues[slot.name] ?? ""}
                  onChange={(event) => setSlotValue(slot.name, event.target.value)}
                  placeholder={slot.example}
                  className="mt-3 h-10 w-full rounded-[8px] border border-black/10 bg-white px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <TemplateLookControls
            groups={controls.look}
            lookValues={state.lookValues}
            openGroups={openGroups}
            onToggleGroup={(name) => setOpenGroups((current) => ({ ...current, [name]: !current[name] }))}
            onSelect={selectLookValue}
            onClear={clearLookValue}
          />
        </div>

      <label className="mt-5 block">
        <span className="text-sm font-semibold text-zinc-950">{controls.details.label}</span>
        <textarea
          value={state.extraDetails}
          onChange={(event) => setState((current) => ({ ...current, extraDetails: event.target.value }))}
          placeholder={controls.details.placeholder}
          rows={4}
          className="mt-3 w-full resize-y rounded-[8px] border border-black/10 bg-white px-3 py-3 text-sm leading-6 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950"
        />
      </label>

      <div className="mt-4 flex flex-wrap gap-2">
        {controls.toggles.map((toggle) => {
          const isSelected = Boolean(state.toggles[toggle.name]);
          return (
            <button
              key={toggle.name}
              type="button"
              onClick={() => toggleControl(toggle.name)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                isSelected
                  ? "inline-flex items-center gap-1.5 border-blue-500 bg-blue-50 text-blue-600"
                  : "border-black/10 bg-white text-zinc-700 hover:border-black/25"
              }`}
              aria-pressed={isSelected}
            >
              {isSelected ? <Check size={14} aria-hidden="true" /> : null}
              {toggle.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-[8px] bg-zinc-950 p-4 text-zinc-100">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-400">Full prompt</h3>
        <p className="mt-4 max-h-64 overflow-auto text-sm leading-7 text-zinc-200">{adjustedPrompt}</p>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={copyAdjustedPrompt}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-5 text-sm font-semibold text-zinc-950 shadow-sm transition hover:bg-zinc-50"
        >
          <Copy size={15} aria-hidden="true" />
          {copied ? "Copied" : "Copy prompt"}
        </button>
        <NanoGptGenerateButton template={template} prompt={adjustedPrompt} className="h-12 px-5" />
      </div>
    </section>
  );
}
