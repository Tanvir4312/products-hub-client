"use server"

import { httpClient } from "@/lib/axios/httpClient";

export const voteProduct = async (productId: string) => {
  try {
    const response = await httpClient.post("/products/vote", { productId });
    return response;
  } catch (error: any) {
    console.error("Error voting product:", error);
    throw error;
  }
};

export const unvoteProduct = async (productId: string) => {
  try {
    const response = await httpClient.delete(`/products/vote/${productId}`);
    return response;
  } catch (error: any) {
    console.error("Error unvoting product:", error);
    throw error;
  }
};
