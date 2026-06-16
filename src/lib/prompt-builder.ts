import type { ImageTemplate, TemplateSlot } from "@/lib/templates";

export type TemplateLookGroupName = "style" | "palette" | "lighting" | "photography_style" | "material" | "medium";

export type TemplateLookOption = {
  value: string;
  label: string;
  image?: string;
};

export type TemplateLookGroup = {
  name: TemplateLookGroupName;
  label: string;
  promptLabel: string;
  options: TemplateLookOption[];
};

export type TemplateToggleControl = {
  name: "add_props" | "branding_area";
  label: string;
  instruction: string;
};

export type TemplateBuilderControls = {
  slots: TemplateSlot[];
  look: TemplateLookGroup[];
  details: {
    name: "extra_details";
    label: string;
    placeholder: string;
  };
  toggles: TemplateToggleControl[];
};

export type TemplateBuilderState = {
  slotValues: Record<string, string>;
  lookValues: Partial<Record<TemplateLookGroupName, string>>;
  extraDetails: string;
  toggles: Partial<Record<TemplateToggleControl["name"], boolean>>;
};

export const templateLookGroups: TemplateLookGroup[] = [
  {
    name: "style",
    label: "Add a style",
    promptLabel: "Style",
    options: [
      "Photo",
      "Hyperreal",
      "Cinematic",
      "Editorial",
      "Illustration",
      "3D render",
      "Pixel art",
      "Anime poster",
      "Claymation",
      "Surrealism",
    ].map((label) => toLookOption("style", label)),
  },
  {
    name: "palette",
    label: "Add a color palette",
    promptLabel: "Color palette",
    options: [
      "Cool tones",
      "Warm tones",
      "Pastels",
      "Vibrant",
      "Earth tones",
      "Jewel tones",
      "Monochromatic blues",
      "Earthy reds and oranges",
      "Neon graffiti",
      "Autumn leaves",
      "Deep sea blues",
      "Grayscale",
      "Sepia",
      "Primary colors",
      "Rainbow spectrum",
      "Metallics",
    ].map((label) => toLookOption("palette", label)),
  },
  {
    name: "lighting",
    label: "Add lighting",
    promptLabel: "Lighting",
    options: [
      "Natural lighting",
      "Light and shadow",
      "Volumetric lighting",
      "Neon lighting",
      "Golden hour",
      "Blue hour",
      "Backlighting",
      "Chiaroscuro",
      "God rays",
      "Studio lighting",
      "Candlelight",
      "Street lighting",
      "Softbox lighting",
      "Moonlight",
      "Fairy lights",
    ].map((label) => toLookOption("lighting", label)),
  },
  {
    name: "photography_style",
    label: "Add a photography style",
    promptLabel: "Photography style",
    options: [
      "High key photography",
      "Low key photography",
      "Low angle photography",
      "High angle photography",
      "Extreme close-up",
      "Low shutter speed photography",
      "Bokeh photography",
      "Silhouette photography",
      "Black and white photography",
      "Bird's-eye view",
      "Worm's-eye view",
      "Dutch angle",
      "Long exposure photography",
    ].map((label) => toLookOption("photography", label)),
  },
  {
    name: "material",
    label: "Add a material",
    promptLabel: "Material",
    options: ["Porcelain", "Light", "Candy", "Bubbles", "Crystals", "Ceramic", "Plastic", "Wood", "Metal", "Water", "Glass", "Sand", "Rain"].map(
      (label) => toLookOption("material", label),
    ),
  },
  {
    name: "medium",
    label: "Add a medium",
    promptLabel: "Medium",
    options: ["Stencil", "Watercolor", "Papercraft", "Marker illustration", "Risograph", "Graffiti", "Ink wash", "Quilling", "Charcoal", "Oil painting", "Collage", "Mosaic"].map(
      (label) => toLookOption("medium", label),
    ),
  },
];

export const templateToggleControls: TemplateToggleControl[] = [
  {
    name: "add_props",
    label: "Add props",
    instruction: "include relevant scene props",
  },
  {
    name: "branding_area",
    label: "Include branding area",
    instruction: "leave clean space for logo or text overlay",
  },
];

export function getTemplateBuilderControls(template: ImageTemplate): TemplateBuilderControls {
  return {
    slots: template.slots,
    look: templateLookGroups,
    details: {
      name: "extra_details",
      label: "Extra details",
      placeholder: "Add anything the template should respect, such as mood, wardrobe, camera framing, text, or constraints.",
    },
    toggles: templateToggleControls,
  };
}

export function getDefaultBuilderState(template: ImageTemplate): TemplateBuilderState {
  return {
    slotValues: Object.fromEntries(template.slots.map((slot) => [slot.name, slot.example])),
    lookValues: {},
    extraDetails: "",
    toggles: {},
  };
}

export function compileTemplatePrompt(template: ImageTemplate, state: TemplateBuilderState) {
  const slotSummary = template.slots
    .map((slot) => `${slot.label}: ${state.slotValues[slot.name]?.trim() || slot.example}`)
    .join("; ");

  const lookSummary = templateLookGroups
    .map((group) => {
      const value = state.lookValues[group.name]?.trim();
      return value ? `${group.promptLabel}: ${value}` : null;
    })
    .filter(Boolean)
    .join("; ");

  const toggleSummary = templateToggleControls
    .map((toggle) => (state.toggles[toggle.name] ? toggle.instruction : null))
    .filter(Boolean)
    .join("; ");

  const extraDetails = state.extraDetails.trim();

  return [
    `Use this template as the composition recipe. Editable details are authoritative: ${slotSummary}.`,
    lookSummary ? `Apply these creative controls: ${lookSummary}.` : "",
    extraDetails ? `Additional user direction: ${extraDetails}.` : "",
    toggleSummary ? `Also: ${toggleSummary}.` : "",
    template.prompt,
  ]
    .filter(Boolean)
    .join(" ");
}

function toLookOption(assetGroup: string, label: string): TemplateLookOption {
  return {
    label,
    value: label,
    image: `https://nano-gpt.com/prompt-template-knobs/${assetGroup}-${toAssetSlug(label)}--generated-2026-06-08--preview.webp`,
  };
}

function toAssetSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
