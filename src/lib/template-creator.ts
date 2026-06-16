import {
  TEMPLATE_SCHEMA_VERSION,
  TEMPLATE_STANDARD,
  type ImageTemplate,
  type TemplateCategory,
  type TemplateSlot,
} from "@/lib/templates";

export const PERSONAL_TEMPLATE_STORAGE_KEY = "open-image-templates.personal";
export const COMMUNITY_SUBMISSION_STORAGE_KEY = "open-image-templates.community-submissions";

export const TEMPLATE_CREATOR_CATEGORIES: TemplateCategory[] = [
  "Portrait",
  "Lifestyle",
  "Product",
  "Character",
  "Cinematic",
  "Design",
  "Other",
];

export type TemplateCreatorSlot = {
  id: string;
  label: string;
  example: string;
};

export type TemplateCreatorDraft = {
  title: string;
  description: string;
  category: TemplateCategory;
  tags: string;
  prompt: string;
  slots: TemplateCreatorSlot[];
  image: string;
  imageAlt: string;
  suggestedModel: string;
  suggestedModelLabel: string;
};

export type TemplateAnalysisResponse = {
  draft?: TemplateCreatorDraft;
  message?: string;
};

export type CommunitySubmissionStatus = "pending_review" | "approved" | "changes_requested" | "rejected";

export type CommunitySubmissionRecord = {
  submissionId: string;
  templateId: string;
  templateTitle: string;
  status: CommunitySubmissionStatus;
  submittedAt: string;
  updatedAt: string;
};

const DEFAULT_CREATOR_SLOTS: TemplateCreatorSlot[] = [
  { id: "subject", label: "Subject", example: "main subject" },
  { id: "setting", label: "Setting", example: "clean studio" },
  { id: "style", label: "Style", example: "editorial photo" },
];

export function createEmptyTemplateDraft(base?: Partial<ImageTemplate>): TemplateCreatorDraft {
  return {
    title: "",
    description: "",
    category: base?.category ?? "Design",
    tags: base?.tags?.slice(0, 5).join(", ") ?? "",
    prompt: "",
    slots: DEFAULT_CREATOR_SLOTS,
    image: "",
    imageAlt: "",
    suggestedModel: base?.suggestedModel ?? "gpt-image-2",
    suggestedModelLabel: base?.suggestedModelLabel ?? "GPT Image 2",
  };
}

export function draftFromTemplate(template: ImageTemplate): TemplateCreatorDraft {
  return {
    title: template.title,
    description: template.description,
    category: template.category,
    tags: template.tags.join(", "),
    prompt: template.prompt,
    slots: template.slots.map((slot) => ({
      id: slot.name,
      label: slot.label,
      example: slot.example,
    })),
    image: template.image,
    imageAlt: template.imageAlt,
    suggestedModel: template.suggestedModel,
    suggestedModelLabel: template.suggestedModelLabel ?? template.suggestedModel,
  };
}

export function templateFromCreatorDraft(draft: TemplateCreatorDraft, existingId?: string): ImageTemplate {
  const title = draft.title.trim() || "Untitled image template";
  const description = draft.description.trim() || "A reusable image template.";
  const prompt = draft.prompt.trim() || `Create ${title.toLowerCase()}.`;
  const slots = normalizeCreatorSlots(draft.slots);
  const generatedAt = new Date().toISOString().slice(0, 10);

  return {
    id: existingId || `local-${slugifyTemplateId(title)}-${Date.now().toString(36)}`,
    title,
    description,
    category: draft.category,
    tags: normalizeTags(draft.tags, draft.category, title),
    image: draft.image.trim(),
    imageAlt: draft.imageAlt.trim() || `${title} preview`,
    prompt,
    negativePrompt: [],
    slots,
    suggestedModel: draft.suggestedModel.trim() || "gpt-image-2",
    suggestedModelLabel: draft.suggestedModelLabel.trim() || draft.suggestedModel.trim() || "GPT Image 2",
    schemaVersion: TEMPLATE_SCHEMA_VERSION,
    generatedAt,
    creator: "Open Image Templates user",
    license: "User supplied",
  };
}

export function toCreatorJson(template: ImageTemplate) {
  return {
    standard: TEMPLATE_STANDARD,
    schema_version: template.schemaVersion,
    id: template.id,
    title: template.title,
    description: template.description,
    category: template.category,
    prompt: template.prompt,
    negative_prompt: template.negativePrompt,
    slots: template.slots,
    suggested_models: [
      {
        id: template.suggestedModel,
        label: template.suggestedModelLabel,
        role: "suggested",
      },
    ],
    examples: template.image
      ? [
          {
            image_url: template.image,
            generated_at: template.generatedAt,
            schema_version: template.schemaVersion,
          },
        ]
      : [],
    creator: template.creator,
    license: template.license,
  };
}

export function normalizeCategory(value: unknown): TemplateCategory {
  if (typeof value !== "string") return "Other";
  const match = TEMPLATE_CREATOR_CATEGORIES.find((category) => category.toLowerCase() === value.trim().toLowerCase());
  return match ?? "Other";
}

export function normalizeCreatorSlots(rows: TemplateCreatorSlot[]): TemplateSlot[] {
  const usedNames = new Set<string>();
  const slots = rows
    .map((row) => {
      const label = truncate(row.label || "Detail", 40);
      const example = truncate(row.example || label.toLowerCase(), 80);
      const name = uniqueSlotName(label, usedNames);
      return { name, label, example };
    })
    .filter((slot) => slot.label && slot.example)
    .slice(0, 8);

  return slots.length > 0 ? slots : [{ name: "subject", label: "Subject", example: "main subject" }];
}

export function slugifyTemplateId(value: string): string {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 64) || "custom-image-template"
  );
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Unable to read image file"));
      }
    };
    reader.onerror = () => reject(new Error("Unable to read image file"));
    reader.readAsDataURL(file);
  });
}

function normalizeTags(tags: string, category: TemplateCategory, title: string): string[] {
  const normalized = Array.from(
    new Set(
      [...tags.split(","), category, ...title.split(/\s+/).slice(0, 3)]
        .map((tag) => tag.trim().toLowerCase().replace(/[^a-z0-9 -]+/g, ""))
        .filter((tag) => tag.length >= 2)
        .map((tag) => truncate(tag, 32)),
    ),
  );

  return normalized.slice(0, 8).length >= 2 ? normalized.slice(0, 8) : ["template", category.toLowerCase()];
}

function uniqueSlotName(label: string, usedNames: Set<string>): string {
  const base = normalizeSlotName(label);
  let name = base;
  let suffix = 2;
  while (usedNames.has(name)) {
    const suffixText = `_${suffix}`;
    name = `${base.slice(0, 40 - suffixText.length)}${suffixText}`;
    suffix += 1;
  }
  usedNames.add(name);
  return name;
}

function normalizeSlotName(value: string): string {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_")
    .slice(0, 40);
  return /^[a-z]/.test(normalized) ? normalized : `slot_${normalized || "detail"}`.slice(0, 40);
}

function truncate(value: string, maxLength: number): string {
  const trimmed = value.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return trimmed.slice(0, maxLength).replace(/\s+\S*$/, "").trim() || trimmed.slice(0, maxLength);
}
