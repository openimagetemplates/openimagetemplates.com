"use client";

import { Check, Download, Loader2, TriangleAlert } from "lucide-react";
import { useState } from "react";
import {
  type AnalyticsProperties,
  trackEngagement,
} from "@/lib/analytics-events";

type GeneratedImageDownloadProps = {
  imageUrl: string;
  fileName: string;
  eventName: string;
  eventProperties?: AnalyticsProperties;
};

const imageExtensions: Record<string, string> = {
  "image/avif": "avif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function safeFileName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "generated-image";
}

function getImageExtension(blob: Blob, imageUrl: string) {
  const contentType = blob.type.toLowerCase().split(";")[0];
  if (imageExtensions[contentType]) return imageExtensions[contentType];

  try {
    const extension = new URL(imageUrl).pathname.match(/\.([a-z0-9]{2,5})$/i)?.[1]?.toLowerCase();
    if (extension && ["avif", "jpeg", "jpg", "png", "webp"].includes(extension)) {
      return extension === "jpeg" ? "jpg" : extension;
    }
  } catch {
    // Data URLs and other non-standard image URLs use the PNG fallback.
  }

  return "png";
}

export function GeneratedImageDownload({
  imageUrl,
  fileName,
  eventName,
  eventProperties = {},
}: GeneratedImageDownloadProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  async function downloadImage() {
    setDownloading(true);
    setDownloaded(false);
    setDownloadError("");

    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error(`Image download returned ${response.status}.`);

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = objectUrl;
      downloadLink.download = `${safeFileName(fileName)}.${getImageExtension(blob, imageUrl)}`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1_000);

      trackEngagement(eventName, eventProperties);
      setDownloaded(true);
      window.setTimeout(() => setDownloaded(false), 2_000);
    } catch {
      setDownloadError("Automatic download was blocked. Open the image below and save it manually.");
      trackEngagement(`${eventName}_error`, eventProperties);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-amber-950">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2.5">
          <TriangleAlert className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
          <p className="text-sm leading-5">
            <strong>Download this image now.</strong>{" "}
            It is not stored by Open Image Templates and may not be available after you leave or refresh this page.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void downloadImage()}
          disabled={downloading}
          className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-amber-950 px-4 text-sm font-semibold text-white transition hover:bg-amber-900 disabled:cursor-wait disabled:opacity-60 sm:w-auto"
        >
          {downloading ? (
            <Loader2 className="animate-spin" size={16} aria-hidden="true" />
          ) : downloaded ? (
            <Check size={16} aria-hidden="true" />
          ) : (
            <Download size={16} aria-hidden="true" />
          )}
          {downloading ? "Preparing download" : downloaded ? "Downloaded" : "Download image"}
        </button>
      </div>

      {downloadError ? (
        <p className="mt-3 text-sm leading-5 text-amber-900" role="alert">
          {downloadError}{" "}
          <a
            href={imageUrl}
            target="_blank"
            rel="noreferrer"
            className="font-semibold underline underline-offset-2"
          >
            Open image
          </a>
        </p>
      ) : null}
    </div>
  );
}
