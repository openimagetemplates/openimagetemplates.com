import { NextResponse } from "next/server";
import {
  createEmptyTemplateDraft,
  normalizeCategory,
  slugifyTemplateId,
  type TemplateCreatorDraft,
  type TemplateCreatorSlot,
} from "@/lib/template-creator";

export const runtime = "nodejs";
export const maxDuration = 120;

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const dataUrlImageRegex = /^data:image\/[a-zA-Z0-9.+-]+;base64,/;

type NanoGptDraft = {
  title?: unknown;
  description?: unknown;
  category?: unknown;
  simplePrompt?: unknown;
  compiledPrompt?: unknown;
  demoPrompt?: unknown;
  tags?: unknown;
  slots?: unknown;
  previewImage?: unknown;
  suggestedModel?: unknown;
  suggestedModelLabel?: unknown;
};

function errorResponse(status: number, message: string) {
  return NextResponse.json({ message }, { status });
}

function parseString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function parseTags(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => parseString(item)).filter(Boolean).join(", ");
  }
  return parseString(value);
}

function parseSlots(value: unknown): TemplateCreatorSlot[] {
  if (!Array.isArray(value)) return createEmptyTemplateDraft().slots;

  const slots = value
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const raw = item as Record<string, unknown>;
      const label = parseString(raw.label, parseString(raw.name, "Detail"));
      const example = parseString(raw.example, label.toLowerCase());
      return {
        id: parseString(raw.name, `slot-${index + 1}`) || `slot-${index + 1}`,
        label,
        example,
      };
    })
    .filter((item): item is TemplateCreatorSlot => Boolean(item?.label && item.example))
    .slice(0, 8);

  return slots.length > 0 ? slots : createEmptyTemplateDraft().slots;
}

function dataUrlSizeIsValid(image: string) {
  const commaIndex = image.indexOf(",");
  if (commaIndex === -1) return false;
  const base64 = image.slice(commaIndex + 1);
  return Math.floor((base64.length * 3) / 4) <= MAX_IMAGE_BYTES;
}

function normalizeNanoGptDraft(rawTemplate: NanoGptDraft, fallbackImage: string): TemplateCreatorDraft {
  const defaultDraft = createEmptyTemplateDraft({
    suggestedModel: parseString(rawTemplate.suggestedModel, "gpt-image-2"),
    suggestedModelLabel: parseString(rawTemplate.suggestedModelLabel, "GPT Image 2"),
  });
  const title = parseString(rawTemplate.title, "Custom image template");
  const prompt = parseString(rawTemplate.compiledPrompt, parseString(rawTemplate.demoPrompt, parseString(rawTemplate.simplePrompt, `Create ${title.toLowerCase()}.`)));

  return {
    ...defaultDraft,
    title,
    description: parseString(rawTemplate.description, `A reusable image template for ${title.toLowerCase()}.`),
    category: normalizeCategory(rawTemplate.category),
    tags: parseTags(rawTemplate.tags),
    prompt,
    slots: parseSlots(rawTemplate.slots),
    image: parseString(rawTemplate.previewImage, fallbackImage),
    imageAlt: `${title} preview`,
    suggestedModel: parseString(rawTemplate.suggestedModel, defaultDraft.suggestedModel),
    suggestedModelLabel: parseString(rawTemplate.suggestedModelLabel, defaultDraft.suggestedModelLabel),
  };
}

function getNanoGptApiKey() {
  return process.env.NANOGPT_API_KEY || process.env.NANO_GPT_API_KEY || "";
}

function getNanoGptBaseUrl() {
  return (process.env.NANOGPT_BASE_URL || "https://nano-gpt.com").replace(/\/+$/, "");
}

export async function POST(request: Request) {
  const apiKey = getNanoGptApiKey();
  if (!apiKey) {
    return errorResponse(503, "Template AI is not configured yet.");
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return errorResponse(400, "Body must be valid JSON.");
  }

  const image = parseString(body.image);
  const idea = parseString(body.idea);

  if (!image && idea.length < 3) {
    return errorResponse(400, "Upload an example image or describe the template you want.");
  }

  if (image && (!dataUrlImageRegex.test(image) || !dataUrlSizeIsValid(image))) {
    return errorResponse(400, "Choose a PNG, JPEG, or WebP image smaller than 4 MB.");
  }

  const upstream = await fetch(`${getNanoGptBaseUrl()}/api/media/prompt-template-analysis`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      ...(image ? { image } : {}),
      ...(idea ? { idea } : {}),
      suggestedModel: parseString(body.suggestedModel, "gpt-image-2"),
      suggestedModelLabel: parseString(body.suggestedModelLabel, "GPT Image 2"),
    }),
  });

  const upstreamData = await upstream.json().catch(() => ({}));
  if (!upstream.ok || !upstreamData?.template) {
    return errorResponse(
      upstream.status || 502,
      parseString(upstreamData?.message, "Template AI request failed."),
    );
  }

  const draft = normalizeNanoGptDraft(upstreamData.template as NanoGptDraft, image);

  return NextResponse.json({
    draft,
    suggestedId: `local-${slugifyTemplateId(draft.title)}`,
  });
}
