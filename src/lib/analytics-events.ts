"use client";

import { track } from "@vercel/analytics";
import type { ImageTemplate } from "@/lib/templates";

export type AnalyticsValue = string | number | boolean | null;
export type AnalyticsProperties = Record<string, AnalyticsValue>;

function currentRoute() {
  if (typeof window === "undefined") return "/";
  return `${window.location.pathname}${window.location.search}`;
}

export function trackEngagement(name: string, properties: AnalyticsProperties = {}) {
  try {
    track(name, {
      route: currentRoute(),
      ...properties,
    });
  } catch {
    // Analytics should never interrupt template browsing or creation.
  }
}

export function templateEventProperties(template: Pick<ImageTemplate, "id" | "category" | "suggestedModel">): AnalyticsProperties {
  return {
    template_id: template.id,
    category: template.category,
    suggested_model: template.suggestedModel,
  };
}
