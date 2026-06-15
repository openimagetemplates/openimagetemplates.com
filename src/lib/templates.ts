export const TEMPLATE_STANDARD = "open-image-template";
export const TEMPLATE_SCHEMA_VERSION = "1.0.0";

export type TemplateCategory =
  | "Candid"
  | "Portrait"
  | "Design"
  | "Cinematic"
  | "Product";

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
  schemaVersion: typeof TEMPLATE_SCHEMA_VERSION;
  generatedAt: string;
  creator: string;
  license: string;
};

const assetBaseUrl = process.env.NEXT_PUBLIC_TEMPLATE_ASSET_BASE_URL?.replace(/\/$/, "") ?? "";

const templateImage = (fileName: string) =>
  `${assetBaseUrl}/templates/${fileName}`;

export const categories: Array<"All" | TemplateCategory> = [
  "All",
  "Candid",
  "Portrait",
  "Design",
  "Cinematic",
  "Product",
];

export const templates: ImageTemplate[] = [
  {
    id: "low-light-street-phone-photo",
    title: "Low-Light Street Phone Photo",
    description: "An imperfect night street snapshot with direct phone flash.",
    category: "Candid",
    tags: ["phone flash", "street", "social feed"],
    image: templateImage("low-light-street-phone-photo--generated-2026-06-15--schema-v1.0.0.webp"),
    imageAlt: "Low-light phone flash street portrait preview",
    prompt:
      "Create an imperfect low-light phone photo of an adult subject on a city street at night, wearing a skin-forward but non-nude crop top and shorts, caught mid-step with direct phone flash, slight motion blur, overexposed skin highlights, dark storefront background, off-center framing, mild digital noise, and real social-feed snapshot energy. Avoid polished editorial lighting, readable text, logos, nudity, exposed nipples, exposed genitals, or explicit posing.",
    negativePrompt: ["nudity", "explicit pose", "readable logos", "studio lighting"],
    slots: [
      { name: "location", label: "Location", example: "night city street" },
      { name: "wardrobe", label: "Wardrobe", example: "crop top and shorts" },
      { name: "camera_style", label: "Camera style", example: "direct phone flash" },
    ],
    suggestedModel: "gpt-image-2",
    schemaVersion: TEMPLATE_SCHEMA_VERSION,
    generatedAt: "2026-06-15",
    creator: "Open Image Templates",
    license: "CC BY 4.0",
  },
  {
    id: "bathroom-mirror-routine-selfie",
    title: "Bathroom Mirror Routine Selfie",
    description: "A real bathroom mirror selfie with phone glare and everyday clutter.",
    category: "Candid",
    tags: ["mirror selfie", "bathroom", "phone photo"],
    image: templateImage("bathroom-mirror-routine-selfie--generated-2026-06-15--schema-v1.0.0.webp"),
    imageAlt: "Bathroom mirror phone selfie preview",
    prompt:
      "Create a casual bathroom mirror phone selfie of an adult subject getting ready, wearing public-safe skin-forward loungewear such as a cropped tank top and shorts, with shoulders, arms, and midriff visible but no nudity. Show one hand near their face, visible phone partially blocking the face, mirror smudges, towel and toiletry clutter, soft overhead bathroom light, slight wide-angle phone distortion, realistic skin texture, and imperfect social-feed framing. Avoid ad-campaign polish, readable labels, logos, exposed nipples, exposed genitals, or explicit posing.",
    negativePrompt: ["nudity", "exposed nipples", "readable labels", "beauty-ad polish"],
    slots: [
      { name: "setting", label: "Setting", example: "small bathroom mirror" },
      { name: "wardrobe", label: "Wardrobe", example: "cropped tank and shorts" },
      { name: "imperfection", label: "Imperfection", example: "mirror smudges and clutter" },
    ],
    suggestedModel: "gpt-image-2",
    schemaVersion: TEMPLATE_SCHEMA_VERSION,
    generatedAt: "2026-06-15",
    creator: "Open Image Templates",
    license: "CC BY 4.0",
  },
  {
    id: "messy-bedroom-outfit-check",
    title: "Messy Bedroom Outfit Check",
    description: "A casual mirror outfit selfie in a lived-in room.",
    category: "Candid",
    tags: ["mirror selfie", "bedroom", "outfit"],
    image: templateImage("messy-bedroom-outfit-check--generated-2026-06-15--schema-v1.0.0.webp"),
    imageAlt: "Messy bedroom mirror outfit selfie preview",
    prompt:
      "Create a casual bedroom mirror outfit-check selfie of an adult subject holding a phone, wearing public-safe skin-forward everyday fashion such as a fitted crop top with low-rise jeans or a short summer outfit. Show natural arms, shoulders, and midriff while keeping the subject non-nude. Place them in a lived-in bedroom with rumpled sheets and clothes in the background. Use natural phone-camera realism, slight tilted framing, mirror glare, soft daylight mixed with room light, realistic fabric texture, and unpolished social-feed authenticity. Avoid studio polish, readable text, logos, exposed nipples, exposed genitals, or explicit posing.",
    negativePrompt: ["nudity", "explicit posing", "studio polish", "readable text"],
    slots: [
      { name: "outfit", label: "Outfit", example: "crop top and low-rise jeans" },
      { name: "room_detail", label: "Room detail", example: "rumpled sheets and clothes" },
      { name: "camera_style", label: "Camera style", example: "tilted mirror phone photo" },
    ],
    suggestedModel: "gpt-image-2",
    schemaVersion: TEMPLATE_SCHEMA_VERSION,
    generatedAt: "2026-06-15",
    creator: "Open Image Templates",
    license: "CC BY 4.0",
  },
  {
    id: "passenger-seat-phone-snap",
    title: "Passenger Seat Phone Snap",
    description: "A casual in-car phone photo with window light and cramped framing.",
    category: "Candid",
    tags: ["car", "phone photo", "window light"],
    image: templateImage("passenger-seat-phone-snap--generated-2026-06-15--schema-v1.0.0.webp"),
    imageAlt: "Passenger-seat candid phone photo preview",
    prompt:
      "Create a casual passenger-seat phone photo of an adult subject in a car, wearing a public-safe summer outfit such as a tank top, sleeveless top, or off-shoulder sweater with visible arms and neckline, looking toward the side window with city buildings outside. Use cramped real-car framing, window reflections, uneven daylight on the face, slight phone blur, natural posture, visible seat and door interior, and unedited social-feed realism. Avoid glossy campaign styling, readable text, logos, nudity, exposed nipples, exposed genitals, or explicit posing.",
    negativePrompt: ["nudity", "explicit pose", "glossy campaign styling", "readable text"],
    slots: [
      { name: "location", label: "Location", example: "passenger seat" },
      { name: "lighting", label: "Lighting", example: "uneven window daylight" },
      { name: "pose", label: "Pose", example: "looking out the side window" },
    ],
    suggestedModel: "gpt-image-2",
    schemaVersion: TEMPLATE_SCHEMA_VERSION,
    generatedAt: "2026-06-15",
    creator: "Open Image Templates",
    license: "CC BY 4.0",
  },
  {
    id: "bedside-front-camera-selfie",
    title: "Bedside Front-Camera Selfie",
    description: "A low-effort front-camera selfie in a dim bedroom.",
    category: "Candid",
    tags: ["selfie", "bedroom", "front camera"],
    image: templateImage("bedside-front-camera-selfie--generated-2026-06-15--schema-v1.0.0.webp"),
    imageAlt: "Dim bedroom front-camera selfie preview",
    prompt:
      "Create a low-effort front-camera selfie of an adult subject sitting on or beside a bed in a dim bedroom, wearing public-safe skin-forward loungewear such as a fitted tank top, crop top, or athletic shorts, with shoulders and arms visible but no nudity. Put the face close to camera, one hand near the cheek, warm string lights or bedside lamp in the background, slight phone blur, compressed perspective, visible room clutter, and realistic unedited social-feed texture. Avoid beauty-ad polish, readable text, logos, exposed nipples, exposed genitals, or explicit posing.",
    negativePrompt: ["nudity", "explicit pose", "beauty-ad polish", "readable text"],
    slots: [
      { name: "setting", label: "Setting", example: "dim bedroom" },
      { name: "wardrobe", label: "Wardrobe", example: "fitted tank and shorts" },
      { name: "background_light", label: "Background light", example: "warm string lights" },
    ],
    suggestedModel: "gpt-image-2",
    schemaVersion: TEMPLATE_SCHEMA_VERSION,
    generatedAt: "2026-06-15",
    creator: "Open Image Templates",
    license: "CC BY 4.0",
  },
  {
    id: "disposable-camera-night-snap",
    title: "Disposable-Camera Night Snap",
    description: "A harsh-flash party snapshot with visible imperfections.",
    category: "Candid",
    tags: ["flash", "night out", "snapshot"],
    image: templateImage("disposable-camera-night-snap--generated-2026-06-15--schema-v1.0.0.webp"),
    imageAlt: "Disposable-camera party snapshot preview",
    prompt:
      "Create a disposable-camera style night-out snapshot of an adult subject wearing public-safe skin-forward party clothes such as a fitted crop top, sleeveless top, mini skirt, or shorts, photographed from slightly above with harsh direct flash, red-eye risk, glossy skin highlights, dark messy room or bar background, mild blur, grain, timestamp-like nostalgia without readable text, and spontaneous social-photo energy. Avoid polished editorial lighting, readable logos, nudity, exposed nipples, exposed genitals, or explicit posing.",
    negativePrompt: ["nudity", "explicit pose", "readable logos", "polished editorial lighting"],
    slots: [
      { name: "setting", label: "Setting", example: "dark messy room" },
      { name: "outfit", label: "Outfit", example: "fitted crop top and shorts" },
      { name: "camera_style", label: "Camera style", example: "disposable-camera flash" },
    ],
    suggestedModel: "gpt-image-2",
    schemaVersion: TEMPLATE_SCHEMA_VERSION,
    generatedAt: "2026-06-15",
    creator: "Open Image Templates",
    license: "CC BY 4.0",
  },
  {
    id: "chiaroscuro-studio-portrait",
    title: "Chiaroscuro Studio Portrait",
    description: "A dramatic low-key studio portrait with sculpted shadow.",
    category: "Portrait",
    tags: ["studio", "shadow", "editorial"],
    image: templateImage("chiaroscuro-studio-portrait--generated-2026-06-15--schema-v1.0.0.webp"),
    imageAlt: "Chiaroscuro studio portrait preview",
    prompt:
      "Create a dramatic chiaroscuro studio portrait of an adult subject wearing simple dark wardrobe, face turned slightly toward camera, with one strong side key light, deep shadow falloff, realistic skin texture, black background, painterly photographic contrast, and elegant editorial mood. Keep the subject fully clothed, non-explicit, and avoid readable text or logos.",
    negativePrompt: ["readable text", "logos", "plastic skin", "flat lighting"],
    slots: [
      { name: "subject", label: "Subject", example: "adult model" },
      { name: "wardrobe", label: "Wardrobe", example: "black turtleneck" },
      { name: "lighting", label: "Lighting", example: "single side key light" },
    ],
    suggestedModel: "gpt-image-2",
    schemaVersion: TEMPLATE_SCHEMA_VERSION,
    generatedAt: "2026-06-15",
    creator: "Open Image Templates",
    license: "CC BY 4.0",
  },
  {
    id: "gilded-fantasy-painterly-portrait",
    title: "Gilded Fantasy Painterly Portrait",
    description: "A dark blue fantasy portrait with ornate gold detailing.",
    category: "Portrait",
    tags: ["fantasy", "painterly", "gold"],
    image: templateImage("gilded-fantasy-painterly-portrait--generated-2026-06-15--schema-v1.0.0.webp"),
    imageAlt: "Gilded fantasy painterly portrait preview",
    prompt:
      "Create a painterly fantasy portrait of an adult subject with long dark hair, ornate gold accessories, deep navy and dark teal atmosphere, luminous skin, frame-like ornamental composition, fine digital painting detail, and romantic fantasy illustration mood. Keep the subject fully clothed, non-explicit, and avoid readable text or logos.",
    negativePrompt: ["readable text", "logos", "modern clothing", "flat lighting"],
    slots: [
      { name: "subject", label: "Subject", example: "long dark-haired adult" },
      { name: "ornamentation", label: "Ornamentation", example: "gold filigree jewelry" },
      { name: "palette", label: "Palette", example: "deep navy and gold" },
    ],
    suggestedModel: "midjourney",
    schemaVersion: TEMPLATE_SCHEMA_VERSION,
    generatedAt: "2026-06-15",
    creator: "Open Image Templates",
    license: "CC BY 4.0",
  },
  {
    id: "glowing-word-forest-installation",
    title: "Glowing Word Forest Installation",
    description: "A surreal typographic installation glowing in a foggy forest.",
    category: "Design",
    tags: ["typography", "installation", "forest"],
    image: templateImage("glowing-word-forest-installation--generated-2026-06-15--schema-v1.0.0.webp"),
    imageAlt: "Glowing word installation in a misty forest preview",
    prompt:
      "Create a surreal typographic installation in the shape of the word FOREST, made from translucent glowing blue material, standing inside a dense foggy pine forest. Use hyper-realistic cinematic lighting, wet ground reflections, volumetric mist, crisp letter silhouettes, and dramatic scale. Avoid extra readable text, logos, or UI elements.",
    negativePrompt: ["extra text", "logos", "flat lighting", "cartoon style"],
    slots: [
      { name: "word", label: "Word", example: "FOREST" },
      { name: "material", label: "Material", example: "translucent glowing blue glass" },
      { name: "environment", label: "Environment", example: "foggy pine forest" },
    ],
    suggestedModel: "midjourney",
    schemaVersion: TEMPLATE_SCHEMA_VERSION,
    generatedAt: "2026-06-15",
    creator: "Open Image Templates",
    license: "CC BY 4.0",
  },
  {
    id: "neon-city-album-cover-portrait",
    title: "Neon City Album-Cover Portrait",
    description: "A soft-focus neon city portrait with album-cover framing.",
    category: "Cinematic",
    tags: ["neon", "album cover", "city"],
    image: templateImage("neon-city-album-cover-portrait--generated-2026-06-15--schema-v1.0.0.webp"),
    imageAlt: "Neon city album-cover portrait preview",
    prompt:
      "Create an iconic album-cover style portrait of an adult subject in a saturated purple outfit, fully clothed, standing in a neon city street with stylized East Asian cyberpunk-inspired signage shapes without readable text. Use soft focus, magenta and cyan glow, cinematic street haze, centered cover composition, wet pavement reflections, and no logos.",
    negativePrompt: ["logos", "readable text", "nudity", "flat lighting"],
    slots: [
      { name: "wardrobe", label: "Wardrobe", example: "saturated purple outfit" },
      { name: "city_style", label: "City style", example: "neon cyberpunk street" },
      { name: "mood", label: "Mood", example: "soft-focus album cover" },
    ],
    suggestedModel: "midjourney",
    schemaVersion: TEMPLATE_SCHEMA_VERSION,
    generatedAt: "2026-06-15",
    creator: "Open Image Templates",
    license: "CC BY 4.0",
  },
  {
    id: "rain-window-cinematic-portrait",
    title: "Rain Window Cinematic Portrait",
    description: "A moody film-still portrait framed by rain and neon reflections.",
    category: "Cinematic",
    tags: ["rain", "window", "film still"],
    image: templateImage("rain-window-cinematic-portrait--generated-2026-06-15--schema-v1.0.0.webp"),
    imageAlt: "Rain window cinematic portrait preview",
    prompt:
      "Create a cinematic portrait of an adult subject beside a rain-covered window at night, with soft neon reflections, moody blue and amber light, visible droplets on glass, shallow depth of field, thoughtful expression, and film-still atmosphere. Keep the subject fully clothed, non-explicit, and avoid readable text or logos.",
    negativePrompt: ["readable text", "logos", "flat lighting", "nudity"],
    slots: [
      { name: "setting", label: "Setting", example: "rainy window at night" },
      { name: "lighting", label: "Lighting", example: "blue and amber neon" },
      { name: "mood", label: "Mood", example: "thoughtful film still" },
    ],
    suggestedModel: "gpt-image-2",
    schemaVersion: TEMPLATE_SCHEMA_VERSION,
    generatedAt: "2026-06-15",
    creator: "Open Image Templates",
    license: "CC BY 4.0",
  },
  {
    id: "sepia-fashion-model-portrait",
    title: "Sepia Fashion Model Portrait",
    description: "A warm editorial model portrait with vintage magazine polish.",
    category: "Portrait",
    tags: ["fashion", "sepia", "editorial"],
    image: templateImage("sepia-fashion-model-portrait--generated-2026-06-15--schema-v1.0.0.webp"),
    imageAlt: "Sepia fashion model portrait preview",
    prompt:
      "Create a high-fashion model portrait of an adult subject in warm sepia tones, fully clothed in structured couture styling, with soft studio haze, elegant cheekbone lighting, shallow depth of field, realistic skin texture, and vintage editorial magazine mood. Avoid readable text, logos, and explicit styling.",
    negativePrompt: ["readable text", "logos", "explicit styling", "plastic skin"],
    slots: [
      { name: "wardrobe", label: "Wardrobe", example: "structured cream couture" },
      { name: "tone", label: "Tone", example: "warm sepia" },
      { name: "lighting", label: "Lighting", example: "soft studio haze" },
    ],
    suggestedModel: "midjourney",
    schemaVersion: TEMPLATE_SCHEMA_VERSION,
    generatedAt: "2026-06-15",
    creator: "Open Image Templates",
    license: "CC BY 4.0",
  },
];

export const featuredTemplates = templates.slice(0, 6);

export function getTemplateById(id: string) {
  return templates.find((template) => template.id === id);
}

export function getNanoGptGenerateUrl(template: ImageTemplate) {
  const params = new URLSearchParams({
    mode: "image",
    model: template.suggestedModel,
    prompt: template.prompt,
  });

  return `https://nano-gpt.com/media?${params.toString()}`;
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
    suggested_models: [
      {
        id: template.suggestedModel,
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
