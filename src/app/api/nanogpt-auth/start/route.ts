import { NextResponse } from "next/server";
import {
  createCodeChallenge,
  createCodeVerifier,
  encodeOAuthStateCookie,
  getAuthCallbackUrl,
  getNanoGptBaseUrl,
  NANO_GPT_AUTH_STATE_COOKIE,
  normalizeReturnTo,
  randomBase64Url,
} from "@/lib/nanogpt-auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const host = request.headers.get("host") || "";
  if (requestUrl.protocol === "http:" && host.startsWith("localhost:") && requestUrl.port) {
    requestUrl.hostname = "127.0.0.1";
    return NextResponse.redirect(requestUrl, 302);
  }

  const redirectUri = getAuthCallbackUrl(requestUrl.origin);
  const state = randomBase64Url(24);
  const codeVerifier = createCodeVerifier();
  const codeChallenge = createCodeChallenge(codeVerifier);
  const returnTo = normalizeReturnTo(requestUrl.searchParams.get("returnTo"));

  const authorizeUrl = new URL("/auth", getNanoGptBaseUrl());
  authorizeUrl.searchParams.set("callback_url", redirectUri);
  authorizeUrl.searchParams.set("client_name", "Open Image Templates");
  authorizeUrl.searchParams.set("scope", "api.use models.read");
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("code_challenge", codeChallenge);
  authorizeUrl.searchParams.set("code_challenge_method", "S256");

  const response = NextResponse.redirect(authorizeUrl, 302);
  response.cookies.set(
    NANO_GPT_AUTH_STATE_COOKIE,
    encodeOAuthStateCookie({
      state,
      codeVerifier,
      redirectUri,
      returnTo,
    }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: requestUrl.protocol === "https:",
      path: "/api/nanogpt-auth",
      maxAge: 10 * 60,
    },
  );

  return response;
}
