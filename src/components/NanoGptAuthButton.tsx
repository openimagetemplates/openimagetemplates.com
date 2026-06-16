import { Check, LogOut } from "lucide-react";
import { cookies } from "next/headers";
import { NANO_GPT_ACCESS_TOKEN_COOKIE } from "@/lib/nanogpt-auth";
import { NanoGptMark } from "./NanoGptMark";

export async function NanoGptAuthButton() {
  const cookieStore = await cookies();
  const isConnected = Boolean(cookieStore.get(NANO_GPT_ACCESS_TOKEN_COOKIE)?.value);

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
      className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800"
    >
      <NanoGptMark />
      Sign in with NanoGPT
    </a>
  );
}
