"use server"

import { ApiErrorResponse, ApiSuccessResponse } from "@/types/api.types";
import { IUpdateModeratorPayload } from "@/types/Dashboard/admin-dashboard-types/moderators-management.types";
import { updateModeratorSchema } from "@/zod/moderatorZodValidation";

export const updateModerator = async (id: string, data: IUpdateModeratorPayload): Promise<ApiSuccessResponse<IUpdateModeratorPayload> | ApiErrorResponse> => {
  const parsedPayload = updateModeratorSchema.safeParse(data);
  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0]?.message || "Invalid Input";
    return {
      success: false,
      message: firstError,
    };
  }

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const formData = new FormData();

  if (parsedPayload.data.name) {
    formData.append("name", parsedPayload.data.name);
  }
  if (parsedPayload.data.email) {
    formData.append("email", parsedPayload.data.email);
  }
  if (parsedPayload.data.contactNumber) {
    formData.append("contactNumber", parsedPayload.data.contactNumber);
  }
  if (parsedPayload.data.gender) {
    formData.append("gender", parsedPayload.data.gender);
  }

  if (parsedPayload.data.profilePhoto instanceof File) {
    formData.append("profilePhoto", parsedPayload.data.profilePhoto);
  }

  try {
    const res = await fetch(`${API_BASE_URL}/moderator/${id}`, {
      method: "PUT",
      headers: { Cookie: cookieHeader },
      body: formData,
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json?.message || "Failed to update moderator");
    return json;
  } catch (error: any) {
    console.error("Error updating moderator:", error);
    const message = error?.message || "Failed to update moderator";
    return {
      success: false,
      message,
    };
  }
};
