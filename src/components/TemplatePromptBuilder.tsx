"use client";

/* eslint-disable @next/next/no-img-element */
import { Check, ChevronDown, Copy, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  compileTemplatePrompt,
  getDefaultBuilderState,
  getTemplateBuilderControls,
  type TemplateBuilderState,
  type TemplateLookGroup,
  type TemplateLookGroupName,
  type TemplateLookOption,
  type TemplateToggleControl,
} from "@/lib/prompt-builder";
import type { ImageTemplate } from "@/lib/templates";

type TemplatePromptBuilderProps = {
  template: ImageTemplate;
};

type PreviewOption = {
  groupLabel: string;
  option: TemplateLookOption;
};

export function TemplatePromptBuilder({ template }: TemplatePromptBuilderProps) {
  const controls = useMemo(() => getTemplateBuilderControls(template), [template]);
  const [state, setState] = useState<TemplateBuilderState>(() => getDefaultBuilderState(template));
  const [openGroups, setOpenGroups] = useState<Partial<Record<TemplateLookGroupName, boolean>>>({});
  const [previewOption, setPreviewOption] = useState<PreviewOption | null>(null);
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

  function handleLookOptionClick(group: TemplateLookGroup, option: TemplateLookOption) {
    if (state.lookValues[group.name] === option.value && option.image) {
      setPreviewOption({ groupLabel: group.promptLabel, option });
      return;
    }

    selectLookValue(group.name, option.value);
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
    <>
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

        <div className="mt-5 divide-y divide-black/10 rounded-[8px] border border-black/10">
          {controls.look.map((group) => {
            const selected = state.lookValues[group.name];
            const isOpen = openGroups[group.name];
            return (
              <div key={group.name}>
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setOpenGroups((current) => ({ ...current, [group.name]: !current[group.name] }))}
                    className="flex min-w-0 flex-1 items-center justify-between gap-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span>
                      <span className="block text-sm font-semibold text-zinc-950">{selected ? `${group.promptLabel}: ${selected}` : group.label}</span>
                      {selected ? <span className="mt-0.5 block text-xs text-blue-600">Click the selected option again to preview</span> : null}
                    </span>
                    <ChevronDown className={`shrink-0 transition ${isOpen ? "rotate-180" : ""}`} size={18} aria-hidden="true" />
                  </button>
                  {selected ? (
                    <button
                      type="button"
                      onClick={() => clearLookValue(group.name)}
                      className="rounded-full border border-blue-500 px-3 py-1 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                    >
                      Unselect
                    </button>
                  ) : null}
                </div>
              {isOpen ? (
                <div className="grid gap-3 px-4 pb-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.options.map((option) => {
                    const isSelected = selected === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleLookOptionClick(group, option)}
                        className={`group/tile overflow-hidden rounded-[8px] border bg-white text-left shadow-sm transition ${
                          isSelected
                            ? "border-blue-500 text-blue-600 ring-2 ring-blue-100"
                            : "border-black/10 text-zinc-700 hover:border-black/25 hover:text-zinc-950 hover:shadow-md"
                        }`}
                      >
                        {option.image ? (
                          <span className="block aspect-[4/3] overflow-hidden bg-zinc-100">
                            <img
                              src={option.image}
                              alt={`${option.label} preview`}
                              className="h-full w-full object-cover transition duration-300 group-hover/tile:scale-[1.03]"
                              loading="lazy"
                            />
                          </span>
                        ) : null}
                        <span className="flex min-h-12 items-center justify-between gap-2 px-3 py-2.5">
                          <span className="text-sm font-semibold">{option.label}</span>
                          {isSelected ? <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" /> : null}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-400">Adjusted prompt</h3>
          <button
            type="button"
            onClick={copyAdjustedPrompt}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100"
          >
            <Copy size={15} aria-hidden="true" />
            {copied ? "Copied" : "Copy adjusted prompt"}
          </button>
        </div>
        <p className="mt-4 max-h-64 overflow-auto text-sm leading-7 text-zinc-200">{adjustedPrompt}</p>
      </div>
    </section>
    {previewOption ? (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-label={`${previewOption.option.label} preview`}
        onClick={() => setPreviewOption(null)}
      >
        <div className="w-full max-w-3xl overflow-hidden rounded-[8px] bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
          <div className="flex items-center justify-between gap-4 border-b border-black/10 px-5 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">{previewOption.groupLabel}</p>
              <h3 className="mt-1 text-xl font-semibold tracking-tight text-zinc-950">{previewOption.option.label}</h3>
            </div>
            <button
              type="button"
              onClick={() => setPreviewOption(null)}
              className="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white text-zinc-950 transition hover:bg-zinc-50"
              aria-label="Close preview"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          {previewOption.option.image ? (
            <img src={previewOption.option.image} alt={`${previewOption.option.label} preview`} className="max-h-[72vh] w-full object-contain bg-zinc-100" />
          ) : null}
        </div>
      </div>
    ) : null}
    </>
  );
}
