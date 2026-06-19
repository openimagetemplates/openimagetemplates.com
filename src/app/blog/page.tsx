import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { TemplatePreviewImage } from "@/components/TemplatePreviewImage";
import { formatBlogDate, getBlogPostTemplates, getPublishedBlogPosts } from "@/lib/blog";
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Blog",
  description: "Guides, visual examples, comparisons, and practical workflows for AI image prompt templates and the Open Image Template standard.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Open Image Templates Blog",
    description: "Visual guides, examples, and practical workflows for AI image prompt templates and reusable prompt structures.",
    url: absoluteUrl("/blog"),
    siteName: SITE_NAME,
    type: "website",
  },
};

export const revalidate = 3600;

export default function BlogIndexPage() {
  const publishedPosts = getPublishedBlogPosts();
  const featured = publishedPosts[0];
  const rest = publishedPosts.slice(1);
  const featuredTemplates = featured ? getBlogPostTemplates(featured, 3) : [];

  return (
    <main className="bg-[#f5f3ef]">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Open Image Templates Blog",
          description: SITE_DESCRIPTION,
          url: absoluteUrl("/blog"),
          isPartOf: {
            "@type": "WebSite",
            name: SITE_NAME,
            url: absoluteUrl("/"),
          },
          blogPost: publishedPosts.map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            url: absoluteUrl(`/blog/${post.slug}`),
            datePublished: post.publishedAt,
            image: getBlogPostTemplates(post, 1)[0]?.image,
          })),
        }}
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-600">Blog</p>
        <h1 className="mt-4 max-w-5xl text-5xl font-semibold tracking-tight text-zinc-950 sm:text-6xl">
          Prompt templates, visual examples, and reusable AI image workflows
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600">
          Practical notes with real template examples: comparisons, checklists, prompt snippets, image-generation workflows, and open schema guides.
        </p>

        {featured ? (
          <Link href={`/blog/${featured.slug}`} className="group mt-12 grid overflow-hidden rounded-[8px] border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                <span>Featured</span>
                <span>{formatBlogDate(featured.publishedAt)}</span>
                <span>{featured.readMinutes} min read</span>
              </div>
              <h2 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-950 group-hover:underline sm:text-5xl">{featured.title}</h2>
              <p className="mt-5 text-lg leading-8 text-zinc-600">{featured.description}</p>
              <div className="mt-8 inline-flex h-12 items-center rounded-full bg-zinc-950 px-5 text-sm font-semibold text-white">
                Read the guide
              </div>
            </div>
            <div className="grid min-h-[360px] grid-cols-2 gap-3 bg-zinc-950 p-3">
              {featuredTemplates.map((template, index) => (
                <div key={template.id} className={index === 0 ? "col-span-2 overflow-hidden rounded-[8px] bg-zinc-100" : "overflow-hidden rounded-[8px] bg-zinc-100"}>
                  <TemplatePreviewImage src={template.image} alt={template.imageAlt} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
                </div>
              ))}
            </div>
          </Link>
        ) : null}

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {rest.map((post) => {
            const template = getBlogPostTemplates(post, 1)[0];
            return (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group overflow-hidden rounded-[8px] border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="aspect-[16/10] overflow-hidden bg-zinc-100">
                  <TemplatePreviewImage src={template?.image} alt={template?.imageAlt ?? post.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                    <span>{formatBlogDate(post.publishedAt)}</span>
                    <span>{post.readMinutes} min read</span>
                  </div>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950 group-hover:underline">{post.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{post.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.keywords.slice(0, 2).map((keyword) => (
                      <span key={keyword} className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">{keyword}</span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
