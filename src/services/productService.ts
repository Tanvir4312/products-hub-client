"use server"

import { httpClient } from "@/lib/axios/httpClient";
import { IProduct, IProductResponse, ISingleProductResponse } from "@/types/product.types";

/**
 * Fetches all products from the API.
 * Uses the centralized httpClient to maintain architectural consistency.
 */
export const getAllProducts = async (params?: Record<string, any>): Promise<IProductResponse> => {
  try {
    const response = await httpClient.get<IProductResponse["data"]>("/products", { params });
    return response as unknown as IProductResponse;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to fetch products from the server.",
      data: { data: [], meta: { limit: 10, current_Page: 1, total_page: 0, total: 0 } },
    };
  }
};

/**
 * Fetches a single product by its ID.
 */
export const getProductById = async (id: string): Promise<ISingleProductResponse> => {
  try {
    const response = await httpClient.get<IProduct>(`/products/${id}`);
    return response as unknown as ISingleProductResponse;
  } catch (error: any) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};
/**
 * Creates a new product.
 * Expects FormData to handle file uploads for the 'photo' field.
 */
export const createProduct = async (formData: FormData): Promise<ISingleProductResponse> => {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const res = await fetch(`${API_BASE_URL}/products/create`, {
      method: "POST",
      headers: { 
        Cookie: cookieHeader 
      },
      body: formData,
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json?.message || "Failed to create product");
    return json as ISingleProductResponse;
  } catch (error: any) {
    console.error("Error creating product:", error);
    throw error;
  }
};
/**
 * Fetches the logged-in user's products.
 */
export const getMyProducts = async (params?: Record<string, any>): Promise<IProductResponse> => {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const queryParams = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE_URL}/products/my-products${queryParams ? `?${queryParams}` : ''}`, {
      method: "GET",
      headers: { Cookie: cookieHeader },
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json?.message || "Failed to fetch my products");
    return json as IProductResponse;
  } catch (error: any) {
    console.error("Error fetching my products:", error);
    return {
      success: false,
      message: error?.message || "Failed to fetch products.",
      data: { data: [], meta: { limit: 10, current_Page: 1, total_page: 0, total: 0 } },
    };
  }
};

/**
 * Updates an existing product.
 */
export const updateProduct = async (id: string, formData: FormData): Promise<ISingleProductResponse> => {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PATCH",
      headers: { Cookie: cookieHeader },
      body: formData,
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json?.message || "Failed to update product");
    return json as ISingleProductResponse;
  } catch (error: any) {
    console.error("Error updating product:", error);
    throw error;
  }
};

/**
 * Fetches user's upvoted products.
 */
export const getUpvotedProducts = async (): Promise<IProduct[]> => {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const res = await fetch(`${API_BASE_URL}/products/upvoted`, {
      headers: { Cookie: cookieHeader },
      next: { revalidate: 60 },
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json?.message || "Failed to fetch upvoted products");
    return json?.data?.data || [];
  } catch (error: any) {
    console.error("Error fetching upvoted products:", error);
    return [];
  }
};

/**
 * Deletes a product.
 */
export const deleteProduct = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: { Cookie: cookieHeader },
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json?.message || "Failed to delete product");
    return json;
  } catch (error: any) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
