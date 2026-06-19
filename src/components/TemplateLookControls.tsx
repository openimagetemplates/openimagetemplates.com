"use client";

/* eslint-disable @next/next/no-img-element */
import { ChevronDown, X } from "lucide-react";
import { useState } from "react";
import type { TemplateLookGroup, TemplateLookGroupName, TemplateLookOption } from "@/lib/prompt-builder";

type PreviewOption = {
  groupLabel: string;
  option: TemplateLookOption;
};

type TemplateLookControlsProps = {
  groups: TemplateLookGroup[];
  lookValues: Partial<Record<TemplateLookGroupName, string>>;
  openGroups: Partial<Record<TemplateLookGroupName, boolean>>;
  onToggleGroup: (name: TemplateLookGroupName) => void;
  onSelect: (name: TemplateLookGroupName, value: string) => void;
  onClear: (name: TemplateLookGroupName) => void;
  optionTestIdPrefix?: string;
};

export function TemplateLookControls({
  groups,
  lookValues,
  openGroups,
  onToggleGroup,
  onSelect,
  onClear,
  optionTestIdPrefix,
}: TemplateLookControlsProps) {
  const [previewOption, setPreviewOption] = useState<PreviewOption | null>(null);

  function handleOptionClick(group: TemplateLookGroup, option: TemplateLookOption) {
    if (lookValues[group.name] === option.value && option.image) {
      setPreviewOption({ groupLabel: group.promptLabel, option });
      return;
    }

    onSelect(group.name, option.value);
  }

  return (
    <>
      <div className="divide-y divide-black/10 rounded-[8px] border border-black/10">
        {groups.map((group) => {
          const selected = lookValues[group.name];
          const isOpen = Boolean(openGroups[group.name]);
          return (
            <div key={group.name}>
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <button
                  type="button"
                  data-testid={optionTestIdPrefix ? `${optionTestIdPrefix}-toggle-${group.name}` : undefined}
                  onClick={() => onToggleGroup(group.name)}
                  className="flex min-w-0 flex-1 cursor-pointer items-center justify-between gap-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span>
                    <span className="block text-sm font-semibold text-zinc-950">
                      {selected ? `${group.promptLabel}: ${selected}` : group.label}
                    </span>
                    {selected ? <span className="mt-0.5 block text-xs text-blue-600">Click the selected option again to preview</span> : null}
                  </span>
                  <ChevronDown className={`shrink-0 transition ${isOpen ? "rotate-180" : ""}`} size={18} aria-hidden="true" />
                </button>
                {selected ? (
                  <button
                    type="button"
                    onClick={() => onClear(group.name)}
                    className="cursor-pointer rounded-full border border-blue-500 px-3 py-1 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
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
                        data-testid={
                          optionTestIdPrefix ? `${optionTestIdPrefix}-option-${group.name}-${toControlId(option.value)}` : undefined
                        }
                        onClick={() => handleOptionClick(group, option)}
                        className={`group/tile cursor-pointer overflow-hidden rounded-[8px] border bg-white text-left shadow-sm transition ${
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
                className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-black/10 bg-white text-zinc-950 transition hover:bg-zinc-50"
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

function toControlId(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
