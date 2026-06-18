import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TemplateCreator } from "@/components/TemplateCreator";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Create Image Template",
  description: "Create an open image template from scratch or generate a structured draft from an image or idea.",
  alternates: {
    canonical: "/templates/create",
  },
  openGraph: {
    title: "Create Image Template",
    description: "Create an open image template from scratch or generate a structured draft from an image or idea.",
    url: absoluteUrl("/templates/create"),
    siteName: SITE_NAME,
    type: "website",
  },
};

export default function CreateTemplatePage() {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <Link href="/templates" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-zinc-950">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to templates
        </Link>
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">Create</p>
        <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-tight text-zinc-950 sm:text-6xl">
          Create an image template
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600">
          Start from blank fields, upload a reference image, or describe an idea and let AI fill the template structure
          for you to review.
        </p>

        <TemplateCreator mode="inline" />
      </section>
    </main>
  );
}
