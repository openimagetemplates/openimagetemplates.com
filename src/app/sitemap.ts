import type { MetadataRoute } from "next";
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

const staticPaths = ["/", "/templates", "/templates.json", "/templates/create", "/schema", "/docs", "/llms.txt", "/llms-full.txt", "/open-image-template.schema.json"];

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
