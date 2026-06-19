import type { MetadataRoute } from "next";
import { getPublishedBlogPosts } from "@/lib/blog";
import { docs } from "@/lib/docs";
import {
  absoluteUrl,
  categoryPath,
  tagPath,
  templateCategories,
  templateJsonPath,
  templateTags,
  templatePath,
} from "@/lib/seo";
import { templates } from "@/lib/templates";

export const revalidate = 3600;

const staticPaths = ["/", "/templates", "/templates.json", "/templates/create", "/schema", "/docs", "/blog", "/rss.xml", "/llms.txt", "/llms-full.txt", "/open-image-template.schema.json"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...staticPaths.map((path) => ({
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
    ...docs.map((doc) => ({
      url: absoluteUrl(`/docs/${doc.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...getPublishedBlogPosts(now).map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...templateCategories.map((category) => ({
      url: absoluteUrl(categoryPath(category)),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...templateTags.map((tag) => ({
      url: absoluteUrl(tagPath(tag)),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.65,
    })),
    ...templates.flatMap((template) => [
      {
        url: absoluteUrl(templatePath(template)),
        lastModified: new Date(template.generatedAt),
        changeFrequency: "monthly" as const,
        priority: 0.9,
      },
      {
        url: absoluteUrl(templateJsonPath(template)),
        lastModified: new Date(template.generatedAt),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      },
    ]),
  ];
}
