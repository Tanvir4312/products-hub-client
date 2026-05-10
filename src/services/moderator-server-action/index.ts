"use server";

import { IApiResponse, IProduct, IProductResponse, IUpdateProductPayload } from "@/types/Dashboard/moderator-dashboard-types";
import { revalidatePath } from "next/cache";


const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Fetches all products for the moderator review queue.
 * Allows filtering by status (e.g., PENDING) and pagination.
 */
export async function getAllProductsForReview(
  page: number = 1,
  limit: number = 10,
  status?: string,
  isFeatured?: boolean,
  reportedStatus?: boolean,
  sortBy?: string,
  sortOrder?: string
): Promise<IProductResponse> {
  try {
    const url = new URL(`${BASE_URL}/products`);
    url.searchParams.set("page", page.toString());
    url.searchParams.set("limit", limit.toString());
    if (status) url.searchParams.set("status", status);
    if (isFeatured !== undefined) url.searchParams.set("isFeatured", isFeatured.toString());
    if (reportedStatus !== undefined) url.searchParams.set("reportedStatus", reportedStatus.toString());
    if (sortBy) url.searchParams.set("sortBy", sortBy);
    if (sortOrder) url.searchParams.set("sortOrder", sortOrder);

    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    const res = await fetch(url.toString(), {
      next: { revalidate: 0 },
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching products for review:", error);
    return {
      success: false,
      message: "Could not retrieve products from server",
      data: {
        data: [],
        meta: {
          limit: 10,
          current_Page: 1,
          total_page: 0,
          total: 0
        }
      },
    };
  }
}

/**
 * Updates a product's information, featured status, or review status.
 */
export async function updateProductByModerator(
  id: string,
  payload: IUpdateProductPayload
): Promise<IApiResponse<IProduct | null>> {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (result.success) {
      revalidatePath("/moderator/dashboard/product-review-queue");
      revalidatePath("/moderator/dashboard/reported-products");
      revalidatePath("/");
      revalidatePath("/products");
    }

    return result;
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      success: false,
      message: "Failed to update product",
      data: null,
    };
  }
}

/**
 * Deletes a product by a moderator.
 */
export async function deleteProductByModerator(id: string): Promise<IApiResponse<null>> {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    const result = await res.json();

    if (result.success) {
      revalidatePath("/moderator/dashboard/product-review-queue");
      revalidatePath("/moderator/dashboard/reported-products");
      revalidatePath("/");
      revalidatePath("/products");
    }

    return result;
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      success: false,
      message: "Failed to delete product",
      data: null,
    };
  }
}
