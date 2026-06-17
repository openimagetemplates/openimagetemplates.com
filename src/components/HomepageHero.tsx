"use client";

/* eslint-disable @next/next/no-img-element */
import { ArrowRight, Braces, Check, ImagePlus, Images, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { trackTemplateSearch } from "@/lib/search-events";
import type { ImageTemplate } from "@/lib/templates";

type HomepageHeroProps = {
  templates: ImageTemplate[];
  templateCount: number;
  schemaVersion: string;
};

const modes = {
  find: {
    label: "Find templates",
    headline: "Start image ideas with",
    accents: [
      "better prompts",
      "fewer retries",
      "proven looks",
      "editable examples",
      "copy-paste recipes",
    ],
    bullets: [
      "Pick a template when a blank prompt is slowing you down",
      "Change the subject, style, lighting, palette, and medium",
      "Copy the finished prompt or generate with NanoGPT",
    ],
    primary: {
      href: "/templates",
      label: "Browse templates",
      icon: Search,
    },
    secondary: {
      href: "/schema",
      label: "View schema",
      icon: Braces,
    },
  },
  create: {
    label: "Create templates",
    headline: "Turn good prompts into",
    accents: [
      "reusable templates",
      "shareable recipes",
      "editable controls",
      "community examples",
      "clean prompt builders",
    ],
    bullets: [
      "Generate a first draft from an image or idea",
      "Turn repeatable details into simple choices for others",
      "Submit your template for review when it is ready",
    ],
    primary: {
      href: "/templates/bold-magazine-close-up",
      label: "Create a template",
      icon: ImagePlus,
    },
    secondary: {
      href: "/docs/integration-guide-for-image-platforms",
      label: "Integration guide",
      icon: Braces,
    },
  },
} as const;

type ModeName = keyof typeof modes;

const popularSearches = ["portrait", "product", "cinematic", "selfie", "logo", "album cover", "packaging", "anime"];

export function HomepageHero({ templates, templateCount, schemaVersion }: HomepageHeroProps) {
  const router = useRouter();
  const [mode, setMode] = useState<ModeName>("find");
  const [accentIndex, setAccentIndex] = useState(0);
  const [templateIndex, setTemplateIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const active = modes[mode];
  const accent = active.accents[accentIndex % active.accents.length];
  const modeTemplateOffset = mode === "find" ? 0 : Math.max(1, Math.floor(templates.length / 3));
  const heroTemplate = templates.length > 0
    ? templates[(templateIndex + modeTemplateOffset) % templates.length]
    : undefined;
  const Icon = active.primary.icon;
  const SecondaryIcon = active.secondary.icon;

  useEffect(() => {
    const interval = window.setInterval(() => {
      setAccentIndex((current) => current + 1);
    }, 4400);

    return () => window.clearInterval(interval);
  }, []);

  function applyGallerySearch(value: string) {
    const query = value.trim();
    const url = new URL("/templates", window.location.origin);
    if (query) {
      url.searchParams.set("q", query);
    }
    router.push(`${url.pathname}${url.search}`);
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formQuery = String(formData.get("query") ?? searchQuery);
    setSearchQuery(formQuery);
    trackTemplateSearch({ query: formQuery, source: "homepage", resultCount: templateCount });
    applyGallerySearch(formQuery);
  }

  function handlePopularSearch(query: string) {
    setSearchQuery(query);
    trackTemplateSearch({ query, source: "homepage", resultCount: templateCount });
    applyGallerySearch(query);
  }

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTemplateIndex((current) => current + 1);
    }, 5200);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="bg-white">
      <div className="mx-auto grid min-h-[680px] w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-20">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit rounded-full bg-zinc-100 p-1">
            {(Object.keys(modes) as ModeName[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setMode(item);
                  setAccentIndex(0);
                  setTemplateIndex(0);
                }}
                className={`h-10 rounded-full px-5 text-sm font-semibold uppercase tracking-[0.04em] transition ${
                  mode === item
                    ? "bg-white text-zinc-950 shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_8px_18px_rgba(0,0,0,0.08)]"
                    : "text-zinc-500 hover:text-zinc-950"
                }`}
              >
                {modes[item].label}
              </button>
            ))}
          </div>

          <h1 className="mt-12 min-h-[3.35em] max-w-3xl pb-2 text-5xl font-semibold leading-[1.08] tracking-tight text-zinc-950 sm:text-6xl lg:text-7xl">
            {active.headline}{" "}
            <span
              key={`${mode}-${accent}`}
              className="oit-hero-accent inline-block bg-gradient-to-r from-[#015a9e] to-[#11e9bb] bg-clip-text pb-[0.08em] text-transparent"
            >
              {accent}
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
            Open Image Templates is a free schema and community gallery for reusable image prompts.
            Copy the full prompt, inspect the JSON, adapt the variables, or generate with NanoGPT in one click.
          </p>

          <ul className="mt-8 space-y-4">
            {active.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3 text-base font-medium text-zinc-800">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#e4fbf6] text-[#018c8f]">
                  <Check size={16} strokeWidth={3} aria-hidden="true" />
                </span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href={active.primary.href}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-zinc-950 px-6 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              <Icon size={18} aria-hidden="true" />
              {active.primary.label}
            </a>
            <Link
              href={active.secondary.href}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-6 text-sm font-semibold text-zinc-950 shadow-sm transition hover:bg-zinc-50"
            >
              <SecondaryIcon size={18} aria-hidden="true" />
              {active.secondary.label}
            </Link>
          </div>

          <div className="mt-12 grid max-w-xl grid-cols-3 gap-3 text-sm text-zinc-600">
            <div className="rounded-[8px] border border-black/10 bg-white p-3 shadow-sm">
              <strong className="block text-xl text-zinc-950">{templateCount}</strong>
              starter templates
            </div>
            <div className="rounded-[8px] border border-black/10 bg-white p-3 shadow-sm">
              <strong className="block text-xl text-zinc-950">{schemaVersion}</strong>
              schema version
            </div>
            <div className="rounded-[8px] border border-black/10 bg-white p-3 shadow-sm">
              <strong className="block text-xl text-zinc-950">0</strong>
              hidden prompts
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="oit-hero-preview-frame relative mx-auto aspect-[16/11] w-full max-w-[38rem] overflow-hidden rounded-[24px] bg-zinc-200 p-4 shadow-[0_28px_80px_rgba(24,24,27,0.16)]">
            <div className="h-full w-full overflow-hidden rounded-[18px] bg-zinc-950">
              {heroTemplate ? (
                <img
                  key={`${mode}-${heroTemplate.id}`}
                  src={heroTemplate.image}
                  alt={heroTemplate.imageAlt}
                  className="oit-hero-preview-image h-full w-full object-cover object-top"
                />
              ) : null}
            </div>
            <div
              key={`${mode}-${heroTemplate?.id ?? "template"}-label`}
              className="oit-hero-preview-label absolute bottom-6 right-6 inline-flex max-w-[calc(100%-3rem)] items-center gap-2.5 rounded-full bg-white/95 px-3 py-2 text-xs font-semibold text-zinc-950 shadow-xl backdrop-blur sm:px-3.5 sm:py-2.5 sm:text-sm"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-zinc-950 text-white sm:h-8 sm:w-8">
                <Sparkles size={15} aria-hidden="true" />
              </span>
              {heroTemplate?.title ?? "Open Image Template"}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="border-t border-black/10 pt-6">
          <div className="flex flex-wrap items-center gap-5 text-sm font-semibold text-zinc-500">
            <span className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-2 text-zinc-950">
              <Images size={17} aria-hidden="true" />
              Templates
            </span>
            <Link href="/schema" className="inline-flex items-center gap-2 transition hover:text-zinc-950">
              <Braces size={17} aria-hidden="true" />
              Schema
            </Link>
            <Link href="/docs/integration-guide-for-image-platforms" className="inline-flex items-center gap-2 transition hover:text-zinc-950">
              <Sparkles size={17} aria-hidden="true" />
              Integrations
            </Link>
          </div>

          <form onSubmit={handleSearchSubmit} className="mt-5 flex min-h-16 items-center gap-3 rounded-full bg-zinc-100 p-2 shadow-inner">
            <label className="sr-only" htmlFor="hero-template-search">Search templates</label>
            <input
              id="hero-template-search"
              name="query"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="What type of image template are you interested in?"
              className="min-w-0 flex-1 bg-transparent px-5 text-base text-zinc-950 outline-none placeholder:text-zinc-500"
            />
            <button
              type="submit"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-r from-[#015a9e] to-[#11e9bb] text-white shadow-sm transition hover:scale-105"
              aria-label="Search templates"
            >
              <Search size={22} aria-hidden="true" />
            </button>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="mr-1 font-semibold text-zinc-700">Popular:</span>
            {popularSearches.map((query) => (
              <button
                key={query}
                type="button"
                onClick={() => handlePopularSearch(query)}
                className="rounded-full border border-black/10 bg-white px-4 py-2 font-medium text-zinc-700 transition hover:border-black/20 hover:text-zinc-950"
              >
                {query}
              </button>
            ))}
            <Link href="/templates" className="ml-auto hidden items-center gap-1 rounded-full border border-black/10 bg-white px-4 py-2 font-semibold text-zinc-950 transition hover:bg-zinc-50 sm:inline-flex">
              Explore all
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
