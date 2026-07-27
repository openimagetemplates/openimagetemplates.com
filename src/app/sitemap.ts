import type { MetadataRoute } from "next";
import { getPublishedBlogPosts } from "@/lib/blog";
import { docs } from "@/lib/docs";
import {
  absoluteUrl,
  categoryPath,
  getTemplatesByTag,
  MIN_INDEXABLE_TAG_TEMPLATES,
  tagPath,
  templateCategories,
  templateTags,
  templatePath,
} from "@/lib/seo";
import { TEMPLATE_CATALOG_GENERATED_AT, templates } from "@/lib/templates";
import { useCases } from "@/lib/use-cases";

export const revalidate = 3600;

const staticPaths = ["/", "/templates", "/templates/create", "/use-cases", "/schema", "/license", "/docs", "/blog"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const catalogModified = new Date(TEMPLATE_CATALOG_GENERATED_AT);

  return [
    ...staticPaths.map((path) => ({
      url: absoluteUrl(path),
      ...(path === "/" || path === "/templates" || path === "/use-cases"
        ? { lastModified: catalogModified }
        : {}),
    })),
    ...docs.map((doc) => ({
      url: absoluteUrl(`/docs/${doc.slug}`),
    })),
    ...getPublishedBlogPosts(now).map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.publishedAt),
    })),
    ...templateCategories.map((category) => ({
      url: absoluteUrl(categoryPath(category)),
      lastModified: catalogModified,
    })),
    ...templateTags.filter((tag) => getTemplatesByTag(tag).length >= MIN_INDEXABLE_TAG_TEMPLATES).map((tag) => ({
      url: absoluteUrl(tagPath(tag)),
      lastModified: catalogModified,
    })),
    ...useCases.map((useCase) => ({
      url: absoluteUrl(`/use-cases/${useCase.slug}`),
      lastModified: catalogModified,
    })),
    ...templates.map((template) => ({
      url: absoluteUrl(templatePath(template)),
      lastModified: new Date(template.generatedAt),
    })),
  ];
}
