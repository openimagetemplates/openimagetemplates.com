"use client";

import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { trackTemplateSearch } from "@/lib/search-events";
import { categories, type ImageTemplate, type TemplateCategory } from "@/lib/templates";
import { TemplateCard } from "./TemplateCard";

type GalleryExplorerProps = {
  templates: ImageTemplate[];
  loadingMode?: "collapsed" | "infinite";
};

const INITIAL_VISIBLE_TEMPLATES = 36;
const VISIBLE_TEMPLATE_BATCH = 24;

export function GalleryExplorer({ templates, loadingMode = "collapsed" }: GalleryExplorerProps) {
  const [category, setCategory] = useState<"All" | TemplateCategory>("All");
  const [isExpanded, setIsExpanded] = useState(false);
  const [pagination, setPagination] = useState({ key: "", count: INITIAL_VISIBLE_TEMPLATES });
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("q") ?? "";
  });

  useEffect(() => {
    function handleGallerySearch(event: Event) {
      const detail = (event as CustomEvent<{ query?: string }>).detail;
      setCategory("All");
      setQuery(detail?.query ?? "");
    }

    window.addEventListener("oit-gallery-search", handleGallerySearch);
    return () => window.removeEventListener("oit-gallery-search", handleGallerySearch);
  }, []);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return templates.filter((template) => {
      const categoryMatches = category === "All" || template.category === category;
      const queryMatches =
        !normalizedQuery ||
        [
          template.title,
          template.description,
          template.category,
          template.tags.join(" "),
          template.prompt,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return categoryMatches && queryMatches;
    });
  }, [category, query, templates]);

  const isInfinite = loadingMode === "infinite";
  const paginationKey = `${category}:${query.trim().toLowerCase()}:${templates.length}`;
  const visibleCount = pagination.key === paginationKey ? pagination.count : INITIAL_VISIBLE_TEMPLATES;
  const visibleTemplates = isInfinite ? filtered.slice(0, visibleCount) : filtered;
  const hasMore = isInfinite && visibleTemplates.length < filtered.length;
  const shouldCollapse = filtered.length > 16;

  useEffect(() => {
    if (!isInfinite || !hasMore) return;
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setPagination((current) => ({
          key: paginationKey,
          count: Math.min((current.key === paginationKey ? current.count : INITIAL_VISIBLE_TEMPLATES) + VISIBLE_TEMPLATE_BATCH, filtered.length),
        }));
      },
      { rootMargin: "900px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [filtered.length, hasMore, isInfinite, paginationKey]);

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) return;

    const timeout = window.setTimeout(() => {
      trackTemplateSearch({
        query: trimmedQuery,
        source: "gallery",
        category,
        resultCount: filtered.length,
      });
    }, 700);

    return () => window.clearTimeout(timeout);
  }, [category, filtered.length, query]);

  return (
    <section id="gallery" className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 border-t border-black/10 pt-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Community gallery
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
            Copy the full prompt. Change the slots. Use any generator.
          </h2>
        </div>
        <label className="relative w-full lg:w-[360px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} aria-hidden="true" />
          <span className="sr-only">Search templates</span>
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsExpanded(false);
            }}
            placeholder={`Search ${templates.length} templates`}
            className="h-12 w-full rounded-full border border-black/10 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-zinc-500 focus:ring-4 focus:ring-zinc-200"
          />
        </label>
      </div>
      <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setCategory(item);
              setIsExpanded(false);
              trackTemplateSearch({
                query: query || item,
                source: "gallery",
                category: item,
                resultCount: item === "All" ? templates.length : templates.filter((template) => template.category === item).length,
              });
            }}
            className={`h-10 whitespace-nowrap rounded-full px-4 text-sm font-medium transition ${
              category === item
                ? "bg-zinc-950 text-white"
                : "border border-black/10 bg-white text-zinc-700 hover:border-black/20"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      {isInfinite ? (
        <p className="mb-4 text-sm font-medium text-zinc-500">
          Showing {visibleTemplates.length} of {filtered.length} matching templates
        </p>
      ) : null}
      <div className="relative">
        <div
          className={
            isInfinite
              ? "grid grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : `columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4 ${
                  shouldCollapse && !isExpanded ? "max-h-[980px] overflow-hidden" : ""
                }`
          }
        >
          {visibleTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>

        {isInfinite ? (
          <div ref={loadMoreRef} className="flex min-h-24 items-center justify-center pt-8">
            {hasMore ? (
              <button
                type="button"
                onClick={() =>
                  setPagination((current) => ({
                    key: paginationKey,
                    count: Math.min((current.key === paginationKey ? current.count : INITIAL_VISIBLE_TEMPLATES) + VISIBLE_TEMPLATE_BATCH, filtered.length),
                  }))
                }
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-5 text-sm font-semibold text-zinc-950 shadow-sm transition hover:border-black/20 hover:bg-zinc-50"
              >
                Load more templates
                <ChevronDown size={17} aria-hidden="true" />
              </button>
            ) : filtered.length > INITIAL_VISIBLE_TEMPLATES ? (
              <p className="text-sm font-medium text-zinc-500">All matching templates loaded</p>
            ) : null}
          </div>
        ) : shouldCollapse ? (
          <div
            className={
              isExpanded
                ? "mt-8 flex justify-center"
                : "pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-white via-white/90 to-transparent pb-6 pt-28"
            }
          >
            <button
              type="button"
              onClick={() => setIsExpanded((current) => !current)}
              className="pointer-events-auto inline-flex h-12 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-5 text-sm font-semibold text-zinc-950 shadow-lg transition hover:border-black/20 hover:bg-zinc-50"
            >
              {isExpanded ? "Show less" : "Show more"}
              {isExpanded ? <ChevronUp size={17} aria-hidden="true" /> : <ChevronDown size={17} aria-hidden="true" />}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
