"use client";

import { trackEngagement } from "./analytics-events";
import { normalizeOitApiUrl } from "./oit-api-url";

type SearchEventInput = {
  query: string;
  source: "homepage" | "gallery";
  category?: string;
  resultCount?: number;
};

const apiUrl = normalizeOitApiUrl(process.env.NEXT_PUBLIC_OIT_API_URL);

export function trackTemplateSearch(input: SearchEventInput) {
  const query = input.query.trim();
  if (query.length < 2) return;

  trackEngagement("search_templates", {
    query,
    source: input.source,
    category: input.category ?? "All",
    result_count: input.resultCount ?? 0,
  });

  if (!apiUrl) return;

  const payload = JSON.stringify({
    query,
    source: input.source,
    category: input.category ?? "All",
    resultCount: input.resultCount ?? 0,
    route: typeof window === "undefined" ? "/" : `${window.location.pathname}${window.location.search}`,
  });

  void fetch(`${apiUrl}/api/events/search`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {
    // Search analytics should never interrupt template browsing.
  });
}
