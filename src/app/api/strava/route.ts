import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { buildAuthorizeUrl } from "@/lib/strava/client";

export const runtime = "nodejs";

/**
 * GET /api/strava — kick off the OAuth flow.
 * Sets a short-lived CSRF state cookie, then redirects to Strava.
 */
export async function GET() {
  if (!process.env.STRAVA_CLIENT_ID) {
    return NextResponse.json({ error: "STRAVA_CLIENT_ID belum diset." }, { status: 500 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const redirectUri = `${appUrl}/api/strava/callback`;
  const state = randomBytes(16).toString("hex");

  const res = NextResponse.redirect(buildAuthorizeUrl(redirectUri, state));
  res.cookies.set("strava_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return res;
}
