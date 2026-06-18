import { NextResponse } from "next/server";
import { getNanoGptBaseUrl } from "@/lib/nanogpt-auth";

export const runtime = "nodejs";

type NanoGptEstimateResponse = {
  cost?: unknown;
  error?: unknown;
  message?: unknown;
};

function parseString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function errorResponse(status: number, message: string) {
  return NextResponse.json({ message }, { status });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const prompt = parseString(body?.prompt);
  const model = parseString(body?.model, "gpt-image-2");

  if (prompt.length < 3) {
    return errorResponse(400, "Write a prompt before estimating image cost.");
  }

  const upstream = await fetch(`${getNanoGptBaseUrl()}/api/estimate-image-cost`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      prompt,
      nImages: 1,
      quoteContext: "anon",
    }),
  });

  const upstreamData = (await upstream.json().catch(() => ({}))) as NanoGptEstimateResponse;
  if (!upstream.ok || typeof upstreamData.cost !== "number") {
    return errorResponse(
      upstream.ok ? 502 : upstream.status,
      parseString(upstreamData.message) || parseString(upstreamData.error) || "Could not estimate image cost.",
    );
  }

  return NextResponse.json({ cost: upstreamData.cost });
}
