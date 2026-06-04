import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeCodeForTokens } from "@/lib/strava/client";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * GET /api/strava/callback?code=...&state=...
 * Verifies CSRF state, exchanges the code for tokens, and stores them
 * against the signed-in user. Redirects back into the app.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const cookieStore = await cookies();
  const expectedState = cookieStore.get("strava_oauth_state")?.value;

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(`${appUrl}/progress?strava=error`);
  }

  try {
    const tokens = await exchangeCodeForTokens(code);

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("strava_tokens").upsert({
        owner_id: user.id,
        athlete_id: tokens.athleteId,
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
        expires_at: tokens.expiresAt,
        updated_at: new Date().toISOString(),
      });
    }

    const res = NextResponse.redirect(`${appUrl}/progress?strava=connected`);
    res.cookies.delete("strava_oauth_state");
    return res;
  } catch (err) {
    console.error("[/api/strava/callback]", err);
    return NextResponse.redirect(`${appUrl}/progress?strava=error`);
  }
}
