import { NextResponse } from "next/server";
import { NANO_GPT_ACCESS_TOKEN_COOKIE } from "@/lib/nanogpt-auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const destination = new URL("/", requestUrl.origin);
  destination.searchParams.set("nanogptAuth", "signed-out");

  const response = NextResponse.redirect(destination, 303);
  response.cookies.set(NANO_GPT_ACCESS_TOKEN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: requestUrl.protocol === "https:",
    path: "/",
    maxAge: 0,
  });

  return response;
}
