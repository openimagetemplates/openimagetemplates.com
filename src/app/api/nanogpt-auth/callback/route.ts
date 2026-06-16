import { NextResponse } from "next/server";
import {
  createCallbackClientId,
  decodeOAuthStateCookie,
  getNanoGptBaseUrl,
  NANO_GPT_ACCESS_TOKEN_COOKIE,
  NANO_GPT_AUTH_STATE_COOKIE,
} from "@/lib/nanogpt-auth";

export const runtime = "nodejs";

function redirectWithAuthError(requestUrl: URL, message: string) {
  const url = new URL("/", requestUrl.origin);
  url.searchParams.set("nanogptAuth", "error");
  url.searchParams.set("message", message);
  return NextResponse.redirect(url, 303);
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const stateCookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${NANO_GPT_AUTH_STATE_COOKIE}=`))
    ?.slice(NANO_GPT_AUTH_STATE_COOKIE.length + 1);

  const oauthState = decodeOAuthStateCookie(stateCookie);
  if (!oauthState || oauthState.state !== requestUrl.searchParams.get("state")) {
    return redirectWithAuthError(requestUrl, "NanoGPT sign-in state expired. Please try again.");
  }

  const error = requestUrl.searchParams.get("error");
  if (error) {
    return redirectWithAuthError(requestUrl, "NanoGPT sign-in was not completed.");
  }

  const code = requestUrl.searchParams.get("code");
  if (!code) {
    return redirectWithAuthError(requestUrl, "NanoGPT did not return an authorization code.");
  }

  const tokenResponse = await fetch(new URL("/oauth/token", getNanoGptBaseUrl()), {
    method: "POST",
    cache: "no-store",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: createCallbackClientId(oauthState.redirectUri),
      code,
      redirect_uri: oauthState.redirectUri,
      code_verifier: oauthState.codeVerifier,
    }),
  });

  const tokenData = await tokenResponse.json().catch(() => ({}));
  if (!tokenResponse.ok || typeof tokenData?.access_token !== "string") {
    return redirectWithAuthError(requestUrl, "NanoGPT token exchange failed. Please try again.");
  }

  const destination = new URL(oauthState.returnTo || "/", requestUrl.origin);
  destination.searchParams.set("nanogptAuth", "connected");

  const response = NextResponse.redirect(destination, 303);
  response.cookies.set(NANO_GPT_ACCESS_TOKEN_COOKIE, tokenData.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: requestUrl.protocol === "https:",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  response.cookies.set(NANO_GPT_AUTH_STATE_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: requestUrl.protocol === "https:",
    path: "/api/nanogpt-auth",
    maxAge: 0,
  });

  return response;
}
