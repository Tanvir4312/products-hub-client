/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Decodes a JWT payload without using Node.js specific modules.
 * Safe for Next.js Edge Runtime (Middleware).
 */
export function decodeJWTPayload(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT in middleware helper:", error);
    return null;
  }
}

/**
 * Checks if a token is expiring within the threshold.
 */
export function isTokenExpiringSoon(token: string, thresholdInSeconds = 300): boolean {
  const payload = decodeJWTPayload(token);
  if (!payload || !payload.exp) return true;

  const remainingSeconds = payload.exp - Math.floor(Date.now() / 1000);
  return remainingSeconds > 0 && remainingSeconds <= thresholdInSeconds;
}

/**
 * Fetches user info from the backend using the provided tokens.
 */
export async function fetchUserInfo(accessToken: string, sessionToken?: string) {
  const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!BASE_API_URL) return null;

  try {
    const res = await fetch(`${BASE_API_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}${sessionToken ? `; better-auth.session_token=${sessionToken}` : ""}`
      },
      // Important: prevent caching in middleware
      cache: 'no-store'
    });

    if (!res.ok) return null;
    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching user info in middleware helper:", error);
    return null;
  }
}

/**
 * Refreshes tokens and returns the new ones.
 */
export async function refreshTokens(refreshToken: string) {
  const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!BASE_API_URL) return null;

  try {
    const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`
      },
      cache: 'no-store'
    });

    if (!res.ok) return null;
    const { data } = await res.json();
    return data; // { accessToken, refreshToken, token }
  } catch (error) {
    console.error("Error refreshing tokens in middleware helper:", error);
    return null;
  }
}
