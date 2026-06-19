import type { TemplateCategory } from "@/lib/templates";

export type CategorySeoCopy = {
  intro: string;
  useCases: string[];
  faq: Array<{ question: string; answer: string }>;
};

export const categorySeoCopy: Record<TemplateCategory, CategorySeoCopy> = {
  Portrait: {
    intro: "Portrait templates help keep framing, expression, wardrobe, lighting, and background direction consistent while the subject changes. They are useful for editorial portraits, profile images, fashion studies, character close-ups, and social-ready visual concepts.",
    useCases: ["Editorial portraits", "Profile and headshot concepts", "Fashion and beauty references", "Character close-ups"],
    faq: [
      {
        question: "What makes a good AI portrait template?",
        answer: "A good portrait template keeps the crop, lighting, expression, background, and camera feel stable while exposing subject, styling, and mood as editable fields.",
      },
      {
        question: "Can these portrait prompts be used outside NanoGPT?",
        answer: "Yes. Every template shows the full prompt and exposes portable JSON, so the prompt can be copied into other AI image generators.",
      },
    ],
  },
  Lifestyle: {
    intro: "Lifestyle templates are built for everyday scenes, candid-feeling campaigns, fashion moments, travel visuals, interiors, and social posts. The goal is to preserve a believable setting while making the subject, activity, and visual mood easy to change.",
    useCases: ["Candid campaign images", "Fashion lookbooks", "Travel and social visuals", "Interior lifestyle scenes"],
    faq: [
      {
        question: "Why use a lifestyle image template?",
        answer: "Lifestyle images depend on setting, pose, lighting, and realism. A reusable template keeps those ingredients aligned while the subject or scene changes.",
      },
      {
        question: "Do lifestyle templates include editable slots?",
        answer: "Yes. Templates expose reusable slots and look controls, then compile them into a visible full prompt.",
      },
    ],
  },
  Product: {
    intro: "Product templates focus on clear composition, material rendering, lighting, surfaces, and commercial intent. They are designed for product hero shots, packaging mockups, ecommerce visuals, launch campaigns, and brand still life concepts.",
    useCases: ["Product hero shots", "Packaging mockups", "Ecommerce concept images", "Brand still lifes"],
    faq: [
      {
        question: "How do product prompt templates improve consistency?",
        answer: "They keep product placement, lighting, surface, background, and commercial framing stable while letting the product and brand direction change.",
      },
      {
        question: "Can I adapt a product template for my own brand?",
        answer: "Yes. Change the editable product, surface, palette, and context fields, then copy or generate from the visible prompt.",
      },
    ],
  },
  Character: {
    intro: "Character templates help define repeatable visual identities for heroes, mascots, collectibles, fantasy figures, game concepts, and stylized portraits. They keep silhouette, costume, mood, and rendering direction easier to control.",
    useCases: ["Game character concepts", "Mascot design", "Collectible figure prompts", "Fantasy and sci-fi portraits"],
    faq: [
      {
        question: "What should character templates control?",
        answer: "Strong character templates control silhouette, outfit, pose, environment, mood, and rendering style while leaving identity and details editable.",
      },
      {
        question: "Are character templates only for one model?",
        answer: "No. Suggested models are metadata. The visible prompt and JSON structure are portable across generators.",
      },
    ],
  },
  Cinematic: {
    intro: "Cinematic templates are scene recipes for camera angle, subject hierarchy, atmosphere, lighting, and environment. They are useful for movie-poster concepts, key art, establishing shots, dramatic portraits, and narrative AI art.",
    useCases: ["Movie poster concepts", "Dramatic key art", "Establishing shots", "Narrative scene prompts"],
    faq: [
      {
        question: "Why do cinematic prompts need structure?",
        answer: "Cinematic scenes can drift when atmosphere overwhelms the subject. A template keeps camera, subject, environment, and light working together.",
      },
      {
        question: "Can I change lighting without rewriting the prompt?",
        answer: "Yes. Look controls let you add lighting, palette, style, material, and medium direction while preserving the base scene.",
      },
    ],
  },
  Design: {
    intro: "Design templates cover structured visual outputs such as posters, diagrams, icon sets, dashboards, packaging studies, maps, and branded compositions. They help preserve layout, hierarchy, and output intent.",
    useCases: ["Poster and album concepts", "Icon and UI visuals", "Diagrams and cutaways", "Brand and packaging layouts"],
    faq: [
      {
        question: "How are design templates different from art prompts?",
        answer: "Design templates care about layout, hierarchy, readability constraints, and production use, not only visual style.",
      },
      {
        question: "Do design templates include JSON endpoints?",
        answer: "Yes. Each template has a human page and a machine-readable JSON version for tools and agents.",
      },
    ],
  },
  Other: {
    intro: "Other templates collect useful prompt structures that do not fit neatly into one visual category. They still follow the same open format: visible prompt, editable slots, controls, preview image, and JSON endpoint.",
    useCases: ["Experimental prompt structures", "Mixed-format visuals", "Niche image workflows", "Reusable creative recipes"],
    faq: [
      {
        question: "Why is a template listed as Other?",
        answer: "Some reusable image prompts combine formats or use cases. Other keeps them discoverable without forcing an inaccurate category.",
      },
      {
        question: "Can Other templates still be reused?",
        answer: "Yes. They use the same open schema, visible prompt, editable slots, and JSON endpoint as every other template.",
      },
    ],
  },
};
