"use server";

import { getDefaultDashboardRoute, UserRole } from "@/lib/authUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { redirect } from "next/navigation";

export interface IRegisterData {
  name: string;
  email: string;
  password: string;
}

export const registerAction = async (payload: IRegisterData) => {
  try {
    const response = await httpClient.post<any>("/auth/register", payload);

    const { user } = response.data;
    const { role } = user;

    if (response?.success) {
      const { accessToken, refreshToken, token } = response.data;

      if (accessToken) await setTokenInCookies("accessToken", accessToken);
      if (refreshToken) await setTokenInCookies("refreshToken", refreshToken);
      if (token) await setTokenInCookies("better-auth.session_token", token, 60 * 60 * 24);

      redirect(getDefaultDashboardRoute(role as UserRole));
    }

    return response;
  } catch (err: any) {
    if (
      err &&
      typeof err === "object" &&
      "digest" in err &&
      typeof err.digest === "string" &&
      err.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw err;
    }
    return {
      success: false,
      message: err?.response?.data?.message || err.message || "Registration failed",
    };
  }
};
