import { templates, type ImageTemplate } from "@/lib/templates";

export type TemplateUseCase = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  bestFor: string[];
  choosingTips: string[];
  workflow: string[];
  faq: Array<{ question: string; answer: string }>;
  matches: (template: ImageTemplate) => boolean;
};

export const useCases: TemplateUseCase[] = [
  {
    slug: "ai-portrait-prompts",
    title: "AI Portrait Prompt Templates",
    description:
      "Reusable AI portrait prompts for headshots, editorial portraits, fashion images, characters, and profile photos.",
    intro:
      "Portrait prompts work best when framing, expression, lighting, wardrobe, and background are treated as separate decisions. These templates preserve that structure while letting you change the subject and visual direction.",
    bestFor: ["Professional headshots", "Editorial portraits", "Fashion and beauty concepts", "Character close-ups"],
    choosingTips: [
      "Choose a template whose crop already matches the intended output, such as a close-up, half-body portrait, or full look.",
      "Use an image-reference template when identity consistency matters; use a text-only template when exploring a new character.",
      "Keep expression and lighting changes deliberate so they do not compete with the subject.",
    ],
    workflow: [
      "Pick the closest framing and visual purpose.",
      "Fill the subject, wardrobe, expression, and setting slots.",
      "Adjust lighting or palette after the composition is settled.",
      "Inspect the visible compiled prompt before generating.",
    ],
    faq: [
      {
        question: "Can these prompts preserve a real person?",
        answer:
          "Templates marked as accepting an image reference can use an uploaded photo. Results still depend on the image model and the quality of the reference.",
      },
      {
        question: "Can I use the prompts in another image generator?",
        answer:
          "Yes. The complete prompt is visible, and every template has portable JSON. Suggested models are recommendations rather than requirements.",
      },
    ],
    matches: (template) =>
      template.category === "Portrait" ||
      template.tags.some((tag) => ["portrait", "headshot", "editorial", "fashion"].includes(tag)),
  },
  {
    slug: "product-photography-prompts",
    title: "AI Product Photography Prompt Templates",
    description:
      "AI product photography prompts for hero shots, packaging, ecommerce images, advertising, and branded still lifes.",
    intro:
      "Product-image prompts need clear hierarchy: the product must remain legible while surfaces, props, lighting, and brand mood support it. These templates provide reusable commercial compositions rather than a loose list of style adjectives.",
    bestFor: ["Product hero images", "Packaging concepts", "Ecommerce visuals", "Campaign still lifes"],
    choosingTips: [
      "Match the template to the material being rendered—glass, metal, textile, ceramic, and packaging need different lighting.",
      "Choose a composition with intentional negative space when the final image needs copy or a call to action.",
      "Describe brand colors and surface context without obscuring the product silhouette.",
    ],
    workflow: [
      "Select a hero, lifestyle, flat-lay, or packaging composition.",
      "Replace the product and surface slots with concrete details.",
      "Set palette, material, and lighting controls.",
      "Generate variants while keeping the core composition stable.",
    ],
    faq: [
      {
        question: "Are these suitable for final ecommerce assets?",
        answer:
          "They are useful for concepts and production drafts. Verify product shape, labels, legal copy, and brand details before publishing a generated image.",
      },
      {
        question: "Do I need a product reference image?",
        answer:
          "Some templates accept or require one, while others work from text. Each template page states its image-input requirement.",
      },
    ],
    matches: (template) =>
      template.category === "Product" ||
      template.tags.some((tag) => ["product", "advertising", "commercial", "flat lay"].includes(tag)),
  },
  {
    slug: "selfie-and-phone-photo-prompts",
    title: "AI Selfie and Phone Photo Prompt Templates",
    description:
      "Natural-looking AI selfie, mirror-selfie, candid, and phone-photo prompt templates with reusable settings and poses.",
    intro:
      "Convincing phone photography relies on ordinary camera behavior, believable environments, casual posing, and imperfect light. These templates help create that visual language without turning every image into a polished studio shoot.",
    bestFor: ["Mirror selfies", "Casual social posts", "Travel phone photos", "Lifestyle and outfit images"],
    choosingTips: [
      "Choose the location and camera behavior before adding fashion or aesthetic direction.",
      "Keep the lighting plausible for the room, street, or time of day.",
      "Use restrained detail so the image retains a candid phone-camera feel.",
    ],
    workflow: [
      "Pick a mirror, handheld, candid, or environmental phone-photo composition.",
      "Set the subject, outfit, location, and activity.",
      "Add only the lighting and palette needed for the scene.",
      "Review hands, reflections, devices, and background text in the output.",
    ],
    faq: [
      {
        question: "Why do AI selfies sometimes look too polished?",
        answer:
          "Prompts often add cinematic or studio language that conflicts with casual phone photography. Start with a phone-photo template and keep styling restrained.",
      },
      {
        question: "Which aspect ratio works best?",
        answer:
          "Portrait ratios are common for social posts, but each template publishes its recommended aspect ratio and resolution.",
      },
    ],
    matches: (template) =>
      template.tags.some((tag) => ["selfie", "mirror selfie", "phone photo"].includes(tag)),
  },
  {
    slug: "cinematic-ai-art-prompts",
    title: "Cinematic AI Art Prompt Templates",
    description:
      "Cinematic AI prompts for dramatic scenes, movie posters, key art, environments, lighting, and narrative compositions.",
    intro:
      "Cinematic prompts need a camera plan as well as atmosphere. The templates in this collection coordinate subject placement, environment, action, lens feel, light, and mood so the scene remains readable.",
    bestFor: ["Movie-poster concepts", "Narrative key art", "Establishing shots", "Dramatic character scenes"],
    choosingTips: [
      "Start with camera distance and subject hierarchy instead of mood words.",
      "Choose one dominant lighting idea that separates the subject from the environment.",
      "Use fog, rain, sparks, and neon as supporting elements rather than the main subject.",
    ],
    workflow: [
      "Select a composition that matches the story beat.",
      "Define the subject, action, environment, and camera angle.",
      "Choose atmosphere and lighting controls.",
      "Generate variations by changing one visual layer at a time.",
    ],
    faq: [
      {
        question: "What makes a prompt cinematic?",
        answer:
          "A cinematic prompt coordinates camera position, subject hierarchy, environment, lighting, atmosphere, and action instead of relying only on the word cinematic.",
      },
      {
        question: "Can these templates create posters?",
        answer:
          "Several are designed for poster or key-art compositions. Leave intentional negative space if typography will be added later.",
      },
    ],
    matches: (template) =>
      template.category === "Cinematic" ||
      template.tags.some((tag) => ["cinematic", "poster", "concept art"].includes(tag)),
  },
  {
    slug: "graphic-design-prompts",
    title: "AI Graphic Design Prompt Templates",
    description:
      "Structured AI graphic-design prompts for posters, album covers, ads, diagrams, interfaces, maps, and branded layouts.",
    intro:
      "Design prompts must communicate hierarchy, format, and production intent—not just visual style. This collection focuses on repeatable layouts for posters, covers, interfaces, diagrams, advertising, and branded compositions.",
    bestFor: ["Posters and covers", "Advertising concepts", "UI and dashboard visuals", "Maps and diagrams"],
    choosingTips: [
      "Pick a template with the right information hierarchy before changing its visual style.",
      "Treat generated text as draft content and replace important typography in a design tool.",
      "State the final format and where the design needs negative space.",
    ],
    workflow: [
      "Choose the closest layout and intended medium.",
      "Replace the subject, message, audience, or data slots.",
      "Set palette, style, and material direction.",
      "Check typography, symbols, alignment, and factual details before use.",
    ],
    faq: [
      {
        question: "Can AI-generated typography be published directly?",
        answer:
          "It should be reviewed carefully. Important headlines, labels, and legal copy are best replaced or corrected in a design tool.",
      },
      {
        question: "Are these templates limited to posters?",
        answer:
          "No. The collection includes interfaces, diagrams, maps, advertisements, covers, and other structured visual formats.",
      },
    ],
    matches: (template) =>
      template.category === "Design" ||
      template.tags.some((tag) =>
        ["graphic design", "poster", "album cover", "cover art", "advertising", "ui", "map"].includes(tag),
      ),
  },
  {
    slug: "character-design-prompts",
    title: "AI Character Design Prompt Templates",
    description:
      "Reusable AI character prompts for heroes, mascots, fantasy figures, collectibles, game concepts, and stylized portraits.",
    intro:
      "Character templates make identity decisions explicit: silhouette, costume, expression, pose, environment, and rendering style. That structure makes it easier to explore variations without losing the central concept.",
    bestFor: ["Game character concepts", "Mascots and avatars", "Fantasy and science-fiction figures", "Collectible designs"],
    choosingTips: [
      "Define a recognizable silhouette and costume logic before adding surface detail.",
      "Use the environment to explain the character rather than compete with it.",
      "Keep pose, expression, and narrative role aligned.",
    ],
    workflow: [
      "Choose a portrait, full-body, collectible, or scene-based template.",
      "Fill identity, wardrobe, pose, and setting slots.",
      "Choose a rendering medium and palette.",
      "Save the compiled prompt and selected controls for later consistency.",
    ],
    faq: [
      {
        question: "Can one template keep a character consistent?",
        answer:
          "It can preserve prompt structure and visual direction, but identity consistency also depends on the model, seed controls, and reference-image support.",
      },
      {
        question: "Can I export the character recipe?",
        answer:
          "Yes. Each page exposes portable JSON containing the visible prompt, slots, controls, model recommendation, example, creator, and license.",
      },
    ],
    matches: (template) =>
      template.category === "Character" ||
      template.tags.some((tag) => ["character", "fantasy", "avatar", "game"].includes(tag)),
  },
];

export function getUseCaseBySlug(slug: string) {
  return useCases.find((useCase) => useCase.slug === slug);
}

export function getTemplatesForUseCase(useCase: TemplateUseCase) {
  return templates.filter(useCase.matches);
}
