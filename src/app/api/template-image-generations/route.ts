import { NextResponse } from "next/server";
import { NANO_GPT_ACCESS_TOKEN_COOKIE, getNanoGptBaseUrl } from "@/lib/nanogpt-auth";

export const runtime = "nodejs";
export const maxDuration = 180;

type NanoGptImageResponse = {
  data?: unknown;
  cost?: unknown;
  requestId?: unknown;
  paymentSource?: unknown;
};

type NanoGptImageResult = {
  url?: unknown;
  b64_json?: unknown;
};

function errorResponse(status: number, message: string) {
  return NextResponse.json({ message }, { status });
}

function parseString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function getCookieValue(cookieHeader: string | null, name: string) {
  const rawValue = cookieHeader
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1) || "";

  try {
    return decodeURIComponent(rawValue);
  } catch {
    return rawValue;
  }
}

function getNanoGptAccessToken(request: Request) {
  return getCookieValue(request.headers.get("cookie"), NANO_GPT_ACCESS_TOKEN_COOKIE);
}

function resolveGeneratedImage(data: unknown) {
  if (!Array.isArray(data)) return "";
  const first = data.find((item): item is NanoGptImageResult => Boolean(item && typeof item === "object"));
  const url = parseString(first?.url);
  if (url) return url;

  const b64Json = parseString(first?.b64_json);
  return b64Json ? `data:image/png;base64,${b64Json}` : "";
}

export async function POST(request: Request) {
  const accessToken = getNanoGptAccessToken(request);
  if (!accessToken) {
    return errorResponse(401, "Sign in with NanoGPT to generate images.");
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const prompt = parseString(body?.prompt);
  const model = parseString(body?.model, "gpt-image-2");

  if (prompt.length < 3) {
    return errorResponse(400, "Write a prompt before generating an image.");
  }

  const upstream = await fetch(`${getNanoGptBaseUrl()}/api/generate-image`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      "x-api-key": accessToken,
    },
    body: JSON.stringify({
      model,
      prompt,
      nImages: 1,
      response_format: "url",
    }),
  });

  const upstreamData = (await upstream.json().catch(() => ({}))) as NanoGptImageResponse;
  if (!upstream.ok) {
    return errorResponse(
      upstream.status === 401 ? 401 : 502,
      upstream.status === 401
        ? "Sign in with NanoGPT to generate images."
        : "NanoGPT could not generate the image. Please try again.",
    );
  }

  const imageUrl = resolveGeneratedImage(upstreamData.data);
  if (!imageUrl) {
    return errorResponse(502, "NanoGPT did not return a displayable image.");
  }

  return NextResponse.json({
    imageUrl,
    cost: typeof upstreamData.cost === "number" ? upstreamData.cost : undefined,
    paymentSource: typeof upstreamData.paymentSource === "string" ? upstreamData.paymentSource : undefined,
    requestId: typeof upstreamData.requestId === "string" ? upstreamData.requestId : undefined,
  });
}
