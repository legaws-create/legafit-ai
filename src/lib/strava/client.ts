/**
 * Strava OAuth + REST helpers. SERVER ONLY.
 * Docs: https://developers.strava.com/docs/authentication/
 */
import type { StravaActivity } from "@/core/domain/types";

const STRAVA_AUTH_URL = "https://www.strava.com/oauth/authorize";
const STRAVA_TOKEN_URL = "https://www.strava.com/oauth/token";
const STRAVA_API = "https://www.strava.com/api/v3";

export interface StravaTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // unix seconds
  athleteId: number;
}

/** Build the URL we redirect the user to in order to grant access. */
export function buildAuthorizeUrl(redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.STRAVA_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: "code",
    approval_prompt: "auto",
    scope: "read,activity:read_all",
    state,
  });
  return `${STRAVA_AUTH_URL}?${params.toString()}`;
}

/** Exchange the one-time auth code for tokens. */
export async function exchangeCodeForTokens(code: string): Promise<StravaTokens> {
  const res = await fetch(STRAVA_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Strava token exchange failed: ${res.status}`);
  const json = await res.json();
  return {
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
    expiresAt: json.expires_at,
    athleteId: json.athlete?.id,
  };
}

/** Refresh an expired access token. */
export async function refreshAccessToken(refreshToken: string): Promise<StravaTokens> {
  const res = await fetch(STRAVA_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Strava token refresh failed: ${res.status}`);
  const json = await res.json();
  return {
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
    expiresAt: json.expires_at,
    athleteId: 0,
  };
}

/** Fetch recent activities and map them to the domain shape. */
export async function fetchRecentActivities(
  accessToken: string,
  perPage = 20
): Promise<StravaActivity[]> {
  const res = await fetch(`${STRAVA_API}/athlete/activities?per_page=${perPage}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Strava activities fetch failed: ${res.status}`);
  const json = (await res.json()) as any[];
  return json.map((a) => ({
    id: a.id,
    name: a.name,
    type: a.sport_type ?? a.type,
    distanceM: a.distance ?? 0,
    movingTimeSec: a.moving_time ?? 0,
    startDate: a.start_date,
    calories: a.calories ?? null,
  }));
}
