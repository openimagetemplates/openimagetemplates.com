import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { NANO_GPT_ACCESS_TOKEN_COOKIE } from "@/lib/nanogpt-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();

  return NextResponse.json(
    {
      connected: Boolean(cookieStore.get(NANO_GPT_ACCESS_TOKEN_COOKIE)?.value),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
