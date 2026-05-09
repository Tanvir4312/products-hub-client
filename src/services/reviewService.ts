"use server"

import { httpClient } from "@/lib/axios/httpClient";
import { IReview } from "@/types/product.types";
import { ApiSuccessResponse } from "@/types/api.types";

export const createReview = async (productId: string, rating: number, comment: string): Promise<ApiSuccessResponse<IReview>> => {
  try {
    const response = await httpClient.post<IReview>("/reviews", { productId, rating, comment });
    return response;
  } catch (error: any) {
    console.error("Error creating review:", error);
    throw error;
  }
};

export const updateReview = async (id: string, rating: number, comment: string): Promise<ApiSuccessResponse<IReview>> => {
  try {
    const response = await httpClient.patch<IReview>(`/reviews/${id}`, { rating, comment });
    return response;
  } catch (error: any) {
    console.error("Error updating review:", error);
    throw error;
  }
};

export const deleteReview = async (id: string): Promise<ApiSuccessResponse<any>> => {
  try {
    const response = await httpClient.delete<any>(`/reviews/${id}`);
    return response;
  } catch (error: any) {
    console.error("Error deleting review:", error);
    throw error;
  }
};

export const getMyReviews = async (): Promise<ApiSuccessResponse<IReview[]>> => {
  try {
    const response = await httpClient.get<IReview[]>("/reviews/my-reviews");
    return response;
  } catch (error: any) {
    console.error("Error fetching my reviews:", error);
    throw error;
  }
};
