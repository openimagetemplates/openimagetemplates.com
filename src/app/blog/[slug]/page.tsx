import { ArrowUpRight, Check, Copy, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { TemplatePreviewImage } from "@/components/TemplatePreviewImage";
import {
  formatBlogDate,
  getBlogPostBody,
  getBlogPostBySlug,
  getBlogPostChecklist,
  getBlogPostSnippet,
  getBlogPostTemplates,
  getPublishedBlogPosts,
  isBlogPostPublished,
} from "@/lib/blog";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

// Keep blog publishing automatic while scheduled posts stay hidden until their date.
export const revalidate = 3600;
export const dynamicParams = true;

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPublishedBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post || !isBlogPostPublished(post)) return {};

  const heroTemplate = getBlogPostTemplates(post, 1)[0];

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: absoluteUrl(`/blog/${post.slug}`),
      siteName: SITE_NAME,
      type: "article",
      publishedTime: post.publishedAt,
      images: heroTemplate
        ? [
            {
              url: heroTemplate.image,
              alt: heroTemplate.imageAlt,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [heroTemplate?.image ?? "/twitter-image.png"],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post || !isBlogPostPublished(post)) notFound();

  const pageUrl = absoluteUrl(`/blog/${post.slug}`);
  const exampleTemplates = getBlogPostTemplates(post, 4);
  const heroTemplate = exampleTemplates[0];
  const checklist = getBlogPostChecklist(post);
  const snippet = getBlogPostSnippet(post);

  return (
    <main className="bg-[#f5f3ef]">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.publishedAt,
          dateModified: post.publishedAt,
          url: pageUrl,
          mainEntityOfPage: pageUrl,
          articleBody: getBlogPostBody(post),
          keywords: post.keywords.join(", "),
          image: heroTemplate?.image,
          author: {
            "@type": "Organization",
            name: SITE_NAME,
            url: absoluteUrl("/"),
          },
          publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            url: absoluteUrl("/"),
          },
          isPartOf: {
            "@type": "Blog",
            name: "Open Image Templates Blog",
            url: absoluteUrl("/blog"),
          },
        }}
      />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Link href="/blog" className="text-sm font-semibold text-zinc-600 hover:text-zinc-950">
          Back to blog
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">Open Image Templates Blog</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight text-zinc-950 sm:text-6xl">{post.title}</h1>
            <div className="mt-5 flex flex-wrap gap-2 text-sm font-medium text-zinc-500">
              <span>{formatBlogDate(post.publishedAt)}</span>
              <span>{post.readMinutes} minute read</span>
            </div>
            <p className="mt-6 max-w-2xl text-xl leading-9 text-zinc-600">{post.description}</p>
          </div>

          {heroTemplate ? (
            <Link href={`/templates/${heroTemplate.id}`} className="group block overflow-hidden rounded-[8px] border border-black/10 bg-white p-3 shadow-sm">
              <div className="aspect-[4/3] overflow-hidden rounded-[8px] bg-zinc-100">
                <TemplatePreviewImage
                  src={heroTemplate.image}
                  alt={heroTemplate.imageAlt}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex items-center justify-between gap-3 px-1 py-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Featured template</p>
                  <p className="mt-1 text-lg font-semibold text-zinc-950">{heroTemplate.title}</p>
                </div>
                <ArrowUpRight size={18} aria-hidden="true" />
              </div>
            </Link>
          ) : null}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        {exampleTemplates.map((template, index) => (
          <Link key={template.id} href={`/templates/${template.id}`} className="group overflow-hidden rounded-[8px] border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="aspect-[4/3] overflow-hidden bg-zinc-100">
              <TemplatePreviewImage src={template.image} alt={template.imageAlt} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
            </div>
            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Example {index + 1}</p>
              <h2 className="mt-1 text-base font-semibold tracking-tight text-zinc-950 group-hover:underline">{template.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm leading-5 text-zinc-600">{template.description}</p>
            </div>
          </Link>
        ))}
      </section>

      <article className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
        <div className="space-y-8">
          <section className="rounded-[8px] border border-black/10 bg-zinc-950 p-6 text-white shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-white/60">
              <Copy size={16} aria-hidden="true" />
              Prompt snippet
            </div>
            <p className="mt-5 text-xl leading-9 text-white">{snippet}</p>
          </section>

          {post.sections.map((section, index) => (
            <section
              key={section.heading}
              className={index % 2 === 0 ? "rounded-[8px] border border-black/10 bg-white p-6 shadow-sm" : "rounded-[8px] border border-black/10 bg-[#e4fbf6] p-6 shadow-sm"}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">0{index + 1}</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">{section.heading}</h2>
              <div className="mt-5 space-y-4">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-8 text-zinc-600">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <section className="rounded-[8px] border border-black/10 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-zinc-950">
              <Sparkles size={18} aria-hidden="true" />
              <h2 className="text-lg font-semibold tracking-tight">Use this as a checklist</h2>
            </div>
            <div className="mt-4 space-y-3">
              {checklist.map((item) => (
                <div key={item} className="flex gap-3 text-sm leading-6 text-zinc-600">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-zinc-950 text-white">
                    <Check size={12} strokeWidth={3} aria-hidden="true" />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[8px] border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-950">Try the open workflow</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Browse visible prompts, adjust template slots, copy the final prompt, or fetch the portable JSON endpoint for your own tools.
            </p>
            <div className="mt-4 grid gap-2">
              <Link href="/templates" className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800">
                Browse templates
              </Link>
              <Link href="/schema" className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 bg-white px-4 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-50">
                Read the schema
              </Link>
            </div>
          </section>
        </aside>
      </article>
    </main>
  );
}
