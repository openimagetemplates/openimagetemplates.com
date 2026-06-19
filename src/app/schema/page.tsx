import type { Metadata } from "next";
import { CopyButton } from "@/components/CopyButton";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";
import { TEMPLATE_SCHEMA_VERSION, toPortableTemplateJson, templates } from "@/lib/templates";

const exampleJson = JSON.stringify(toPortableTemplateJson(templates[0]), null, 2);

export const metadata: Metadata = {
  title: "Open Image Template Schema",
  description:
    "The public JSON schema for Open Image Templates: visible prompts, editable slots, prompt-builder controls, examples, provenance, and license metadata.",
  alternates: {
    canonical: "/schema",
  },
};

export default function SchemaPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: "Open Image Template Schema",
          description:
            "A portable JSON format for reusable AI image generation templates with visible prompts, editable slots, controls, examples, provenance, suggested models, and license metadata.",
          url: absoluteUrl("/schema"),
          isPartOf: {
            "@type": "WebSite",
            name: SITE_NAME,
            url: absoluteUrl("/"),
          },
        }}
      />
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">Open standard</p>
      <h1 className="mt-4 text-5xl font-semibold tracking-tight text-zinc-950">Open Image Template Schema</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600">
        Version {TEMPLATE_SCHEMA_VERSION} defines a portable JSON format for reusable AI image generation templates:
        a visible prompt, editable slots, prompt-builder controls, suggested models, examples, provenance, and license metadata.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href="/open-image-template.schema.json"
          className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          View raw JSON schema
        </a>
        <a
          href="/open-image-template.schema.json"
          download
          className="inline-flex h-12 items-center justify-center rounded-full border border-black/10 bg-white px-5 text-sm font-semibold text-zinc-950 shadow-sm transition hover:bg-zinc-50"
        >
          Download schema
        </a>
        <a
          href="https://github.com/openimagetemplates"
          className="inline-flex h-12 items-center justify-center rounded-full border border-black/10 bg-white px-5 text-sm font-semibold text-zinc-950 shadow-sm transition hover:bg-zinc-50"
          target="_blank"
          rel="noreferrer"
        >
          View on GitHub
        </a>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          ["Visible prompt", "No hidden marketplace prompt. The generation recipe is readable and copyable."],
          ["Prompt builder", "Slots, look controls, extra details, and toggles make the template usable without editing JSON."],
          ["Portable examples", "Example images include date and schema version for provenance."],
        ].map(([title, text]) => (
          <div key={title} className="rounded-[8px] border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-zinc-950">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{text}</p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Example template JSON</h2>
          <CopyButton value={exampleJson} label="Copy example" />
        </div>
        <pre className="mt-4 overflow-auto rounded-[8px] border border-black/10 bg-zinc-950 p-5 text-sm leading-6 text-zinc-100">
          <code>{exampleJson}</code>
        </pre>
      </section>

      <section className="mt-10 rounded-[8px] border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Open source schema</h2>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          The schema is intended to live as an open standard. The public GitHub organization is available at{" "}
          <a href="https://github.com/openimagetemplates" className="font-semibold text-zinc-950 underline" target="_blank" rel="noreferrer">
            github.com/openimagetemplates
          </a>
          , and every template page links to a machine-readable JSON endpoint.
        </p>
      </section>

      <section className="mt-10 rounded-[8px] border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Required fields</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            "standard",
            "schema_version",
            "id",
            "title",
            "description",
            "prompt",
            "slots",
            "controls",
            "suggested_models",
            "examples",
            "license",
          ].map((field) => (
            <code key={field} className="rounded-[8px] bg-zinc-100 px-3 py-2 text-sm text-zinc-800">
              {field}
            </code>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        {[
          [
            "What is a template?",
            "A template is a reusable image generation recipe: a visible prompt plus structured metadata that explains how to customize and reuse it.",
          ],
          [
            "What are slots?",
            "Slots are the main movable parts of the prompt. Each slot has a stable name, a human label, and an example value.",
          ],
          [
            "How controls compile",
            "Controls add optional style, palette, lighting, photography, material, medium, extra detail, and toggle instructions to the prompt-builder output.",
          ],
          [
            "How examples work",
            "Example images include the image URL, generated date, and schema version so a gallery or agent can understand provenance.",
          ],
          [
            "How to implement it",
            "Render slots as inputs, look controls as selectable tiles, details as a text area, and toggles as on/off choices. Keep the full prompt visible in HTML.",
          ],
          [
            "How agents retrieve it",
            "Every template can expose /templates/{id}.json with the same data shown on the human page, including prompt, controls, examples, and license.",
          ],
        ].map(([title, text]) => (
          <div key={title} className="rounded-[8px] border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold tracking-tight text-zinc-950">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{text}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
