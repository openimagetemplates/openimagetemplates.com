"use client";

/* eslint-disable @next/next/no-img-element */
import { ArrowUpRight, Braces, Check, Clock3, Copy, ExternalLink, ImageIcon, Loader2, Plus, Send, Sparkles, Trash2, Upload, X } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useMemo, useRef, useState } from "react";
import { getNanoGptGenerateUrl } from "@/lib/nanogpt-url";
import {
  createEmptyTemplateDraft,
  COMMUNITY_SUBMISSION_STORAGE_KEY,
  draftFromTemplate,
  fileToDataUrl,
  PERSONAL_TEMPLATE_STORAGE_KEY,
  TEMPLATE_CREATOR_CATEGORIES,
  templateFromCreatorDraft,
  toCreatorJson,
  type CommunitySubmissionRecord,
  type TemplateAnalysisResponse,
  type TemplateCreatorDraft,
} from "@/lib/template-creator";
import type { ImageTemplate } from "@/lib/templates";

type TemplateCreatorProps = {
  baseTemplate?: ImageTemplate;
  initiallyOpen?: boolean;
  mode?: "modal" | "inline";
};

type CommunitySubmissionResponse = {
  submissionId?: unknown;
  submittedAt?: unknown;
  message?: unknown;
};

type TemplateImageGenerationResponse = {
  imageUrl?: unknown;
  cost?: unknown;
  paymentSource?: unknown;
  requestId?: unknown;
  message?: unknown;
};

const maxImageBytes = 4 * 1024 * 1024;

export function TemplateCreator({ baseTemplate, initiallyOpen = false, mode = "modal" }: TemplateCreatorProps) {
  const isInline = mode === "inline";
  const [open, setOpen] = useState(initiallyOpen || isInline);
  const [draft, setDraft] = useState<TemplateCreatorDraft>(() => createEmptyTemplateDraft(baseTemplate));
  const [idea, setIdea] = useState("");
  const [referenceImage, setReferenceImage] = useState("");
  const [referenceFileName, setReferenceFileName] = useState("");
  const [savedTemplate, setSavedTemplate] = useState<ImageTemplate | null>(null);
  const [savedSignature, setSavedSignature] = useState("");
  const [communitySubmission, setCommunitySubmission] = useState<CommunitySubmissionRecord | null>(null);
  const [communitySubmitting, setCommunitySubmitting] = useState(false);
  const [communityError, setCommunityError] = useState("");
  const [copied, setCopied] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [imageGenerating, setImageGenerating] = useState(false);
  const [generatedImageMeta, setGeneratedImageMeta] = useState("");
  const [imageGenerationError, setImageGenerationError] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const signature = useMemo(() => JSON.stringify(draft), [draft]);
  const isSaved = Boolean(savedTemplate && savedSignature === signature);
  const previewTemplate = useMemo(() => templateFromCreatorDraft(draft, savedTemplate?.id), [draft, savedTemplate?.id]);
  const templateJson = useMemo(() => JSON.stringify(toCreatorJson(previewTemplate), null, 2), [previewTemplate]);

  function openCreator() {
    setDraft(createEmptyTemplateDraft(baseTemplate));
    setIdea("");
    setReferenceImage("");
    setReferenceFileName("");
    setSavedTemplate(null);
    setSavedSignature("");
    setCommunitySubmission(null);
    setCommunitySubmitting(false);
    setCommunityError("");
    setCopied(false);
    setGeneratedImageMeta("");
    setImageGenerationError("");
    setError("");
    setOpen(true);
  }

  function openFromCurrentTemplate() {
    if (!baseTemplate) {
      openCreator();
      return;
    }

    setDraft(draftFromTemplate(baseTemplate));
    setIdea(baseTemplate.description);
    setReferenceImage("");
    setReferenceFileName("");
    setSavedTemplate(null);
    setSavedSignature("");
    setCommunitySubmission(null);
    setCommunitySubmitting(false);
    setCommunityError("");
    setCopied(false);
    setGeneratedImageMeta("");
    setImageGenerationError("");
    setError("");
    setOpen(true);
  }

  async function handleFile(file: File | null) {
    if (!file) return;
    setError("");
    if (file.size > maxImageBytes) {
      setError("Choose an image smaller than 4 MB.");
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setReferenceImage(dataUrl);
      setReferenceFileName(file.name);
      setDraft((current) => ({
        ...current,
        image: dataUrl,
        imageAlt: current.imageAlt || `${current.title || "Template"} preview`,
      }));
      setGeneratedImageMeta("");
      setImageGenerationError("");
    } catch (fileError) {
      setError(fileError instanceof Error ? fileError.message : "Unable to read image file.");
    }
  }

  async function generateWithAi() {
    const trimmedIdea = idea.trim();
    if (!referenceImage && trimmedIdea.length < 3) {
      setError("Upload an example image or describe the template you want.");
      return;
    }

    setAnalyzing(true);
    setError("");
    try {
      const response = await fetch("/api/template-drafts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...(referenceImage ? { image: referenceImage } : {}),
          ...(trimmedIdea ? { idea: trimmedIdea } : {}),
          suggestedModel: baseTemplate?.suggestedModel ?? "gpt-image-2",
          suggestedModelLabel: baseTemplate?.suggestedModelLabel ?? "GPT Image 2",
        }),
      });
      const data = (await response.json().catch(() => ({}))) as TemplateAnalysisResponse;
      if (!response.ok || !data.draft) {
        throw new Error(data.message || "Template AI request failed.");
      }
      setDraft(data.draft);
      setSavedTemplate(null);
      setSavedSignature("");
      setCommunitySubmission(null);
      setCommunityError("");
      setGeneratedImageMeta("");
      setImageGenerationError("");
    } catch (analysisError) {
      setError(analysisError instanceof Error ? analysisError.message : "Template AI request failed.");
    } finally {
      setAnalyzing(false);
    }
  }

  function useCurrentTemplateAsStart() {
    if (!baseTemplate) return;
    setDraft(draftFromTemplate(baseTemplate));
    setIdea(baseTemplate.description);
    setReferenceImage("");
    setReferenceFileName("");
    setSavedTemplate(null);
    setSavedSignature("");
    setCommunitySubmission(null);
    setCommunityError("");
    setGeneratedImageMeta("");
    setImageGenerationError("");
    setError("");
  }

  function updateDraft(patch: Partial<TemplateCreatorDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
    setSavedSignature("");
    setCommunityError("");
    setImageGenerationError("");
    setError("");
  }

  async function generatePreviewImage() {
    const prompt = draft.prompt.trim();
    if (prompt.length < 3) {
      setImageGenerationError("Write a model-ready prompt before generating an image.");
      return;
    }

    setImageGenerating(true);
    setImageGenerationError("");
    setError("");
    try {
      const response = await fetch("/api/template-image-generations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          prompt,
          model: draft.suggestedModel || "gpt-image-2",
        }),
      });
      const data = (await response.json().catch(() => ({}))) as TemplateImageGenerationResponse;
      if (!response.ok || typeof data.imageUrl !== "string") {
        throw new Error(typeof data.message === "string" ? data.message : "Could not generate the image.");
      }

      setDraft((current) => ({
        ...current,
        image: data.imageUrl as string,
        imageAlt: current.imageAlt || `${current.title || "Generated template"} preview`,
      }));
      const cost = typeof data.cost === "number" ? `$${data.cost.toFixed(4)}` : "";
      setGeneratedImageMeta(cost ? `Generated with NanoGPT. Cost: ${cost}.` : "Generated with NanoGPT.");
      setReferenceImage("");
      setReferenceFileName("");
      setSavedSignature("");
      setCommunitySubmission(null);
    } catch (generationError) {
      setImageGenerationError(generationError instanceof Error ? generationError.message : "Could not generate the image.");
    } finally {
      setImageGenerating(false);
    }
  }

  function updateSlot(id: string, patch: Partial<TemplateCreatorDraft["slots"][number]>) {
    updateDraft({
      slots: draft.slots.map((slot) => (slot.id === id ? { ...slot, ...patch } : slot)),
    });
  }

  function addSlot() {
    updateDraft({
      slots: [
        ...draft.slots,
        {
          id: `slot-${Date.now()}`,
          label: "Detail",
          example: "custom detail",
        },
      ].slice(0, 8),
    });
  }

  function removeSlot(id: string) {
    updateDraft({
      slots: draft.slots.length <= 1 ? draft.slots : draft.slots.filter((slot) => slot.id !== id),
    });
  }

  function saveTemplate() {
    const template = templateFromCreatorDraft(draft, savedTemplate?.id);
    const stored = readPersonalTemplates();
    const nextTemplates = [template, ...stored.filter((item) => item.id !== template.id)].slice(0, 100);
    window.localStorage.setItem(PERSONAL_TEMPLATE_STORAGE_KEY, JSON.stringify(nextTemplates));
    setSavedTemplate(template);
    setSavedSignature(JSON.stringify(draft));
    setCommunitySubmission(readCommunitySubmissionForTemplate(template.id));
    setCommunityError("");
  }

  async function submitCommunityTemplate() {
    if (!savedTemplate || !isSaved) {
      setCommunityError("Create the template before submitting it for review.");
      return;
    }

    setCommunitySubmitting(true);
    setCommunityError("");
    try {
      const response = await fetch("/api/template-submissions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          template: toCreatorJson(savedTemplate),
        }),
      });
      const data = (await response.json().catch(() => ({}))) as CommunitySubmissionResponse;
      if (!response.ok || !data.submissionId) {
        throw new Error(typeof data.message === "string" ? data.message : "Could not submit the template.");
      }

      const now = typeof data.submittedAt === "string" ? data.submittedAt : new Date().toISOString();
      const record: CommunitySubmissionRecord = {
        submissionId: String(data.submissionId),
        templateId: savedTemplate.id,
        templateTitle: savedTemplate.title,
        status: "pending_review",
        submittedAt: now,
        updatedAt: now,
      };
      writeCommunitySubmission(record);
      setCommunitySubmission(record);
    } catch (submitError) {
      setCommunityError(submitError instanceof Error ? submitError.message : "Could not submit the template.");
    } finally {
      setCommunitySubmitting(false);
    }
  }

  async function copyJson() {
    await navigator.clipboard.writeText(templateJson);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <>
      {!isInline ? (
      <section className="mt-8 rounded-[8px] border border-black/10 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">Create</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
              {baseTemplate ? "Make your own version" : "Create an image template"}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
              {baseTemplate
                ? "Fill the schema fields manually, start from this template, or generate a draft from an image or idea."
                : "Fill the schema fields manually or generate a draft from an image or idea."}
            </p>
          </div>
          <div className="grid gap-2">
            {baseTemplate ? (
              <button
                type="button"
                onClick={openFromCurrentTemplate}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-semibold leading-none text-zinc-950 transition hover:bg-zinc-50"
              >
                <Copy className="shrink-0" size={17} aria-hidden="true" />
                <span className="truncate">Start from this template</span>
              </button>
            ) : null}
            <Link
              href="/templates/create"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-zinc-950 px-4 py-3 text-sm font-semibold leading-none text-white transition hover:bg-zinc-800"
            >
              <Plus className="shrink-0" size={17} aria-hidden="true" />
              <span className="truncate">Start from scratch</span>
            </Link>
          </div>
        </div>
      </section>
      ) : null}

      {open ? (
        <div
          className={isInline ? "mt-10" : "fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-3 py-4 backdrop-blur-sm"}
          role={isInline ? undefined : "dialog"}
          aria-modal={isInline ? undefined : "true"}
          aria-label={isInline ? undefined : "Create image template"}
        >
          <div className={isInline ? "flex w-full flex-col overflow-hidden rounded-[8px] border border-black/10 bg-white shadow-sm" : "flex max-h-[94dvh] w-full max-w-6xl flex-col overflow-hidden rounded-[8px] bg-white shadow-2xl"}>
            <div className="flex items-start justify-between gap-4 border-b border-black/10 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Create template</h2>
                <p className="mt-1 text-sm leading-6 text-zinc-600">
                  AI can draft the structure, but the editable fields stay yours to review.
                </p>
              </div>
              {!isInline ? (
                <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-black/10 bg-white text-zinc-950 transition hover:bg-zinc-50"
                aria-label="Close template creator"
              >
                <X size={18} aria-hidden="true" />
              </button>
              ) : null}
            </div>

            <div className={isInline ? "px-5 py-5 sm:px-6" : "min-h-0 flex-1 overflow-auto px-5 py-5 sm:px-6"}>
              <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="space-y-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Title">
                      <input
                        value={draft.title}
                        onChange={(event) => updateDraft({ title: event.target.value })}
                        placeholder="Bold magazine close-up"
                        className="creator-input"
                      />
                    </Field>
                    <Field label="Category">
                      <select
                        value={draft.category}
                        onChange={(event) => updateDraft({ category: event.target.value as TemplateCreatorDraft["category"] })}
                        className="creator-input"
                      >
                        {TEMPLATE_CREATOR_CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <Field label="Catalogue summary">
                    <input
                      value={draft.description}
                      onChange={(event) => updateDraft({ description: event.target.value })}
                      placeholder="A reusable portrait template with polished editorial framing."
                      className="creator-input"
                    />
                  </Field>

                  <Field label="Tags">
                    <input
                      value={draft.tags}
                      onChange={(event) => updateDraft({ tags: event.target.value })}
                      placeholder="portrait, editorial, close-up"
                      className="creator-input"
                    />
                  </Field>

                  <Field label="Model-ready prompt">
                    <textarea
                      value={draft.prompt}
                      onChange={(event) => updateDraft({ prompt: event.target.value })}
                      placeholder="Write the full visible prompt. Use variables like {Subject}, then add matching editable slots below."
                      rows={7}
                      className="creator-input min-h-40 resize-y py-3 leading-6"
                    />
                  </Field>

                  <div className="rounded-[8px] bg-zinc-100 p-4 text-sm leading-6 text-zinc-600">
                    <p className="font-semibold text-zinc-950">Variables</p>
                    <p className="mt-1">
                      Use slot labels inside braces in the prompt. A slot named Subject can be referenced as {"{Subject}"}. Users will later edit the slot values in the prompt builder.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold text-zinc-950">Editable slots</h3>
                      <button
                        type="button"
                        onClick={addSlot}
                        disabled={draft.slots.length >= 8}
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-black/10 px-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        <Plus size={15} aria-hidden="true" />
                        Add slot
                      </button>
                    </div>
                    <div className="mt-3 space-y-3">
                      {draft.slots.map((slot, index) => (
                        <div key={slot.id} className="grid gap-2 rounded-[8px] border border-black/10 bg-zinc-50 p-3 sm:grid-cols-[1fr_1.4fr_auto]">
                          <Field label={`Slot ${index + 1} label`} compact>
                            <input
                              value={slot.label}
                              onChange={(event) => updateSlot(slot.id, { label: event.target.value })}
                              placeholder="Subject"
                              className="creator-input"
                            />
                          </Field>
                          <Field label="Example" compact>
                            <input
                              value={slot.example}
                              onChange={(event) => updateSlot(slot.id, { example: event.target.value })}
                              placeholder="main subject"
                              className="creator-input"
                            />
                          </Field>
                          <button
                            type="button"
                            onClick={() => removeSlot(slot.id)}
                            disabled={draft.slots.length <= 1}
                            className="mt-6 grid h-10 w-10 place-items-center rounded-full text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-35"
                            aria-label={`Remove slot ${index + 1}`}
                          >
                            <Trash2 size={16} aria-hidden="true" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[8px] bg-zinc-950 p-5 text-white">
                    <div className="flex items-center gap-2">
                      <Sparkles size={18} aria-hidden="true" />
                      <h3 className="text-lg font-semibold">Generate template with AI</h3>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">
                      Upload a reference image, describe an idea, or do both. The result fills the fields on the left for review.
                    </p>

                    <label className="mt-4 block">
                      <span className="text-sm font-semibold text-zinc-100">Template idea</span>
                      <textarea
                        value={idea}
                        onChange={(event) => setIdea(event.target.value)}
                        placeholder="Turn this into a reusable editorial close-up template..."
                        rows={4}
                        className="mt-2 w-full resize-y rounded-[8px] border border-white/15 bg-white/10 px-3 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-400 focus:border-white"
                      />
                    </label>

                    <div className="mt-4">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={(event) => void handleFile(event.target.files?.[0] ?? null)}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex min-h-52 w-full flex-col items-center justify-center rounded-[8px] border border-dashed border-white/25 bg-white/5 p-4 text-center transition hover:bg-white/10"
                      >
                        {referenceImage ? (
                          <img src={referenceImage} alt="Uploaded reference" className="max-h-64 w-full rounded-[8px] object-contain" />
                        ) : (
                          <>
                            <Upload size={28} aria-hidden="true" />
                            <span className="mt-3 text-sm font-semibold">Upload reference image</span>
                            <span className="mt-1 text-xs text-zinc-400">PNG, JPEG, or WebP up to 4 MB</span>
                          </>
                        )}
                      </button>
                      {referenceFileName ? <p className="mt-2 text-xs text-zinc-400">Selected: {referenceFileName}</p> : null}
                    </div>

                    {error ? <p className="mt-4 rounded-[8px] bg-red-500/15 p-3 text-sm leading-6 text-red-100">{error}</p> : null}

                    <button
                      type="button"
                      onClick={() => void generateWithAi()}
                      disabled={analyzing}
                      className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100 disabled:cursor-wait disabled:opacity-70"
                    >
                      {analyzing ? <Loader2 className="animate-spin" size={17} aria-hidden="true" /> : <ImageIcon size={17} aria-hidden="true" />}
                      Generate template with AI
                    </button>
                  </div>

                  <div className="rounded-[8px] border border-black/10 bg-white p-4">
                    <div className="flex items-center gap-2 text-zinc-950">
                      <ImageIcon size={18} aria-hidden="true" />
                      <h3 className="text-lg font-semibold">Generate image</h3>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      Create a preview from the current model-ready prompt. The image is added to this template before you submit it.
                    </p>
                    <div className="mt-4 overflow-hidden rounded-[8px] bg-zinc-100">
                      {draft.image ? (
                        <img src={draft.image} alt={draft.imageAlt || "Template preview"} className="max-h-72 w-full object-contain" />
                      ) : (
                        <div className="grid min-h-56 place-items-center px-6 text-center text-sm font-medium text-zinc-500">
                          Generated previews will appear here.
                        </div>
                      )}
                    </div>
                    {generatedImageMeta ? <p className="mt-3 text-xs leading-5 text-zinc-500">{generatedImageMeta}</p> : null}
                    {imageGenerationError ? (
                      <p className="mt-3 rounded-[8px] bg-red-50 p-3 text-sm leading-6 text-red-700">{imageGenerationError}</p>
                    ) : null}
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => void generatePreviewImage()}
                        disabled={imageGenerating || draft.prompt.trim().length < 3}
                        className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        {imageGenerating ? <Loader2 className="animate-spin" size={16} aria-hidden="true" /> : <ImageIcon size={16} aria-hidden="true" />}
                        Generate image
                      </button>
                      <a
                        href={getNanoGptGenerateUrl(previewTemplate)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-4 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-50"
                      >
                        Open in NanoGPT
                        <ExternalLink size={15} aria-hidden="true" />
                      </a>
                    </div>
                  </div>

                  <div className="rounded-[8px] border border-black/10 bg-white p-4">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">Preview JSON</h3>
                    <pre className="mt-3 max-h-72 overflow-auto rounded-[8px] bg-zinc-950 p-4 text-xs leading-5 text-zinc-100">
                      <code>{templateJson}</code>
                    </pre>
                  </div>

                  <div className="rounded-[8px] border border-black/10 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">Community templates</h3>
                        <p className="mt-2 text-sm leading-6 text-zinc-600">
                          Submit your created template for public review. Approved templates can be added to the gallery for everyone to copy and use.
                        </p>
                      </div>
                      {communitySubmission ? (
                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                          <Clock3 size={13} aria-hidden="true" />
                          Pending review
                        </span>
                      ) : null}
                    </div>

                    {communitySubmission ? (
                      <div className="mt-4 rounded-[8px] bg-zinc-100 p-3 text-sm leading-6 text-zinc-600">
                        <p className="font-semibold text-zinc-950">{communitySubmission.templateTitle}</p>
                        <p>
                          Submitted {new Date(communitySubmission.submittedAt).toLocaleDateString()}.
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          Approval status is saved in this browser while the template is reviewed.
                        </p>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => void submitCommunityTemplate()}
                        disabled={!savedTemplate || !isSaved || communitySubmitting}
                        className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-4 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        {communitySubmitting ? <Loader2 className="animate-spin" size={16} aria-hidden="true" /> : <Send size={16} aria-hidden="true" />}
                        Submit to community templates
                      </button>
                    )}

                    {!savedTemplate || !isSaved ? (
                      <p className="mt-3 text-xs leading-5 text-zinc-500">
                        Create or save your latest edits before submitting.
                      </p>
                    ) : null}
                    {communityError ? (
                      <p className="mt-3 rounded-[8px] bg-red-50 p-3 text-sm leading-6 text-red-700">{communityError}</p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-black/10 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              {baseTemplate ? (
                <button
                  type="button"
                  onClick={useCurrentTemplateAsStart}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-4 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-50"
                >
                  Use this template as start
                </button>
              ) : <span />}

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => void copyJson()}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-4 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-50"
                >
                  {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                  {copied ? "Copied JSON" : "Copy JSON"}
                </button>
                {savedTemplate ? (
                  <a
                    href={getNanoGptGenerateUrl(savedTemplate)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-4 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-50"
                  >
                    Generate with NanoGPT
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={saveTemplate}
                  className={`inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-white transition ${
                    isSaved ? "bg-green-600 hover:bg-green-600" : "bg-zinc-950 hover:bg-zinc-800"
                  }`}
                >
                  {isSaved ? <Check size={16} aria-hidden="true" /> : <Braces size={16} aria-hidden="true" />}
                  {isSaved ? "Saved" : "Create template"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function Field({ label, compact = false, children }: { label: string; compact?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className={`${compact ? "text-xs" : "text-sm"} font-semibold text-zinc-950`}>{label}</span>
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

function readPersonalTemplates(): ImageTemplate[] {
  try {
    const raw = window.localStorage.getItem(PERSONAL_TEMPLATE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item) => item && typeof item.id === "string" && typeof item.prompt === "string") : [];
  } catch {
    return [];
  }
}

function readCommunitySubmissions(): CommunitySubmissionRecord[] {
  try {
    const raw = window.localStorage.getItem(COMMUNITY_SUBMISSION_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is CommunitySubmissionRecord => (
          item
          && typeof item.submissionId === "string"
          && typeof item.templateId === "string"
          && typeof item.status === "string"
        ))
      : [];
  } catch {
    return [];
  }
}

function readCommunitySubmissionForTemplate(templateId: string) {
  return readCommunitySubmissions().find((submission) => submission.templateId === templateId) ?? null;
}

function writeCommunitySubmission(record: CommunitySubmissionRecord) {
  const existing = readCommunitySubmissions();
  const next = [record, ...existing.filter((submission) => submission.submissionId !== record.submissionId && submission.templateId !== record.templateId)].slice(0, 100);
  window.localStorage.setItem(COMMUNITY_SUBMISSION_STORAGE_KEY, JSON.stringify(next));
}
