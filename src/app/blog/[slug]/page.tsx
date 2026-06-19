import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { formatBlogDate, getBlogPostBody, getBlogPostBySlug, getPublishedBlogPosts, isBlogPostPublished } from "@/lib/blog";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 3600;
export const dynamicParams = true;

export function generateStaticParams() {
  return getPublishedBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post || !isBlogPostPublished(post)) return {};

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
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: ["/twitter-image.png"],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post || !isBlogPostPublished(post)) notFound();

  const pageUrl = absoluteUrl(`/blog/${post.slug}`);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
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
      <Link href="/blog" className="text-sm font-semibold text-zinc-600 hover:text-zinc-950">
        Back to blog
      </Link>
      <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">Open Image Templates Blog</p>
      <h1 className="mt-3 text-5xl font-semibold tracking-tight text-zinc-950">{post.title}</h1>
      <div className="mt-5 flex flex-wrap gap-2 text-sm font-medium text-zinc-500">
        <span>{formatBlogDate(post.publishedAt)}</span>
        <span>{post.readMinutes} minute read</span>
      </div>
      <p className="mt-6 text-xl leading-9 text-zinc-600">{post.description}</p>
      <article className="mt-10 space-y-8">
        {post.sections.map((section) => (
          <section key={section.heading} className="rounded-[8px] border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">{section.heading}</h2>
            <div className="mt-4 space-y-4">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-base leading-8 text-zinc-600">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </article>
      <div className="mt-10 rounded-[8px] border border-black/10 bg-zinc-50 p-6">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-950">Try the open template workflow</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Browse visible prompts, adjust template slots, copy the final prompt, or fetch the portable JSON endpoint for your own tools.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/templates" className="inline-flex h-11 items-center rounded-full bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800">
            Browse templates
          </Link>
          <Link href="/schema" className="inline-flex h-11 items-center rounded-full border border-black/10 bg-white px-4 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-50">
            Read the schema
          </Link>
        </div>
      </div>
    </main>
  );
}
