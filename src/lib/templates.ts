import templateCatalog from "@/data/nanogpt-prompt-templates.json";
import { getTemplateBuilderControls } from "@/lib/prompt-builder";

export const TEMPLATE_STANDARD = "open-image-template";
export const TEMPLATE_SCHEMA_VERSION = "1.1.0";

export type TemplateCategory =
  | "Portrait"
  | "Lifestyle"
  | "Product"
  | "Character"
  | "Cinematic"
  | "Design"
  | "Other";

export type TemplateSlot = {
  name: string;
  label: string;
  example: string;
};

export type ImageTemplate = {
  id: string;
  title: string;
  description: string;
  category: TemplateCategory;
  tags: string[];
  image: string;
  imageAlt: string;
  prompt: string;
  negativePrompt: string[];
  slots: TemplateSlot[];
  suggestedModel: string;
  suggestedModelLabel?: string;
  schemaVersion: typeof TEMPLATE_SCHEMA_VERSION;
  generatedAt: string;
  creator: string;
  license: string;
};

type SyncedTemplate = Omit<ImageTemplate, "category" | "schemaVersion"> & {
  category: string;
  schemaVersion: string;
};

const categoryOrder: Array<"All" | TemplateCategory> = [
  "All",
  "Portrait",
  "Lifestyle",
  "Product",
  "Character",
  "Cinematic",
  "Design",
  "Other",
];

export const templates: ImageTemplate[] = (templateCatalog.templates as SyncedTemplate[]).map((template) => ({
  ...template,
  category: toTemplateCategory(template.category),
  schemaVersion: TEMPLATE_SCHEMA_VERSION,
}));

export const categories: Array<"All" | TemplateCategory> = categoryOrder.filter((category) => {
  if (category === "All") return true;
  return templates.some((template) => template.category === category);
});

type TemplateSelectionOptions = {
  excludeIds?: Iterable<string>;
  startCategoryIndex?: number;
  startTemplateIndex?: number;
};

export const featuredTemplates = selectDiverseTemplates(templates, 6);

export function selectDiverseTemplates(
  sourceTemplates: ImageTemplate[],
  limit: number,
  options: TemplateSelectionOptions = {},
) {
  const excludedIds = new Set(options.excludeIds ?? []);
  const selectableCategories = categoryOrder.filter((category): category is TemplateCategory => category !== "All");
  const categoryOffset = normalizeOffset(options.startCategoryIndex ?? 0, selectableCategories.length);
  const templateOffset = Math.max(0, options.startTemplateIndex ?? 0);
  const orderedCategories = [
    ...selectableCategories.slice(categoryOffset),
    ...selectableCategories.slice(0, categoryOffset),
  ];
  const grouped = new Map(
    orderedCategories.map((category) => [
      category,
      sourceTemplates.filter((template) => template.category === category && !excludedIds.has(template.id)),
    ]),
  );
  const selected: ImageTemplate[] = [];
  const seenIds = new Set<string>();

  for (let round = 0; selected.length < limit && round < sourceTemplates.length; round += 1) {
    let addedThisRound = false;

    for (const category of orderedCategories) {
      const categoryTemplates = grouped.get(category) ?? [];
      if (categoryTemplates.length === 0) continue;

      const candidate = categoryTemplates[(round + templateOffset) % categoryTemplates.length];
      if (seenIds.has(candidate.id)) continue;

      selected.push(candidate);
      seenIds.add(candidate.id);
      addedThisRound = true;
      if (selected.length >= limit) break;
    }

    if (!addedThisRound) break;
  }

  if (selected.length >= limit) return selected;

  for (const template of sourceTemplates) {
    if (excludedIds.has(template.id) || seenIds.has(template.id)) continue;
    selected.push(template);
    seenIds.add(template.id);
    if (selected.length >= limit) break;
  }

  return selected;
}

export function getTemplateById(id: string) {
  return templates.find((template) => template.id === id);
}

export function toPortableTemplateJson(template: ImageTemplate) {
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
    controls: getTemplateBuilderControls(template),
    suggested_models: [
      {
        id: template.suggestedModel,
        label: template.suggestedModelLabel,
        role: "suggested",
      },
    ],
    examples: [
      {
        image_url: template.image,
        generated_at: template.generatedAt,
        schema_version: template.schemaVersion,
      },
    ],
    creator: template.creator,
    license: template.license,
  };
}

function toTemplateCategory(category: string): TemplateCategory {
  if (categoryOrder.includes(category as TemplateCategory)) {
    return category as TemplateCategory;
  }

  return "Other";
}

function normalizeOffset(value: number, length: number) {
  if (length <= 0) return 0;
  return ((value % length) + length) % length;
}
