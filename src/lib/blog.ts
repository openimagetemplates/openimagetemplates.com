export type BlogPostSection = {
  heading: string;
  paragraphs: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readMinutes: number;
  keywords: string[];
  sections: BlogPostSection[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "ai-image-prompt-templates-faster-creative-work",
    title: "10 AI Image Prompt Templates for Faster Creative Work",
    description: "A practical look at ten reusable image prompt templates that help creators move from idea to polished output faster.",
    publishedAt: "2026-06-19",
    readMinutes: 6,
    keywords: ["AI image prompt templates", "creative workflow", "prompt templates", "image generation"],
    sections: [
      {
        heading: "A faster path from idea to image",
        paragraphs: [
          "Creative work often starts with a rough visual direction: a portrait, a product mockup, a cinematic scene, or a campaign image. The hard part is not always the idea. It is translating the idea into a prompt that keeps composition, style, lighting, and subject details consistent across attempts.",
          "Open Image Templates are designed to make that translation repeatable. Instead of starting from a blank prompt each time, you start from a visible structure with editable fields. The template keeps the composition stable while letting you change the parts that matter for the current project.",
        ],
      },
      {
        heading: "Ten templates worth keeping close",
        paragraphs: [
          "A strong starter set should cover the work people repeat most often. Editorial portrait, product hero shot, cinematic establishing scene, lifestyle campaign image, packaging mockup, character close-up, social ad visual, brand moodboard, architectural interior, and concept art study are all good candidates because each has a clear structure and many reusable variations.",
          "The value is not that every template produces one perfect image. The value is that each template preserves a proven arrangement. A product hero template can keep the product centered, lit, and separated from the background. A portrait template can preserve framing, lens feel, and expression guidance. A cinematic scene template can keep subject, environment, camera angle, and atmosphere working together.",
        ],
      },
      {
        heading: "How to use templates in practice",
        paragraphs: [
          "Start by choosing the closest composition, then fill the slots before changing style. This order matters. If the subject and setting are unclear, style controls only decorate uncertainty. Once the main slots are defined, add look controls for palette, lighting, material, medium, and photography style.",
          "The final prompt should remain visible. That makes the workflow portable: copy it into any generator, open the JSON endpoint for tools, or generate directly with NanoGPT when you want a fast test. Faster creative work comes from reducing repeated prompt assembly, not hiding the prompt from the user.",
        ],
      },
    ],
  },
  {
    slug: "write-reusable-ai-image-prompts-with-variables",
    title: "How to Write Reusable AI Image Prompts with Variables",
    description: "Learn how prompt variables turn one AI image prompt into a reusable template for many subjects, settings, and styles.",
    publishedAt: "2026-06-19",
    readMinutes: 6,
    keywords: ["AI image prompt variables", "reusable prompts", "prompt engineering", "template prompts"],
    sections: [
      {
        heading: "Variables make prompts reusable",
        paragraphs: [
          "A fixed prompt describes one image. A prompt with variables describes a family of images. By turning details like subject, setting, product, audience, or mood into editable slots, the same structure can support many generations without rewriting the entire instruction.",
          "For example, a prompt can reference {Subject}, {Setting}, and {Lighting}. The template page can then render those variables as fields. A user enters a value once, and the final prompt updates in a controlled way.",
        ],
      },
      {
        heading: "Choose variables that change often",
        paragraphs: [
          "Good variables are not random blanks. They are the parts of a prompt that naturally change from project to project. Subject, product name, scene, environment, camera angle, color direction, and intended use are common examples. The stable parts, such as composition and quality constraints, should usually remain in the base prompt.",
          "A useful test is simple: if a user would ask 'what should I put here?', the slot needs a clear label and example. The slot called Subject might use an example like 'ceramic coffee cup' or 'founder portrait'. The example helps the user understand the level of detail expected.",
        ],
      },
      {
        heading: "Keep the compiled prompt visible",
        paragraphs: [
          "Variables should not hide the real prompt. The compiled prompt should be visible before generation so users can inspect, copy, or edit it. This is especially important for open templates because portability depends on clarity.",
          "In Open Image Templates, variables sit inside an open JSON schema with slots, controls, examples, and licensing metadata. That means humans can use the template in a browser, while tools can fetch the JSON endpoint and render the same fields in another image platform.",
        ],
      },
    ],
  },
  {
    slug: "fixed-prompts-vs-template-prompts",
    title: "Fixed Prompts vs. Template Prompts: What Works Better?",
    description: "A comparison of fixed AI image prompts and structured template prompts, and when each approach works best.",
    publishedAt: "2026-06-19",
    readMinutes: 6,
    keywords: ["fixed prompts", "template prompts", "AI image prompts", "prompt structure"],
    sections: [
      {
        heading: "Two ways to describe an image",
        paragraphs: [
          "A fixed prompt is a single instruction written for a single result. It can be fast, expressive, and easy to share. A template prompt is a reusable structure with editable fields and optional controls. It takes slightly more setup, but it can be reused across many related generations.",
          "Neither approach wins in every case. Fixed prompts are useful for experiments, one-off ideas, or highly specific art direction. Template prompts are better when you need consistency, iteration, or a workflow that other people can use without learning the entire prompt from scratch.",
        ],
      },
      {
        heading: "Where fixed prompts break down",
        paragraphs: [
          "Fixed prompts become fragile when you need controlled variation. Changing one phrase can accidentally change framing, lighting, or camera feel. Teams also struggle to reuse fixed prompts because the important parts are mixed into one block of text.",
          "That friction is especially visible in product photography, portraits, ad concepts, and cinematic scenes. These categories rely on repeatable composition. If the composition keeps drifting, the prompt is doing too much at once.",
        ],
      },
      {
        heading: "Where template prompts help",
        paragraphs: [
          "Template prompts separate stable structure from editable detail. The base prompt can preserve composition, while slots handle the subject, product, location, or audience. Look controls can add style, palette, lighting, material, and medium without forcing the user to rewrite the core instruction.",
          "The best workflow is not fixed prompts or templates forever. Start with a strong fixed prompt, then turn it into a template when you find yourself reusing it. That is how a good prompt becomes a reliable creative tool.",
        ],
      },
    ],
  },
  {
    slug: "build-prompt-template-product-photography",
    title: "How to Build a Prompt Template for Product Photography",
    description: "A step-by-step guide to building reusable AI image prompt templates for product photography and mockups.",
    publishedAt: "2026-06-19",
    readMinutes: 7,
    keywords: ["product photography prompts", "product mockup template", "AI product images", "prompt template"],
    sections: [
      {
        heading: "Product images need structure",
        paragraphs: [
          "Product photography prompts have a narrow job: make the product easy to inspect, desirable, and visually consistent. A good template protects those goals by keeping the product clear, the lighting intentional, and the background useful rather than distracting.",
          "Start with the product as the main slot. Add slots for setting, surface, lighting, color palette, and usage context. Keep the composition instructions stable: product position, camera angle, background depth, and whether the image should leave room for copy or branding.",
        ],
      },
      {
        heading: "Build the base prompt first",
        paragraphs: [
          "A strong base prompt might define a centered product hero shot, controlled studio lighting, realistic material rendering, clean shadows, and a background that matches the brand. The variables then decide which product appears and what environment supports it.",
          "Avoid turning every adjective into a slot. Too many variables make the template harder to use. The useful slots are the ones a marketer, designer, or founder would naturally change between campaigns.",
        ],
      },
      {
        heading: "Add controls for visual direction",
        paragraphs: [
          "Look controls are especially useful for product photography. Palette can shift between premium monochrome, playful pastel, and natural earth tones. Lighting can shift between soft studio, hard flash, golden hour, and dramatic rim light. Material controls help when the product is glass, metal, textile, ceramic, or plastic.",
          "Once the template works, attach a preview image and expose a JSON endpoint. That makes the template useful to search engines, AI tools, and other image platforms. The prompt stays visible, and the structure becomes portable.",
        ],
      },
    ],
  },
  {
    slug: "consistent-portrait-generation-prompt-templates",
    title: "7 Prompt Templates for Consistent Portrait Generation",
    description: "Seven reusable prompt structures for creating more consistent AI-generated portraits across styles and use cases.",
    publishedAt: "2026-06-19",
    readMinutes: 6,
    keywords: ["portrait prompt templates", "consistent AI portraits", "AI headshots", "portrait generation"],
    sections: [
      {
        heading: "Consistency starts with framing",
        paragraphs: [
          "Portrait generation is sensitive to small prompt changes. A template helps by preserving framing, lens feel, expression, lighting, and background while allowing the subject and style to change. That makes it easier to compare outputs and refine a direction.",
          "Seven useful portrait structures are: editorial close-up, studio headshot, lifestyle candid, cinematic character portrait, fashion lookbook, professional profile image, and painterly fantasy portrait. Each one has a different purpose, but all benefit from stable slots.",
        ],
      },
      {
        heading: "What each template should control",
        paragraphs: [
          "At minimum, a portrait template should expose subject, expression, setting, wardrobe, lighting, and camera angle. More advanced templates can add mood, era, color palette, and material cues. The base prompt should define the distance from the subject, background treatment, and realism level.",
          "For example, an editorial close-up template can keep a tight crop, confident expression, soft directional light, and magazine-grade detail. A lifestyle candid template can keep a natural pose, environmental context, and less polished camera feel.",
        ],
      },
      {
        heading: "Use previews to teach the style",
        paragraphs: [
          "Portrait templates work best when users can see what the structure is meant to produce. A preview image acts as a visual contract. If the user selects a style or lighting tile, clicking again to preview the option makes the control easier to understand.",
          "The goal is not to remove creativity. It is to make the repeatable parts reliable so the creative changes are deliberate. That is what turns portrait prompting from guesswork into a reusable workflow.",
        ],
      },
    ],
  },
  {
    slug: "ai-image-prompts-checklist-before-you-generate",
    title: "AI Image Prompts: A Checklist Before You Generate",
    description: "A practical checklist for reviewing AI image prompts before spending credits or time on generation.",
    publishedAt: "2026-06-19",
    readMinutes: 5,
    keywords: ["AI image prompt checklist", "prompt engineering checklist", "image generation prompts"],
    sections: [
      {
        heading: "Review the prompt before the model does",
        paragraphs: [
          "Many failed image generations are not model failures. They are unclear instructions. Before generating, check whether the prompt describes the subject, composition, setting, lighting, style, and intended use in a way that can survive interpretation.",
          "A checklist helps because image prompts often grow in layers. You start with a subject, add style, add a camera angle, add lighting, then add constraints. Without review, those layers can conflict.",
        ],
      },
      {
        heading: "The core checklist",
        paragraphs: [
          "Ask these questions before generating: What is the main subject? Where is it placed? What should the viewer notice first? What is the setting? What lighting should shape the scene? What style or medium should guide the output? Are there any details that should be avoided?",
          "Then check for contradictions. A prompt cannot easily be both candid and perfectly symmetrical, or both minimal and packed with props. If two directions compete, decide which one matters more.",
        ],
      },
      {
        heading: "Templates make the checklist reusable",
        paragraphs: [
          "A good template turns the checklist into a form. Slots capture the details that change, while the base prompt keeps the structure. Look controls give users a safe way to add style, palette, lighting, material, and medium without accidentally rewriting the entire prompt.",
          "This is why Open Image Templates keeps the final prompt visible. Users can inspect the compiled instruction before generating, copy it into any tool, or generate directly when they are ready.",
        ],
      },
    ],
  },
  {
    slug: "inconsistent-ai-images-structured-templates",
    title: "Getting Inconsistent AI Images? Use Structured Templates",
    description: "Why AI image outputs drift, and how structured prompt templates improve consistency across repeated generations.",
    publishedAt: "2026-06-19",
    readMinutes: 6,
    keywords: ["inconsistent AI images", "structured prompts", "consistent image generation", "prompt templates"],
    sections: [
      {
        heading: "Inconsistency is usually structural",
        paragraphs: [
          "If every generation feels like a new interpretation, the prompt may not be giving the model enough stable structure. Image models are flexible by design. Without clear composition, subject hierarchy, lighting, and style constraints, they will explore a wide range of valid outputs.",
          "Structured templates reduce that range. They keep the repeatable instructions in place and expose the changeable details as slots. The result is still creative, but the direction is less likely to drift between attempts.",
        ],
      },
      {
        heading: "Separate stable and variable detail",
        paragraphs: [
          "The stable layer includes composition, camera distance, framing, background complexity, lighting logic, and quality expectations. The variable layer includes subject, product, setting, mood, color palette, and optional props. Mixing these layers into one long prompt makes edits harder to control.",
          "A template can say: keep this portrait structure, but change the subject and environment. Or: keep this product shot arrangement, but change the product, material, and surface. This is the practical difference between prompting and prompt design.",
        ],
      },
      {
        heading: "Use controls for deliberate variation",
        paragraphs: [
          "Once the base structure is stable, visual controls become useful. Style, lighting, material, medium, and palette can be changed one at a time. That makes it easier to understand what caused an output to change.",
          "Consistency does not mean every image looks identical. It means the important parts remain reliable while the creative direction changes on purpose. Structured templates make that tradeoff visible and repeatable.",
        ],
      },
    ],
  },
  {
    slug: "cinematic-scene-prompt-templates-ai-art",
    title: "Top 8 Cinematic Scene Prompt Templates for AI Art",
    description: "Eight cinematic prompt template structures for building AI-generated scenes with stronger composition, lighting, and atmosphere.",
    publishedAt: "2026-06-19",
    readMinutes: 6,
    keywords: ["cinematic prompt templates", "AI art scenes", "cinematic AI prompts", "scene generation"],
    sections: [
      {
        heading: "Cinematic scenes need a camera plan",
        paragraphs: [
          "Cinematic prompts work best when they describe more than mood. They need subject placement, environment, camera angle, lens feel, lighting, atmosphere, and action. A template helps keep those parts aligned while the scene changes.",
          "Eight useful structures are: wide establishing shot, low-angle hero frame, over-the-shoulder tension scene, neon city street, foggy forest reveal, interior practical-light scene, chase sequence still, and quiet aftermath shot.",
        ],
      },
      {
        heading: "Build atmosphere without losing the subject",
        paragraphs: [
          "Cinematic prompts often over-index on atmosphere. Fog, rain, neon, smoke, sparks, and dramatic lighting can make a scene feel rich, but they can also bury the subject. The template should keep the subject hierarchy explicit.",
          "A strong scene template names the subject, where the camera is, what the environment contributes, and how the light separates the subject from the background. Then style and palette controls can shape the final look.",
        ],
      },
      {
        heading: "Why templates help cinematic iteration",
        paragraphs: [
          "Cinematic images are often developed through comparison. You may want the same shot in golden hour, blue hour, blacklight, or chiaroscuro lighting. You may want a wide frame and then a close-up. Templates make these changes deliberate rather than accidental.",
          "By exposing slots and controls, Open Image Templates turns cinematic prompting into a repeatable scene-building workflow. The final prompt remains visible, so the result can be copied, generated, or adapted in another tool.",
        ],
      },
    ],
  },
  {
    slug: "reuse-ai-prompts-across-different-image-tools",
    title: "How to Reuse AI Prompts Across Different Image Tools",
    description: "A guide to making AI image prompts more portable across generators, interfaces, and creative workflows.",
    publishedAt: "2026-06-19",
    readMinutes: 6,
    keywords: ["reuse AI prompts", "portable prompts", "image generators", "prompt schema"],
    sections: [
      {
        heading: "Portability starts with visible prompts",
        paragraphs: [
          "A prompt cannot be portable if the important parts are hidden. To reuse a prompt across image tools, the instruction needs to be visible, copyable, and structured enough that another interface can understand what should be edited.",
          "Different generators may interpret style words, aspect ratios, and model-specific parameters differently. A portable prompt should keep the creative intent clear while treating model suggestions as recommendations rather than requirements.",
        ],
      },
      {
        heading: "Separate prompt content from tool settings",
        paragraphs: [
          "The prompt should describe the image. Tool settings should describe how a specific platform generates it. When these are mixed together, reuse becomes harder. A template schema can carry suggested models and examples while still keeping the visible prompt independent.",
          "This separation is why Open Image Templates exposes both a human page and a JSON endpoint. Humans can copy the prompt. Tools can fetch slots, controls, examples, creator metadata, and license information.",
        ],
      },
      {
        heading: "Build for graceful translation",
        paragraphs: [
          "When moving a prompt between tools, expect some translation. A lighting instruction may transfer well, while a model-specific style token may not. The best templates provide enough plain-language direction that the image remains understandable even when a platform swaps models.",
          "Reusable prompts are not about forcing every generator to behave the same. They are about preserving intent, structure, and editability across workflows.",
        ],
      },
    ],
  },
  {
    slug: "complete-guide-ai-image-prompt-structures",
    title: "The Complete Guide to AI Image Prompt Structures",
    description: "A complete introduction to AI image prompt structures, from raw prompts to reusable open templates with slots and controls.",
    publishedAt: "2026-06-19",
    readMinutes: 8,
    keywords: ["AI image prompt structures", "prompt engineering", "image prompt template", "open prompt schema"],
    sections: [
      {
        heading: "Prompt structure is the hidden workflow",
        paragraphs: [
          "Every image prompt has a structure, even if it looks like a single paragraph. It names a subject, implies a composition, sets a style, describes lighting, and adds constraints. The question is whether that structure is clear enough to reuse.",
          "Raw prompts are useful for exploration. Structured prompts are useful for repeatable work. Open Image Templates turns that structure into a portable format with visible prompts, slots, controls, examples, suggested models, creator metadata, and license information.",
        ],
      },
      {
        heading: "The main parts of an image prompt",
        paragraphs: [
          "Most effective image prompts include subject, setting, composition, camera or viewpoint, lighting, style or medium, color palette, material detail, and output intent. The order is less important than clarity. The model needs to know what matters most.",
          "A template adds another layer: which parts should be editable? Subject, product, setting, and mood often become slots. Style, lighting, palette, material, and medium often become controls. The base prompt keeps the composition and quality expectations stable.",
        ],
      },
      {
        heading: "From structure to standard",
        paragraphs: [
          "A standard makes prompt structures easier to share. If every template exposes the same kinds of fields, tools can render forms, compile prompts, show previews, and preserve provenance without custom work for every gallery.",
          "That is the goal of Open Image Templates: make prompt structures open, inspectable, and portable. The human page explains the template. The JSON endpoint lets agents and platforms retrieve it. The visible prompt remains the source of truth.",
        ],
      },
      {
        heading: "What to do next",
        paragraphs: [
          "If you already have prompts that work, turn the best ones into templates. Identify what should stay fixed, expose the details that should change, add examples, and keep the compiled prompt visible. If you are building an image platform, support template JSON URLs so users can bring structured prompts with them.",
          "The future of image prompting is not just better words. It is better structure around the words, so creative work becomes easier to repeat, inspect, and share.",
        ],
      },
    ],
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostBody(post: BlogPost) {
  return post.sections.flatMap((section) => [section.heading, ...section.paragraphs]).join("\n\n");
}
