"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { trackEngagement } from "@/lib/analytics-events";

type TemplateJsonDisclosureProps = {
  json: string;
  templateId: string;
  category: string;
  suggestedModel: string;
};

export function TemplateJsonDisclosure({ json, templateId, category, suggestedModel }: TemplateJsonDisclosureProps) {
  const [open, setOpen] = useState(false);
  const eventProperties = {
    template_id: templateId,
    category,
    suggested_model: suggestedModel,
  };

  function toggleOpen() {
    setOpen((current) => {
      const nextOpen = !current;
      if (nextOpen) {
        trackEngagement("open_template_json", eventProperties);
      }
      return nextOpen;
    });
  }

  return (
    <section className="mt-8 rounded-[8px] border border-black/10 bg-white shadow-sm">
      <button
        type="button"
        onClick={toggleOpen}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span>
          <span className="block text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">Template JSON</span>
          <span className="mt-1 block text-sm text-zinc-600">For developers, agents, and tools that want the portable template schema.</span>
        </span>
        <ChevronDown className={`shrink-0 transition ${open ? "rotate-180" : ""}`} size={20} aria-hidden="true" />
      </button>

      {open ? (
        <div className="border-t border-black/10 p-5">
          <div className="flex justify-end">
            <CopyButton
              value={json}
              label="Copy JSON"
              trackEventName="copy_template_json"
              trackEventProperties={eventProperties}
            />
          </div>
          <pre className="mt-4 max-h-[520px] min-w-0 overflow-auto whitespace-pre-wrap break-words rounded-[8px] bg-zinc-950 p-5 text-sm leading-6 text-zinc-100">
            <code>{json}</code>
          </pre>
        </div>
      ) : null}
    </section>
  );
}
