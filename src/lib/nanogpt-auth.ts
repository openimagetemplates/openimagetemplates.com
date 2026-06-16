import { createHash, randomBytes } from "crypto";

export const NANO_GPT_AUTH_STATE_COOKIE = "oit_nanogpt_oauth_state";
export const NANO_GPT_ACCESS_TOKEN_COOKIE = "oit_nanogpt_access_token";

const codeVerifierAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";

export type NanoGptOAuthState = {
  state: string;
  codeVerifier: string;
  redirectUri: string;
  returnTo: string;
};

export function getNanoGptBaseUrl() {
  return (process.env.NANOGPT_BASE_URL || "https://nano-gpt.com").replace(/\/+$/, "");
}

export function randomBase64Url(byteLength = 32) {
  return randomBytes(byteLength).toString("base64url");
}

export function createCodeVerifier(length = 64) {
  const bytes = randomBytes(length);
  let verifier = "";
  for (const byte of bytes) {
    verifier += codeVerifierAlphabet[byte % codeVerifierAlphabet.length];
  }
  return verifier;
}

export function createCodeChallenge(codeVerifier: string) {
  return createHash("sha256").update(codeVerifier, "utf8").digest("base64url");
}

export function createCallbackClientId(redirectUri: string) {
  const normalizedRedirectUri = canonicalizeLoopbackRedirectUri(redirectUri);
  const hash = createHash("sha256").update(normalizedRedirectUri, "utf8").digest("hex");
  return `ngpt_callback_${hash.slice(0, 32)}`;
}

export function canonicalizeLoopbackRedirectUri(redirectUri: string) {
  try {
    const url = new URL(redirectUri);
    const hostname = url.hostname.toLowerCase();
    const isLoopback =
      url.protocol === "http:" &&
      Boolean(url.port) &&
      (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1" || hostname === "[::1]");

    if (isLoopback) {
      url.hostname = "127.0.0.1";
      return url.toString();
    }
  } catch {
    return redirectUri.trim();
  }

  return redirectUri.trim();
}

export function getAuthCallbackUrl(origin: string) {
  return canonicalizeLoopbackRedirectUri(new URL("/api/nanogpt-auth/callback", origin).toString());
}

export function encodeOAuthStateCookie(state: NanoGptOAuthState) {
  return Buffer.from(JSON.stringify(state), "utf8").toString("base64url");
}

export function decodeOAuthStateCookie(value: string | undefined): NanoGptOAuthState | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
    if (
      typeof parsed?.state === "string" &&
      typeof parsed?.codeVerifier === "string" &&
      typeof parsed?.redirectUri === "string" &&
      typeof parsed?.returnTo === "string"
    ) {
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
}

export function normalizeReturnTo(value: string | null | undefined) {
  if (!value) return "/";
  try {
    const url = new URL(value, "https://openimagetemplates.com");
    return `${url.pathname}${url.search}`;
  } catch {
    return "/";
  }
}
