"use server";

import { getDefaultDashboardRoute, UserRole } from "../../../../lib/authUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { getUserInfo } from "../../../../services/authService";
import { redirect } from "next/navigation";

export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const changePasswordAction = async (payload: IChangePasswordPayload) => {
  const userInfo = await getUserInfo();
  if (!payload.currentPassword || payload.currentPassword?.length < 1) {
    return { success: false, message: "Current password is required" };
  }
  if (!payload.newPassword || payload.newPassword?.length < 8) {
    return { success: false, message: "New password must be at least 8 characters" };
  }

  try {
    const response = await httpClient.post<any>("/auth/change-password", payload);

    if (response?.success) {
      redirect(getDefaultDashboardRoute(userInfo?.role as UserRole));
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
      message: err?.response?.data?.message || err.message || "Password change failed",
    };
  }
};
