import type { ImageTemplate, TemplateCategory } from "@/lib/templates";
import { categories, templates } from "@/lib/templates";

export const SITE_URL = "https://openimagetemplates.com";
export const SITE_NAME = "Open Image Templates";
export const SITE_DESCRIPTION = "A free, open standard and community gallery for reusable AI image generation templates.";

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function categorySlug(category: TemplateCategory) {
  return slugify(category);
}

export function tagSlug(tag: string) {
  return slugify(tag);
}

export function templatePath(template: ImageTemplate) {
  return `/templates/${template.id}`;
}

export function templateUrl(template: ImageTemplate) {
  return absoluteUrl(templatePath(template));
}

export function templateJsonPath(template: ImageTemplate) {
  return `/templates/${template.id}.json`;
}

export function templateJsonUrl(template: ImageTemplate) {
  return absoluteUrl(templateJsonPath(template));
}

export function categoryPath(category: TemplateCategory) {
  return `/categories/${categorySlug(category)}`;
}

export function tagPath(tag: string) {
  return `/tags/${tagSlug(tag)}`;
}

export const templateCategories = categories.filter((category): category is TemplateCategory => category !== "All");

export const templateTags = uniqueBySlug(Array.from(new Set(templates.flatMap((template) => template.tags)))).sort((a, b) => a.localeCompare(b));

export function getCategoryBySlug(slug: string) {
  return templateCategories.find((category) => categorySlug(category) === slug);
}

export function getTagBySlug(slug: string) {
  return templateTags.find((tag) => tagSlug(tag) === slug);
}

export function getTemplatesByCategory(category: TemplateCategory) {
  return templates.filter((template) => template.category === category);
}

export function getTemplatesByTag(tag: string) {
  return templates.filter((template) => template.tags.includes(tag));
}

export function getRelatedTemplates(template: ImageTemplate, limit = 6) {
  const scored = templates
    .filter((candidate) => candidate.id !== template.id)
    .map((candidate) => {
      const sharedTags = candidate.tags.filter((tag) => template.tags.includes(tag)).length;
      const categoryScore = candidate.category === template.category ? 3 : 0;
      const modelScore = candidate.suggestedModel === template.suggestedModel ? 1 : 0;
      return {
        template: candidate,
        score: sharedTags * 4 + categoryScore + modelScore,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.template.title.localeCompare(b.template.title))
    .map((item) => item.template);

  if (scored.length >= limit) {
    return scored.slice(0, limit);
  }

  const fallback = templates.filter((candidate) => candidate.id !== template.id && !scored.some((item) => item.id === candidate.id));
  return [...scored, ...fallback].slice(0, limit);
}

export function safeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function uniqueBySlug(values: string[]) {
  const seen = new Set<string>();
  return values.filter((value) => {
    const slug = tagSlug(value);
    if (seen.has(slug)) return false;
    seen.add(slug);
    return true;
  });
}
