"use client";
/* eslint-disable @next/next/no-img-element */
import { Check, ChevronDown, Copy, ImageIcon, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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

type TemplateImageGenerationResponse = {
  imageUrl?: unknown;
  cost?: unknown;
  message?: unknown;
};

type TemplateImageCostEstimateResponse = {
  cost?: unknown;
};

const nanoGptSellingPoints = [
  {
    title: "Pay per image, no subscription",
    body: "Generate when you need it without locking the template workflow behind a monthly plan.",
  },
  {
    title: "Use the prompt you just built",
    body: "The generated image uses the full prompt from this page, including your filled slots and look adjustments.",
  },
  {
    title: "Keep templates open",
    body: "Copy the prompt for any image tool, or generate directly here when you want the fastest path.",
  },
];

export function TemplatePromptBuilder({ template }: TemplatePromptBuilderProps) {
  const controls = useMemo(() => getTemplateBuilderControls(template), [template]);
  const [state, setState] = useState<TemplateBuilderState>(() => getDefaultBuilderState(template));
  const [openGroups, setOpenGroups] = useState<Partial<Record<TemplateLookGroupName, boolean>>>({});
  const [copied, setCopied] = useState(false);
  const [whyNanoGptOpen, setWhyNanoGptOpen] = useState(false);
  const [imageGenerating, setImageGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [generatedImageMeta, setGeneratedImageMeta] = useState("");
  const [imageGenerationError, setImageGenerationError] = useState("");
  const [estimatedImageCost, setEstimatedImageCost] = useState<number | null>(null);
  const [costEstimateLoading, setCostEstimateLoading] = useState(false);

  const adjustedPrompt = useMemo(() => compileTemplatePrompt(template, state), [template, state]);
  const generatedFromCurrentPrompt = Boolean(generatedImageUrl && generatedPrompt === adjustedPrompt);
  const estimatedCostLabel = estimatedImageCost === null ? "" : `$${estimatedImageCost.toFixed(4)}`;

  useEffect(() => {
    const prompt = adjustedPrompt.trim();
    if (prompt.length < 3) {
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setCostEstimateLoading(true);
      try {
        const response = await fetch("/api/template-image-cost-estimate", {
          method: "POST",
          headers: { "content-type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            prompt,
            model: template.suggestedModel || "gpt-image-2",
          }),
        });
        const data = (await response.json().catch(() => ({}))) as TemplateImageCostEstimateResponse;
        if (!response.ok || typeof data.cost !== "number") {
          setEstimatedImageCost(null);
          return;
        }
        setEstimatedImageCost(data.cost);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setEstimatedImageCost(null);
      } finally {
        if (!controller.signal.aborted) {
          setCostEstimateLoading(false);
        }
      }
    }, 500);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [adjustedPrompt, template.suggestedModel]);

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

  async function generateImage() {
    const prompt = adjustedPrompt.trim();
    if (prompt.length < 3) {
      setImageGenerationError("Write a prompt before generating an image.");
      return;
    }

    setImageGenerating(true);
    setImageGenerationError("");
    try {
      const response = await fetch("/api/template-image-generations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          prompt,
          model: template.suggestedModel || "gpt-image-2",
        }),
      });
      const data = (await response.json().catch(() => ({}))) as TemplateImageGenerationResponse;
      if (!response.ok || typeof data.imageUrl !== "string") {
        throw new Error(typeof data.message === "string" ? data.message : "Could not generate the image.");
      }

      setGeneratedImageUrl(data.imageUrl);
      setGeneratedPrompt(prompt);
      const cost = typeof data.cost === "number" ? `$${data.cost.toFixed(4)}` : "";
      setGeneratedImageMeta(cost ? `Generated image. Cost: ${cost}.` : "Generated image.");
    } catch (generationError) {
      setImageGenerationError(generationError instanceof Error ? generationError.message : "Could not generate the image.");
    } finally {
      setImageGenerating(false);
    }
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

      <div className="mt-6 rounded-[8px] border border-black/10 bg-zinc-50 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">Full prompt</h3>
        <p className="mt-4 max-h-64 overflow-auto rounded-[8px] bg-white p-4 text-sm leading-7 text-zinc-700 shadow-inner">
          {adjustedPrompt}
        </p>
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
        <button
          type="button"
          onClick={generateImage}
          disabled={imageGenerating}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          {imageGenerating ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <ImageIcon size={16} aria-hidden="true" />}
          {imageGenerating ? "Generating" : "Generate image"}
        </button>
      </div>

      <p className="mt-2 text-xs text-zinc-500">
        {estimatedCostLabel
          ? `Estimated generation cost: ${estimatedCostLabel}.`
          : costEstimateLoading
            ? "Estimating generation cost..."
            : "Generation cost is shown before the request whenever pricing is available."}
      </p>

      <div className="mt-3">
        <button
          type="button"
          onClick={() => setWhyNanoGptOpen((current) => !current)}
          className="inline-flex items-center gap-1.5 rounded-full px-0 py-2 text-sm font-semibold text-zinc-700 transition hover:text-zinc-950"
          aria-expanded={whyNanoGptOpen}
        >
          Why NanoGPT?
          <ChevronDown
            size={16}
            aria-hidden="true"
            className={`transition-transform ${whyNanoGptOpen ? "rotate-180" : ""}`}
          />
        </button>

        {whyNanoGptOpen ? (
          <div className="mt-2 grid gap-3 md:grid-cols-3">
            {nanoGptSellingPoints.map((point) => (
              <div key={point.title} className="rounded-[8px] border border-black/10 bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-zinc-950">{point.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{point.body}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {imageGenerationError ? (
        <p className="mt-3 rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{imageGenerationError}</p>
      ) : null}

      {generatedImageUrl ? (
        <div className="mt-5 overflow-hidden rounded-[8px] border border-black/10 bg-zinc-50">
          <div className="flex items-center justify-between gap-3 border-b border-black/10 px-4 py-3">
            <div>
              <h3 className="text-sm font-semibold text-zinc-950">Generated image</h3>
              <p className="mt-0.5 text-xs text-zinc-500">
                {generatedFromCurrentPrompt ? generatedImageMeta : "Prompt changed after this image was generated."}
              </p>
            </div>
          </div>
          <div className="bg-white p-3">
            <img
              src={generatedImageUrl}
              alt={`${template.title} generated preview`}
              className="mx-auto max-h-[640px] w-auto max-w-full rounded-[8px] object-contain"
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
