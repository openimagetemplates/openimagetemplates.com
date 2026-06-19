import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { blogPosts } from "@/lib/blog";
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Blog",
  description: "Guides, research notes, and practical workflows for AI image prompt templates and the Open Image Template standard.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Open Image Templates Blog",
    description: "Guides, research notes, and practical workflows for AI image prompt templates and reusable prompt structures.",
    url: absoluteUrl("/blog"),
    siteName: SITE_NAME,
    type: "website",
  },
};

export default function BlogIndexPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
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
          blogPost: blogPosts.map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            url: absoluteUrl(`/blog/${post.slug}`),
            datePublished: post.publishedAt,
          })),
        }}
      />
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">Blog</p>
      <h1 className="mt-4 text-5xl font-semibold tracking-tight text-zinc-950">Prompt templates, structure, and reusable AI image workflows</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600">
        Practical notes on building, reusing, and sharing AI image prompts as open templates with visible prompts and portable JSON.
      </p>
      <div className="mt-10 grid gap-4">
        {blogPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="rounded-[8px] border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
              <span>{post.publishedAt}</span>
              <span>{post.readMinutes} min read</span>
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">{post.title}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{post.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
