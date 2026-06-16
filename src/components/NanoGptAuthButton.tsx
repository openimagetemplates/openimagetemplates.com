"use client";

import { Check, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { NanoGptMark } from "./NanoGptMark";

export function NanoGptAuthButton() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let active = true;

    fetch("/api/nanogpt-auth/status", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (active) setIsConnected(Boolean(data?.connected));
      })
      .catch(() => {
        if (active) setIsConnected(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden h-10 items-center justify-center gap-2 rounded-full bg-emerald-50 px-4 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 sm:inline-flex">
          <Check size={16} aria-hidden="true" />
          NanoGPT connected
        </span>
        <a
          href="/api/nanogpt-auth/signout"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-zinc-700 ring-1 ring-black/10 transition hover:bg-zinc-50 hover:text-zinc-950"
          aria-label="Disconnect NanoGPT"
          title="Disconnect NanoGPT"
        >
          <LogOut size={16} aria-hidden="true" />
        </a>
      </div>
    );
  }

  return (
    <a
      href="/api/nanogpt-auth/start"
      onClick={(event) => {
        event.preventDefault();
        const returnTo = `${window.location.pathname}${window.location.search}`;
        window.location.href = `/api/nanogpt-auth/start?returnTo=${encodeURIComponent(returnTo)}`;
      }}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800"
    >
      <NanoGptMark />
      Sign in with NanoGPT
    </a>
  );
}
