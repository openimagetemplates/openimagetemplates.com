import templateCatalog from "@/data/templates.json";
import { getTemplateBuilderControls } from "@/lib/prompt-builder";
import { TEMPLATE_ASSET_BASE_URL, TEMPLATE_SITE_URL } from "@/lib/template-urls";

export const TEMPLATE_STANDARD = "open-image-template";
export const TEMPLATE_SCHEMA_VERSION = "1.2.0";

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

export type TemplateInputRequirements = {
  image?: {
    required: boolean;
    label: string;
    description: string;
  };
};

export type ImageTemplate = {
  id: string;
  title: string;
  description: string;
  category: TemplateCategory;
  nsfw: boolean;
  tags: string[];
  image: string;
  imageAlt: string;
  simplePrompt: string;
  prompt: string;
  demoPrompt: string;
  negativePrompt: string[];
  slots: TemplateSlot[];
  suggestedModel: string;
  suggestedModelLabel?: string;
  suggestedSettings: Record<string, unknown>;
  contentTier: "sfw" | "suggestive-capable";
  inputRequirements?: TemplateInputRequirements;
  sourceNotes?: string;
  schemaVersion: typeof TEMPLATE_SCHEMA_VERSION;
  exampleSchemaVersion: string;
  generatedAt: string;
  creator: string;
  license: string;
};

type CatalogTemplate = Omit<ImageTemplate, "category" | "schemaVersion" | "nsfw"> & {
  category: string;
  nsfw?: boolean;
};

type TemplateCatalog = {
  generatedAt?: string;
  source?: string;
  templates: CatalogTemplate[];
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

const canonicalTemplateCatalog = templateCatalog as TemplateCatalog;

export const templates: ImageTemplate[] = canonicalTemplateCatalog.templates.map((template) => ({
  ...template,
  category: toTemplateCategory(template.category),
  nsfw: template.nsfw === true,
  schemaVersion: TEMPLATE_SCHEMA_VERSION,
}));

export const categories: Array<"All" | TemplateCategory> = categoryOrder.filter((category) => {
  if (category === "All") return true;
  return templates.some((template) => template.category === category);
});

type TemplateSelectionOptions = {
  excludeIds?: Iterable<string>;
  includeNsfw?: boolean;
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
  const eligibleTemplates = options.includeNsfw
    ? sourceTemplates
    : sourceTemplates.filter((template) => !template.nsfw);
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
      eligibleTemplates.filter((template) => template.category === category && !excludedIds.has(template.id)),
    ]),
  );
  const selected: ImageTemplate[] = [];
  const seenIds = new Set<string>();

  for (let round = 0; selected.length < limit && round < eligibleTemplates.length; round += 1) {
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

  for (const template of eligibleTemplates) {
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
    tags: template.tags,
    canonical_url: `${TEMPLATE_SITE_URL}/templates/${template.id}`,
    summary_prompt: template.simplePrompt,
    nsfw: template.nsfw,
    prompt: template.prompt,
    demo_prompt: template.demoPrompt,
    negative_prompt: template.negativePrompt,
    content_tier: template.contentTier,
    input_requirements: template.inputRequirements,
    slots: template.slots,
    controls: getTemplateBuilderControls(template),
    suggested_models: [
      {
        id: template.suggestedModel,
        label: template.suggestedModelLabel,
        role: "suggested",
        settings: template.suggestedSettings,
      },
    ],
    examples: [
      {
        image_url: template.image,
        image_alt: template.imageAlt,
        generated_at: template.generatedAt,
        schema_version: template.exampleSchemaVersion,
      },
    ],
    creator: template.creator,
    license: template.license,
    source_notes: template.sourceNotes,
  };
}

export function toPortableTemplateCatalogJson() {
  return {
    standard: TEMPLATE_STANDARD,
    schema_version: TEMPLATE_SCHEMA_VERSION,
    generated_at: canonicalTemplateCatalog.generatedAt,
    source: "openimagetemplates.com canonical catalogue",
    canonical_url: `${TEMPLATE_SITE_URL}/templates.json`,
    asset_base_url: TEMPLATE_ASSET_BASE_URL,
    templates: templates.map(toPortableTemplateJson),
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
