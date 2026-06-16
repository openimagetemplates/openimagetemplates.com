import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { TEMPLATE_SCHEMA_VERSION, TEMPLATE_STANDARD } from "@/lib/templates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SubmissionTemplate = {
  standard?: unknown;
  schema_version?: unknown;
  id?: unknown;
  title?: unknown;
  description?: unknown;
  category?: unknown;
  prompt?: unknown;
  slots?: unknown;
  suggested_models?: unknown;
  examples?: unknown;
  creator?: unknown;
  license?: unknown;
};

function errorResponse(status: number, message: string) {
  return NextResponse.json({ message }, { status });
}

function isString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function validateTemplate(template: SubmissionTemplate | null) {
  if (!template || typeof template !== "object") return "Missing template.";
  if (template.standard !== TEMPLATE_STANDARD) return "Template standard is invalid.";
  if (template.schema_version !== TEMPLATE_SCHEMA_VERSION) return "Template schema version is invalid.";
  if (!isString(template.id) || template.id.length > 120) return "Template id is invalid.";
  if (!isString(template.title) || template.title.length > 120) return "Template title is invalid.";
  if (!isString(template.description) || template.description.length > 280) return "Template description is invalid.";
  if (!isString(template.prompt) || template.prompt.length > 4000) return "Template prompt is invalid.";
  if (!Array.isArray(template.slots) || template.slots.length < 1 || template.slots.length > 12) return "Template slots are invalid.";
  return null;
}

async function submitToWebhook(payload: unknown) {
  const webhookUrl = process.env.OPEN_IMAGE_TEMPLATE_SUBMISSIONS_WEBHOOK_URL;
  if (!webhookUrl) return false;

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Submission webhook failed with ${response.status}`);
  }

  return true;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const template = body?.template as SubmissionTemplate | null;
  const validationError = validateTemplate(template);
  if (validationError) return errorResponse(400, validationError);

  const submittedAt = new Date().toISOString();
  const submissionId = randomUUID();
  const payload = {
    submissionId,
    submittedAt,
    status: "pending_review",
    template,
    source: "openimagetemplates.com",
  };

  try {
    const forwarded = await submitToWebhook(payload);

    return NextResponse.json({
      ok: true,
      submissionId,
      status: "pending_review",
      submittedAt,
      forwarded,
    });
  } catch (error) {
    console.error("[template-submissions] failed to submit template", error);
    return errorResponse(500, "Could not submit the template for review.");
  }
}
