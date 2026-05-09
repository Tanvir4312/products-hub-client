"use server"

import { ApiErrorResponse, ApiSuccessResponse } from "@/types/api.types";
import { httpClient } from "@/lib/axios/httpClient";
import { IAdminsData } from "@/types/Dashboard/admin-dashboard-types/admins-management.type";
import { createAdminValidationSchema, ICreateAdminPayload, updateAdminValidationSchema, IUpdateAdminPayload } from "@/zod/adminZodValidation";

interface IAllAdminsPagination {
  page: number;
  limit: number;
  current_Page: number;
  total_page: number;
  total: number;
}

interface IAllAdminsPayload {
  data: IAdminsData[];
  meta: IAllAdminsPagination;
}

export const getAllAdmin = async (queryParamsString: string): Promise<ApiSuccessResponse<IAllAdminsPayload>> => {
  try {
    const response = await httpClient.get<IAllAdminsPayload>(queryParamsString ? `/admin?${queryParamsString}` : '/admin');
    return response;
  } catch (error) {
    console.error("Error fetching all admins:", error);
    throw error;
  }
}

export const createAdmin = async (data: ICreateAdminPayload): Promise<ICreateAdminPayload | ApiErrorResponse> => {
  const parsPayload = createAdminValidationSchema.safeParse(data);

  try {
    const response = await httpClient.post<ICreateAdminPayload>("/users/create-admin", parsPayload.data);
    return response;
  } catch (error: any) {
    return error?.response?.data;
  }
}

export const updateAdmin = async (id: string, data: IUpdateAdminPayload): Promise<IUpdateAdminPayload | ApiErrorResponse> => {
  const parsPayload = updateAdminValidationSchema.safeParse(data);
  if (!parsPayload.success) {
    const firstError = parsPayload.error.issues[0].message || "Invalid Input";
    return {
      success: false,
      message: firstError,
    }
  }

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const formData = new FormData();
  if (parsPayload.data.name) {
    formData.append("name", parsPayload.data.name);
  }
  if (parsPayload.data.contactNumber) {
    formData.append("contactNumber", parsPayload.data.contactNumber);
  }
  if (parsPayload.data.profilePhoto instanceof File) {
    formData.append("profilePhoto", parsPayload.data.profilePhoto);
  }

  try {
    const res = await fetch(`${API_BASE_URL}/admin/${id}`, {
      method: "PUT",
      headers: { Cookie: cookieHeader },
      body: formData,
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json?.message || "Failed to update admin");
    return json;
  } catch (error: any) {
    console.error("Error updating admin:", error);
    const message = error?.message || "Failed to update admin";
    throw new Error(message);
  }
}

export const deleteAdmin = async (id: string): Promise<ApiSuccessResponse<any>> => {
  try {
    const response = await httpClient.delete(`/admin/${id}`);
    return response;
  } catch (error: any) {
    console.error("Error deleting admin:", error);
    const message = error?.data?.message || error?.response?.data?.message || error?.message || "Failed to delete admin";
    throw new Error(message);
  }
}