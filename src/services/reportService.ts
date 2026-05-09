"use server"

import { httpClient } from "@/lib/axios/httpClient";

export const reportProduct = async (productId: string, reason: string) => {
  try {
    const response = await httpClient.post("/products/report", { productId, reason });
    return response;
  } catch (error: any) {
    console.error("Error reporting product:", error);
    throw error;
  }
};
