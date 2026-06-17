export const DEFAULT_OIT_API_URL = "https://oit-api.huggi.workers.dev";

export function normalizeOitApiUrl(value: string | undefined) {
  return (value || DEFAULT_OIT_API_URL).replace(/\/$/, "");
}
