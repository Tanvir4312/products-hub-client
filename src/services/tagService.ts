"use server"

import { httpClient } from "@/lib/axios/httpClient";

export interface ITag {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITagResponse {
  success: boolean;
  message: string;
  data: ITag[];
}

/**
 * Fetches all product tags/categories from the server.
 */
export const getAllTags = async (name?: string): Promise<ITagResponse> => {
  try {
    const response = await httpClient.get<ITag[]>("/tags", { params: { name } });
    return response as unknown as ITagResponse;

  } catch (error: any) {
    console.error("Error fetching tags:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to fetch tags.",
      data: [],
    };
  }
};
