"use server";

import { setTokenInCookies } from "../lib/tokenUtils";
import { cookies } from "next/headers";
import { deleteCookie } from "../lib/cookieUtils";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function getNewTokensWithRefreshToken(refreshToken: string): Promise<boolean> {
    try {
        const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `refreshToken=${refreshToken}`
            }
        });

        if (!res.ok) {
            return false;
        }

        const { data } = await res.json();

        const { accessToken, refreshToken: newRefreshToken, token } = data;

        if (accessToken) {
            await setTokenInCookies("accessToken", accessToken);
        }

        if (newRefreshToken) {
            await setTokenInCookies("refreshToken", newRefreshToken);
        }

        if (token) {
            await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60); // 1 day in seconds
        }

        return true;
    } catch (error) {
        console.error("Error refreshing token:", error);
        return false;
    }
}

export async function getUserInfo() {
    const cookieStore = await cookies();
    try {
        const accessToken = cookieStore.get("accessToken")?.value;
        const sessionToken = cookieStore.get("better-auth.session_token")?.value

        if (!accessToken) {
            return null;
        }

        const res = await fetch(`${BASE_API_URL}/auth/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`
            }
        });

        if (!res.ok) {
            console.error("Failed to fetch user info:", res.status, res.statusText);
            return null;
        }

        const { data } = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching user info:", error);
        return null;
    }
}

export async function logoutUser() {
    const cookieStore = await cookies();
    try {
        const accessToken = cookieStore.get("accessToken")?.value;
        const sessionToken = cookieStore.get("better-auth.session_token")?.value;

        const res = await fetch(`${BASE_API_URL}/auth/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`
            }
        });

        // Clear cookies on client side as well
        await deleteCookie("accessToken");
        await deleteCookie("refreshToken");
        await deleteCookie("better-auth.session_token");

        if (!res.ok) {
            console.error("Failed to logout from backend:", res.status, res.statusText);
            return { success: false, message: "Server logout failed" };
        }

        return { success: true };
    } catch (error) {
        console.error("Error logging out:", error);
        return { success: false, message: "An unexpected error occurred" };
    }
}