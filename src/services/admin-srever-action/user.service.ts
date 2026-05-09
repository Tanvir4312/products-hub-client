"use server"

import { ApiErrorResponse, ApiSuccessResponse } from "@/types/api.types";
import { IUpdateUserPayload } from "@/types/Dashboard/admin-dashboard-types/users-managements.types";
import { updateUserSchema } from "@/zod/userZodValidation";

export const updateUser = async (id: string, data: IUpdateUserPayload): Promise<ApiSuccessResponse<IUpdateUserPayload> | ApiErrorResponse> => {
  const parsedPayload = updateUserSchema.safeParse(data);
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

  // Append userId - REQUIRED for backend to know which user to update
  formData.append("userId", id);

  // Only append fields that have values
  if (parsedPayload.data.name) {
    formData.append("name", parsedPayload.data.name);
  }
  if (parsedPayload.data.email) {
    formData.append("email", parsedPayload.data.email);
  }
  if (parsedPayload.data.contactNumber) {
    formData.append("contactNumber", parsedPayload.data.contactNumber);
  }

  // Handle profilePhoto - check for File-like object
  const profilePhoto = parsedPayload.data.profilePhoto;
  if (profilePhoto instanceof File) {
    formData.append("profilePhoto", profilePhoto);
  }

  try {
    const res = await fetch(`${API_BASE_URL}/loginUser/update-profile`, {
      method: "PUT",
      headers: { Cookie: cookieHeader },
      body: formData,
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json?.message || "Failed to update user");
    return json;
  } catch (error: any) {
    console.error("Error updating user:", error);
    const message = error?.message || "Failed to update user";
    return {
      success: false,
      message,
    };
  }
};