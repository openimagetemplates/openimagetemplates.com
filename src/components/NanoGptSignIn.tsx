"use client";

import { useEffect, useState } from "react";
import { NanoGptMark } from "@/components/NanoGptMark";
import { trackEngagement, type AnalyticsProperties } from "@/lib/analytics-events";

type NanoGptAuthStatusResponse = {
  connected?: unknown;
};

export async function getNanoGptConnectionStatus() {
  try {
    const response = await fetch("/api/nanogpt-auth/status", { cache: "no-store" });
    const data = (await response.json().catch(() => ({}))) as NanoGptAuthStatusResponse;
    return response.ok && Boolean(data.connected);
  } catch {
    return false;
  }
}

/**
 * Connection state for the visitor's NanoGPT session: `null` while the status
 * request is in flight, then `true` or `false`.
 */
export function useNanoGptConnection() {
  const [connected, setConnected] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    getNanoGptConnectionStatus().then((value) => {
      if (!active) return;
      setConnected(value);
    });
    return () => {
      active = false;
    };
  }, []);

  return [connected, setConnected] as const;
}

/** Sends the visitor through NanoGPT sign-in and back to the current page. */
export function startNanoGptSignIn(eventProperties: AnalyticsProperties = {}) {
  trackEngagement("start_nanogpt_sign_in", eventProperties);
  const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  window.location.href = `/api/nanogpt-auth/start?returnTo=${encodeURIComponent(returnTo)}`;
}

type NanoGptSignInButtonProps = {
  eventProperties?: AnalyticsProperties;
  /** Runs right before the redirect, e.g. to keep an unsaved draft. */
  beforeRedirect?: () => void;
  className?: string;
};

export function NanoGptSignInButton({
  eventProperties,
  beforeRedirect,
  className = "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800",
}: NanoGptSignInButtonProps) {
  return (
    <button
      type="button"
      onClick={() => {
        beforeRedirect?.();
        startNanoGptSignIn(eventProperties);
      }}
      className={className}
    >
      <NanoGptMark />
      Sign in with NanoGPT
    </button>
  );
}
