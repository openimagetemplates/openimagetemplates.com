"use client";

import { Check, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

type AuthStatusResponse = {
  connected?: unknown;
};

export function NanoGptAuthButton() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;

    fetch("/api/nanogpt-auth/status", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        const status = data as AuthStatusResponse;
        if (active) setIsConnected(Boolean(status?.connected));
      })
      .catch(() => {
        if (active) setIsConnected(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (!isConnected) return null;

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
