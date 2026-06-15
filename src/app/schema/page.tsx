import { CopyButton } from "@/components/CopyButton";
import { TEMPLATE_SCHEMA_VERSION, toPortableTemplateJson, templates } from "@/lib/templates";

const exampleJson = JSON.stringify(toPortableTemplateJson(templates[0]), null, 2);

export default function SchemaPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">Open standard</p>
      <h1 className="mt-4 text-5xl font-semibold tracking-tight text-zinc-950">Open Image Template Schema</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600">
        Version {TEMPLATE_SCHEMA_VERSION} defines a portable JSON format for reusable AI image generation templates:
        a visible prompt, editable slots, suggested models, examples, provenance, and license metadata.
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
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          ["Visible prompt", "No hidden marketplace prompt. The generation recipe is readable and copyable."],
          ["Editable slots", "Variables describe the parts a user is expected to change."],
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
    </main>
  );
}
