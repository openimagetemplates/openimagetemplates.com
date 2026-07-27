"use client";
/* eslint-disable @next/next/no-img-element */
import { Check, ChevronDown, Copy, ImageIcon, Loader2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { GeneratedImageDownload } from "@/components/GeneratedImageDownload";
import { NanoGptMark } from "@/components/NanoGptMark";
import { TemplateLookControls } from "@/components/TemplateLookControls";
import { templateEventProperties, trackEngagement } from "@/lib/analytics-events";
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

type NanoGptAuthStatusResponse = {
  connected?: unknown;
};

async function getNanoGptConnectionStatus() {
  try {
    const response = await fetch("/api/nanogpt-auth/status", { cache: "no-store" });
    const data = (await response.json().catch(() => ({}))) as NanoGptAuthStatusResponse;
    return response.ok && Boolean(data.connected);
  } catch {
    return false;
  }
}

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
  const [isNanoGptConnected, setIsNanoGptConnected] = useState<boolean | null>(null);
  const [nanoGptSignInOpen, setNanoGptSignInOpen] = useState(false);

  const adjustedPrompt = useMemo(() => compileTemplatePrompt(template, state), [template, state]);
  const analyticsProperties = useMemo(() => templateEventProperties(template), [template]);
  const generatedFromCurrentPrompt = Boolean(generatedImageUrl && generatedPrompt === adjustedPrompt);
  const estimatedCostLabel = estimatedImageCost === null ? "" : `$${estimatedImageCost.toFixed(4)}`;

  useEffect(() => {
    let active = true;

    getNanoGptConnectionStatus().then((connected) => {
      if (active) setIsNanoGptConnected(connected);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!nanoGptSignInOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setNanoGptSignInOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [nanoGptSignInOpen]);

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
    trackEngagement("select_look_control", {
      ...analyticsProperties,
      group: name,
      value,
    });
    setState((current) => ({
      ...current,
      lookValues: {
        ...current.lookValues,
        [name]: value,
      },
    }));
  }

  function clearLookValue(name: TemplateLookGroupName) {
    trackEngagement("clear_look_control", {
      ...analyticsProperties,
      group: name,
    });
    setState((current) => ({
      ...current,
      lookValues: {
        ...current.lookValues,
        [name]: undefined,
      },
    }));
  }

  function toggleControl(name: TemplateToggleControl["name"]) {
    const enabled = !state.toggles[name];
    trackEngagement("toggle_prompt_option", {
      ...analyticsProperties,
      option: name,
      enabled,
    });
    setState((current) => ({
      ...current,
      toggles: {
        ...current.toggles,
        [name]: enabled,
      },
    }));
  }

  function toggleLookGroup(name: TemplateLookGroupName) {
    const expanded = !openGroups[name];
    if (expanded) {
      trackEngagement("expand_look_group", {
        ...analyticsProperties,
        group: name,
      });
    }
    setOpenGroups((current) => ({ ...current, [name]: expanded }));
  }

  function toggleWhyNanoGpt() {
    const expanded = !whyNanoGptOpen;
    if (expanded) {
      trackEngagement("open_why_nanogpt", analyticsProperties);
    }
    setWhyNanoGptOpen(expanded);
  }

  async function copyAdjustedPrompt() {
    await navigator.clipboard.writeText(adjustedPrompt);
    trackEngagement("copy_prompt", {
      ...analyticsProperties,
      prompt_length: adjustedPrompt.length,
    });
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  async function generateImage() {
    const prompt = adjustedPrompt.trim();
    if (prompt.length < 3) {
      setImageGenerationError("Write a prompt before generating an image.");
      return;
    }

    let connected = isNanoGptConnected;
    if (connected === null) {
      connected = await getNanoGptConnectionStatus();
      setIsNanoGptConnected(connected);
    }
    if (!connected) {
      setImageGenerationError("");
      setNanoGptSignInOpen(true);
      trackEngagement("open_nanogpt_sign_in", analyticsProperties);
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
      if (response.status === 401) {
        setIsNanoGptConnected(false);
        setNanoGptSignInOpen(true);
        trackEngagement("open_nanogpt_sign_in", {
          ...analyticsProperties,
          reason: "session_expired",
        });
        return;
      }
      if (!response.ok || typeof data.imageUrl !== "string") {
        throw new Error(typeof data.message === "string" ? data.message : "Could not generate the image.");
      }

      setGeneratedImageUrl(data.imageUrl);
      setGeneratedPrompt(prompt);
      const cost = typeof data.cost === "number" ? `$${data.cost.toFixed(4)}` : "";
      setGeneratedImageMeta(cost ? `Generated image. Cost: ${cost}.` : "Generated image.");
      trackEngagement("generate_image", {
        ...analyticsProperties,
        cost: typeof data.cost === "number" ? data.cost : null,
      });
    } catch (generationError) {
      trackEngagement("generate_image_error", analyticsProperties);
      setImageGenerationError(generationError instanceof Error ? generationError.message : "Could not generate the image.");
    } finally {
      setImageGenerating(false);
    }
  }

  function signInWithNanoGpt() {
    trackEngagement("start_nanogpt_sign_in", analyticsProperties);
    const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    window.location.href = `/api/nanogpt-auth/start?returnTo=${encodeURIComponent(returnTo)}`;
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

        <div className="mt-5">
          <TemplateLookControls
            groups={controls.look}
            lookValues={state.lookValues}
            openGroups={openGroups}
            onToggleGroup={toggleLookGroup}
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
        <p className="mt-4 max-h-64 overflow-auto text-sm leading-7 text-zinc-700">
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
          onClick={toggleWhyNanoGpt}
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
          <GeneratedImageDownload
            imageUrl={generatedImageUrl}
            fileName={`${template.id}-generated`}
            eventName="download_generated_image"
            eventProperties={analyticsProperties}
          />
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

      {nanoGptSignInOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="nanogpt-sign-in-title"
          aria-describedby="nanogpt-sign-in-description"
          onClick={() => setNanoGptSignInOpen(false)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-[16px] bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 px-5 pb-3 pt-5 sm:px-6 sm:pt-6">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-zinc-950">
                  <NanoGptMark className="h-7 w-7" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Image generation</p>
                  <h2 id="nanogpt-sign-in-title" className="mt-1 text-xl font-semibold tracking-tight text-zinc-950">
                    Generate with NanoGPT
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setNanoGptSignInOpen(false)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-black/10 bg-white text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-950"
                aria-label="Close NanoGPT sign-in"
                autoFocus
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="px-5 pb-5 sm:px-6">
              <p id="nanogpt-sign-in-description" className="text-sm leading-6 text-zinc-600">
                NanoGPT connects this template to an image model. It sends the prompt you built, generates one image,
                and brings the result back to this page.
              </p>

              <ol className="mt-5 grid gap-3">
                {[
                  ["1", "Sign in", "Connect your NanoGPT account securely."],
                  ["2", "Review the cost", "See the estimated price before you generate."],
                  ["3", "Get your image", "The finished image appears here in the template builder."],
                ].map(([number, title, body]) => (
                  <li key={number} className="flex gap-3 rounded-[10px] bg-zinc-50 p-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-xs font-bold text-zinc-950 ring-1 ring-black/10">
                      {number}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-zinc-950">{title}</span>
                      <span className="mt-0.5 block text-sm leading-5 text-zinc-600">{body}</span>
                    </span>
                  </li>
                ))}
              </ol>

              <p className="mt-4 text-xs leading-5 text-zinc-500">
                There is no Open Image Templates subscription. Generation charges are handled by your NanoGPT account.
              </p>
            </div>

            <div className="border-t border-black/10 bg-zinc-50 p-4 sm:px-6">
              <button
                type="button"
                onClick={signInWithNanoGpt}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
              >
                <NanoGptMark />
                Sign in with NanoGPT
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
