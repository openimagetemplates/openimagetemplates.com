import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { TemplateCollectionGrid } from "@/components/TemplateCollectionGrid";
import { absoluteUrl, getTagBySlug, getTemplatesByTag, SITE_NAME, tagPath, tagSlug, templateTags, templateUrl } from "@/lib/seo";

type TagPageProps = {
  params: Promise<{ tag: string }>;
};

export function generateStaticParams() {
  return templateTags.map((tag) => ({ tag: tagSlug(tag) }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag: slug } = await params;
  const tag = getTagBySlug(slug);
  if (!tag) return {};

  const taggedTemplates = getTemplatesByTag(tag);
  const isThinTag = taggedTemplates.length < 2;
  const title = `${tag} AI Image Templates`;
  const description = `Browse ${taggedTemplates.length} open, copyable AI image templates tagged ${tag}, with visible prompts, preview images, and portable JSON schema.`;

  return {
    title,
    description,
    keywords: [`${tag} AI image templates`, `${tag} prompt templates`, "AI image prompt templates", "Open Image Templates"],
    robots: isThinTag ? { index: false, follow: true } : undefined,
    alternates: {
      canonical: tagPath(tag),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(tagPath(tag)),
      siteName: SITE_NAME,
      type: "website",
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag: slug } = await params;
  const tag = getTagBySlug(slug);
  if (!tag) notFound();

  const taggedTemplates = getTemplatesByTag(tag);
  const pageUrl = absoluteUrl(tagPath(tag));

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${tag} AI Image Templates`,
          description: `Open Image Templates tagged ${tag}.`,
          url: pageUrl,
          isPartOf: {
            "@type": "WebSite",
            name: SITE_NAME,
            url: absoluteUrl("/"),
          },
          mainEntity: {
            "@type": "ItemList",
            itemListElement: taggedTemplates.map((template, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: templateUrl(template),
              name: template.title,
            })),
          },
        }}
      />
      <Link href="/templates" className="text-sm font-semibold text-zinc-600 hover:text-zinc-950">
        Back to all templates
      </Link>
      <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">Tag</p>
      <h1 className="mt-3 text-5xl font-semibold tracking-tight text-zinc-950">{tag} AI Image Templates</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600">
        Explore {taggedTemplates.length} templates tagged {tag}. Each page exposes the full prompt, prompt-builder controls,
        template provenance, related templates, and a `.json` endpoint for agents and tools.
      </p>
      <div className="mt-10">
        <TemplateCollectionGrid templates={taggedTemplates} />
      </div>
    </main>
  );
}
