export type DocPage = {
  slug: string;
  title: string;
  description: string;
  sections: Array<{
    heading: string;
    body: string;
  }>;
};

export const docs: DocPage[] = [
  {
    slug: "what-is-an-open-image-template",
    title: "What is an Open Image Template?",
    description: "A plain-language introduction to reusable, visible, portable AI image prompt templates.",
    sections: [
      {
        heading: "Definition",
        body: "An Open Image Template is a reusable image generation recipe. It combines a visible prompt, editable slots, optional look controls, example images, provenance, and license metadata in a portable JSON format.",
      },
      {
        heading: "Why it exists",
        body: "Most prompt galleries show an image and hide the actual recipe. Open Image Templates are designed to be readable by humans, copyable into any generator, and retrievable by AI agents without private APIs.",
      },
      {
        heading: "What makes it open",
        body: "The prompt is visible, the schema is public, each template has a stable URL, and every public template can expose a matching .json endpoint for tools and search systems.",
      },
    ],
  },
  {
    slug: "template-schema",
    title: "Open Image Template Schema",
    description: "How the schema represents prompts, slots, controls, examples, provenance, suggested models, and licensing.",
    sections: [
      {
        heading: "Core fields",
        body: "Each template includes a standard identifier, schema version, id, title, description, category, visible prompt, negative prompt, slots, controls, suggested models, examples, creator, and license.",
      },
      {
        heading: "Slots",
        body: "Slots are the main editable variables in a template. A slot has a stable name, a user-facing label, and an example value. For example, a portrait template might expose Subject, Lighting, and Background.",
      },
      {
        heading: "Controls",
        body: "Controls describe optional prompt-builder choices such as style, color palette, lighting, photography style, material, medium, extra details, and toggles like props or branding space.",
      },
      {
        heading: "Examples and provenance",
        body: "Examples connect a preview image to a generation date and schema version. This makes it easier to track which schema produced the visible example.",
      },
    ],
  },
  {
    slug: "how-to-use-templates",
    title: "How to Use Open Image Templates",
    description: "How creators and AI image users can copy, customize, and generate from an image template.",
    sections: [
      {
        heading: "Start from the visible prompt",
        body: "Every template page includes the full prompt in plain HTML. You can copy it directly into any AI image generator.",
      },
      {
        heading: "Adjust the template",
        body: "Use the prompt builder to change slots like subject, setting, mood, lighting, or product, then add optional style and look controls.",
      },
      {
        heading: "Use the JSON endpoint",
        body: "Agents and tools can fetch /templates/{id}.json to retrieve the full portable representation, including controls and example metadata.",
      },
    ],
  },
  {
    slug: "build-a-template-gallery",
    title: "Build a Template Gallery with Open Image Templates",
    description: "Implementation notes for developers building their own prompt-template galleries or generator integrations.",
    sections: [
      {
        heading: "Use stable URLs",
        body: "Give every template a human page and a matching JSON endpoint. Human pages should be crawlable and include the visible prompt; JSON endpoints should expose the portable schema.",
      },
      {
        heading: "Render controls from schema",
        body: "Build UI from the controls object instead of hardcoding a form. Slots become text inputs, look groups become tiles or choices, details become a text area, and toggles become selectable options.",
      },
      {
        heading: "Keep metadata close to the template",
        body: "Category, tags, preview image, generated date, schema version, creator, and license should live with the template so search pages, feeds, sitemaps, and JSON-LD can all stay consistent.",
      },
    ],
  },
  {
    slug: "integration-guide-for-image-platforms",
    title: "Integration Guide for AI Image Platforms",
    description: "How image generation platforms can support Open Image Templates while keeping prompts portable and generator-neutral.",
    sections: [
      {
        heading: "Integration goal",
        body: "An image platform should be able to import an Open Image Template URL, render the editable fields, compile a visible prompt, and generate an image without requiring hidden prompt text or a NanoGPT-specific account.",
      },
      {
        heading: "Template discovery",
        body: "Support both human pages and JSON endpoints. If a user pastes /templates/{id}, look for the linked /templates/{id}.json endpoint. If a user pastes /templates/{id}.json directly, fetch and validate the JSON document against the public schema.",
      },
      {
        heading: "Rendering the form",
        body: "Render slots as editable text fields, look controls as optional choices or visual tiles, details as a freeform text area, and toggles as checkboxes or segmented controls. Do not hardcode Open Image Templates from this site; render from the schema so third-party templates work too.",
      },
      {
        heading: "Compiling the prompt",
        body: "Treat user-edited slot values and selected controls as authoritative additions to the visible prompt. The final prompt should be inspectable before generation, and users should be able to copy it into another generator.",
      },
      {
        heading: "Model compatibility",
        body: "The suggested_models field is a recommendation, not a lock-in. If your platform does not offer the suggested model, choose the closest compatible image model and keep the template prompt visible so users understand what changed.",
      },
      {
        heading: "Generation flow",
        body: "A compatible platform can offer an Import Template button, a Use Template button, or a paste-URL flow. After generation, keep the template id, schema version, selected controls, generated date, and model metadata with the output so provenance stays intact.",
      },
      {
        heading: "Attribution and openness",
        body: "Show creator and license metadata when available. If you publish generated examples or derivative templates, preserve the source template URL, schema version, and visible prompt. Do not market hidden prompt layers as Open Image Templates.",
      },
      {
        heading: "Minimum compatible implementation",
        body: "At minimum, a platform should accept a template JSON URL, validate standard and schema_version, render slots, compile a visible prompt, generate with one image model, and show a link back to the original template.",
      },
    ],
  },
  {
    slug: "open-image-template-vs-prompts",
    title: "Open Image Template vs. a Prompt",
    description: "The difference between a raw prompt and a reusable open image template.",
    sections: [
      {
        heading: "A prompt is one instruction",
        body: "A prompt is usually a single block of text written for one image generation. It can work well, but it is hard to adapt and hard for tools to understand.",
      },
      {
        heading: "A template is reusable structure",
        body: "A template keeps the full prompt but adds editable slots, controls, example metadata, suggested model information, licensing, and a stable JSON representation.",
      },
      {
        heading: "Why AI search benefits",
        body: "AI search systems can retrieve a template page for humans or fetch the JSON endpoint for structured fields. That makes the template easier to cite, compare, and reuse.",
      },
    ],
  },
];

export function getDocBySlug(slug: string) {
  return docs.find((doc) => doc.slug === slug);
}
