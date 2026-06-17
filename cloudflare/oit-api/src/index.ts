/// <reference types="@cloudflare/workers-types" />

type Env = {
  SEARCH_EVENTS: AnalyticsEngineDataset;
  R2_SUBMISSIONS: R2Bucket;
  R2_PUBLIC_ASSETS: R2Bucket;
};

type JsonRecord = Record<string, unknown>;

const allowedOrigins = new Set([
  "https://openimagetemplates.com",
  "https://www.openimagetemplates.com",
  "http://localhost:3000",
  "http://localhost:3015",
]);

const templateStandard = "open-image-template";
const templateSchemaVersion = "1.1.0";

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") return corsResponse(request, null, { status: 204 });

    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/health") {
      return jsonResponse(request, { ok: true, service: "oit-api" });
    }

    if (request.method === "POST" && url.pathname === "/api/events/search") {
      return handleSearchEvent(request, env);
    }

    if (request.method === "POST" && url.pathname === "/api/submissions") {
      return handleSubmission(request, env);
    }

    return jsonResponse(request, { message: "Not found." }, { status: 404 });
  },
};

export default worker;

async function handleSearchEvent(request: Request, env: Env) {
  const body = await readJson(request);
  if (!body) return jsonResponse(request, { message: "Invalid JSON." }, { status: 400 });

  const query = normalizeString(body.query, 160);
  const source = normalizeString(body.source, 80) || "unknown";
  const route = normalizeString(body.route, 160) || "/";
  const category = normalizeString(body.category, 80) || "All";
  const resultCount = normalizeNumber(body.resultCount);

  if (!query) return jsonResponse(request, { ok: true, recorded: false });

  env.SEARCH_EVENTS.writeDataPoint({
    blobs: [query, source, route, category],
    doubles: [resultCount, Date.now()],
    indexes: [hashForIndex(query)],
  });

  return jsonResponse(request, { ok: true, recorded: true });
}

async function handleSubmission(request: Request, env: Env) {
  const body = await readJson(request);
  if (!body) return jsonResponse(request, { message: "Invalid JSON." }, { status: 400 });

  const template = getRecord(body.template);
  const validationError = validateTemplate(template);
  if (validationError) return jsonResponse(request, { message: validationError }, { status: 400 });
  if (!template) return jsonResponse(request, { message: "Missing template." }, { status: 400 });

  const submittedAt = new Date().toISOString();
  const submissionId = crypto.randomUUID();
  const payload = {
    submissionId,
    submittedAt,
    status: "pending_review",
    template,
    source: normalizeString(body.source, 120) || "openimagetemplates.com",
  };
  const pathDate = submittedAt.slice(0, 7).replace("-", "/");
  const key = `submissions/pending/${pathDate}/${submissionId}.json`;

  await env.R2_SUBMISSIONS.put(key, JSON.stringify(payload, null, 2), {
    httpMetadata: { contentType: "application/json; charset=utf-8" },
    customMetadata: {
      status: "pending_review",
      templateId: String(template.id),
      submittedAt,
    },
  });

  return jsonResponse(request, {
    ok: true,
    submissionId,
    status: "pending_review",
    submittedAt,
  });
}

async function readJson(request: Request): Promise<JsonRecord | null> {
  try {
    const parsed = await request.json();
    return getRecord(parsed);
  } catch {
    return null;
  }
}

function validateTemplate(template: JsonRecord | null) {
  if (!template) return "Missing template.";
  if (template.standard !== templateStandard) return "Template standard is invalid.";
  if (template.schema_version !== templateSchemaVersion) return "Template schema version is invalid.";
  if (!isString(template.id) || template.id.length > 120) return "Template id is invalid.";
  if (!isString(template.title) || template.title.length > 120) return "Template title is invalid.";
  if (!isString(template.description) || template.description.length > 280) return "Template description is invalid.";
  if (!isString(template.prompt) || template.prompt.length > 4000) return "Template prompt is invalid.";
  if (!Array.isArray(template.slots) || template.slots.length < 1 || template.slots.length > 12) return "Template slots are invalid.";
  return null;
}

function corsResponse(request: Request, body: BodyInit | null, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  const origin = request.headers.get("origin");
  headers.set("access-control-allow-origin", origin && allowedOrigins.has(origin) ? origin : "https://openimagetemplates.com");
  headers.set("access-control-allow-methods", "GET, POST, OPTIONS");
  headers.set("access-control-allow-headers", "content-type");
  headers.set("access-control-max-age", "86400");
  headers.set("vary", "Origin");
  return new Response(body, { ...init, headers });
}

function jsonResponse(request: Request, payload: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  return corsResponse(request, JSON.stringify(payload), { ...init, headers });
}

function getRecord(value: unknown): JsonRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as JsonRecord;
}

function isString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeString(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function normalizeNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function hashForIndex(input: string) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (Math.imul(31, hash) + input.charCodeAt(index)) | 0;
  }
  return `q:${Math.abs(hash) % 64}`;
}
