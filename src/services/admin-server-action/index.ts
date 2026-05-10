"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { 
  IUserResponse, 
  IUpdateUserStatusPayload, 
  IUpdateUserRolePayload 
} from "@/types/Dashboard/admin-dashboard-types/users-managements.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Fetches all users across all roles with filtering and pagination.
 */
export async function getAllUsers(
  page: number = 1,
  limit: number = 10,
  searchTerm?: string,
  sortBy: string = "createdAt",
  sortOrder: string = "desc",
  role?: string,
  status?: string
): Promise<IUserResponse> {
  try {
    const endpoint = role === "USER" ? `${BASE_URL}/loginUser` : `${BASE_URL}/users`;
    const url = new URL(endpoint);

    url.searchParams.set("page", page.toString());
    url.searchParams.set("limit", limit.toString());
    if (searchTerm) url.searchParams.set("searchTerm", searchTerm);
    if (role && role !== "all" && role !== "USER") url.searchParams.set("role", role);
    if (status && status !== "all") url.searchParams.set("status", status);
    url.searchParams.set("sortBy", sortBy);
    url.searchParams.set("sortOrder", sortOrder);

    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Fetch users error:", error);
    return {
      success: false,
      message: "Internal server error while fetching users",
      data: { data: [], meta: { limit: 10, current_Page: 1, total_page: 0, total: 0 } }
    };
  }
}

/**
 * Updates a user's status (ACTIVE, INACTIVE, SUSPENDED).
 */
export async function updateUserStatus(userId: string, payload: IUpdateUserStatusPayload) {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");

    const res = await fetch(`${BASE_URL}/admin/change-user-status/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    revalidatePath("/admin/dashboard/allUser-managements");
    return data;
  } catch (error) {
    return { success: false, message: "Failed to update user status" };
  }
}

/**
 * Updates a user's role (ADMIN, MODERATOR, USER).
 */
export async function updateUserRole(userId: string, payload: IUpdateUserRolePayload) {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");

    const res = await fetch(`${BASE_URL}/admin/change-user-role/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    revalidatePath("/admin/dashboard/allUser-managements");
    return data;
  } catch (error) {
    return { success: false, message: "Failed to update user role" };
  }
}

/**
 * Deletes a user based on their role.
 */
export async function deleteUser(userId: string, role: string) {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");

    let endpoint = "";
    if (role === "ADMIN") endpoint = `${BASE_URL}/admin/${userId}`;
    else if (role === "MODERATOR") endpoint = `${BASE_URL}/moderator/${userId}`;
    else {
      // For general USER, we might need a general delete endpoint or just set status to INACTIVE
      // Based on my research, there isn't a direct DELETE /users/:id for normal users yet.
      // We will fallback to changing status to INACTIVE if no delete endpoint exists.
      return { success: false, message: "Direct deletion for USER role is not implemented in the backend. Please use status management." };
    }

    const res = await fetch(endpoint, {
      method: "DELETE",
      headers: {
        Cookie: cookieHeader,
      },
    });

    const data = await res.json();
    revalidatePath("/admin/dashboard/allUser-managements");
    return data;
  } catch (error) {
    return { success: false, message: "Failed to delete user" };
  }
}

/**
 * Fetches all admins with filtering and pagination.
 */
export async function getAllAdmins(
  page: number = 1,
  limit: number = 10,
  searchTerm?: string,
  sortBy: string = "createdAt",
  sortOrder: string = "desc",
  status?: string,
  role?: string
) {
  try {
    const url = new URL(`${BASE_URL}/admin`);
    url.searchParams.set("page", page.toString());
    url.searchParams.set("limit", limit.toString());
    if (searchTerm) url.searchParams.set("searchTerm", searchTerm);
    if (status && status !== "all") url.searchParams.set("status", status);
    if (role && role !== "all") url.searchParams.set("role", role);
    url.searchParams.set("sortBy", sortBy);
    url.searchParams.set("sortOrder", sortOrder);

    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Fetch admins error:", error);
    return {
      success: false,
      message: "Internal server error while fetching admins",
      data: { data: [], meta: { limit: 10, current_Page: 1, total_page: 0, total: 0 } }
    };
  }
}

/**
 * Fetches all moderators with filtering and pagination.
 */
export async function getAllModerators(
  page: number = 1,
  limit: number = 10,
  searchTerm?: string,
  sortBy: string = "createdAt",
  sortOrder: string = "desc",
  status?: string,
  gender?: string
) {
  try {
    const url = new URL(`${BASE_URL}/moderator/query`);
    url.searchParams.set("page", page.toString());
    url.searchParams.set("limit", limit.toString());
    if (searchTerm) url.searchParams.set("searchTerm", searchTerm);
    if (status && status !== "all") url.searchParams.set("status", status);
    if (gender && gender !== "all") url.searchParams.set("gender", gender);
    url.searchParams.set("sortBy", sortBy);
    url.searchParams.set("sortOrder", sortOrder);

    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Fetch moderators error:", error);
    return {
      success: false,
      message: "Internal server error while fetching moderators",
      data: { data: [], meta: { limit: 10, current_Page: 1, total_page: 0, total: 0 } }
    };
  }
}

/**
 * Creates a new admin record.
 */
export async function createAdmin(payload: any) {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");

    const res = await fetch(`${BASE_URL}/users/create-admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    revalidatePath("/admin/dashboard/admins-managements");
    return data;
  } catch (error) {
    console.error("Create admin error:", error);
    return {
      success: false,
      message: "Internal server error while creating admin",
    };
  }
}

/**
 * Creates a new moderator record.
 */
export async function createModerator(payload: any) {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");

    const res = await fetch(`${BASE_URL}/users/create-moderator`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    revalidatePath("/admin/dashboard/moderators-managements");
    return data;
  } catch (error) {
    console.error("Create moderator error:", error);
    return {
      success: false,
      message: "Internal server error while creating moderator",
    };
  }
}

/**
 * Fetches all products with filtering and pagination.
 */
export async function getAllProducts(
  page: number = 1,
  limit: number = 10,
  searchTerm?: string,
  status?: string,
  isFeatured?: boolean | string,
  sortBy: string = "createdAt",
  sortOrder: string = "desc",
  reportedStatus?: boolean | string,
  tagName?: string
) {
  try {
    const url = new URL(`${BASE_URL}/products`);
    url.searchParams.set("page", page.toString());
    url.searchParams.set("limit", limit.toString());
    if (searchTerm) url.searchParams.set("searchTerm", searchTerm);
    if (status && status !== "all") url.searchParams.set("status", status);
    if (isFeatured !== undefined && isFeatured !== "all") {
      url.searchParams.set("isFeatured", isFeatured.toString());
    }
    if (reportedStatus !== undefined && reportedStatus !== "all") {
      url.searchParams.set("reportedStatus", reportedStatus.toString());
    }
    if (tagName) {
      url.searchParams.set("tagName", tagName);
    }
    url.searchParams.set("sortBy", sortBy);
    url.searchParams.set("sortOrder", sortOrder);

    const res = await fetch(url.toString(), {
      method: "GET",
      cache: "no-store",
    });

    return await res.json();
  } catch (error) {
    console.error("Fetch products error:", error);
    return { success: false, message: "Failed to fetch products" };
  }
}

/**
 * Updates a product's status or featured flag.
 */
export async function updateProduct(productId: string, payload: { status?: string; isFeatured?: boolean }) {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");

    const res = await fetch(`${BASE_URL}/products/${productId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    revalidatePath("/admin/dashboard/products");
    return data;
  } catch (error) {
    console.error("Update product error:", error);
    return { success: false, message: "Failed to update product" };
  }
}

/**
 * Fetches single product details.
 */
export async function getProductDetails(productId: string) {
  try {
    const res = await fetch(`${BASE_URL}/products/${productId}`, {
      cache: "no-store",
    });
    return await res.json();
  } catch (error) {
    console.error("Get product details error:", error);
    return { success: false, message: "Failed to get product details" };
  }
}

/**
 * Fetches all tags with optional filtering.
 */
export async function getAllTags(name?: string) {
  try {
    const url = new URL(`${BASE_URL}/tags`);
    if (name) url.searchParams.set("name", name);

    const res = await fetch(url.toString(), {
      cache: "no-store",
    });
    return await res.json();
  } catch (error) {
    console.error("Fetch tags error:", error);
    return { success: false, message: "Failed to fetch tags" };
  }
}

export async function createTag(payload: { name: string }) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");

    const res = await fetch(`${BASE_URL}/tags/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    revalidatePath("/admin/dashboard/tags-managements");
    return data;
  } catch (error) {
    console.error("Create tag error:", error);
    return { success: false, message: "Failed to create tag" };
  }
}

export async function updateTag(id: string, payload: { name: string }) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");

    const res = await fetch(`${BASE_URL}/tags/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    revalidatePath("/admin/dashboard/tags-managements");
    return data;
  } catch (error) {
    console.error("Update tag error:", error);
    return { success: false, message: "Failed to update tag" };
  }
}

export async function deleteTag(id: string) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");

    const res = await fetch(`${BASE_URL}/tags/${id}`, {
      method: "DELETE",
      headers: {
        Cookie: cookieHeader,
      },
    });
    const data = await res.json();
    revalidatePath("/admin/dashboard/tags-managements");
    return data;
  } catch (error) {
    console.error("Delete tag error:", error);
    return { success: false, message: "Failed to delete tag" };
  }
}

/**
 * Fetches all coupons with filtering and pagination.
 */
export async function getAllCoupons(
  page: number = 1,
  limit: number = 10,
  searchTerm?: string,
  isActive?: string,
  sortBy: string = "createdAt",
  sortOrder: string = "desc"
) {
  try {
    const url = new URL(`${BASE_URL}/coupons`);
    url.searchParams.set("page", page.toString());
    url.searchParams.set("limit", limit.toString());
    if (searchTerm) url.searchParams.set("searchTerm", searchTerm);
    if (isActive && isActive !== "all") url.searchParams.set("isActive", isActive);
    if (sortBy) url.searchParams.set("sortBy", sortBy);
    if (sortOrder) url.searchParams.set("sortOrder", sortOrder);

    const res = await fetch(url.toString(), {
      cache: "no-store",
    });
    return await res.json();
  } catch (error) {
    console.error("Fetch coupons error:", error);
    return { success: false, message: "Failed to fetch coupons" };
  }
}

/**
 * Creates a new coupon.
 */
export async function createCoupon(payload: any) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");

    const res = await fetch(`${BASE_URL}/coupons/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    revalidatePath("/admin/dashboard/coupons-managements");
    revalidatePath("/");
    return data;
  } catch (error) {
    console.error("Create coupon error:", error);
    return { success: false, message: "Failed to create coupon" };
  }
}

/**
 * Updates an existing coupon.
 */
export async function updateCoupon(id: string, payload: any) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");

    const res = await fetch(`${BASE_URL}/coupons/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    revalidatePath("/admin/dashboard/coupons-managements");
    revalidatePath("/");
    return data;
  } catch (error) {
    console.error("Update coupon error:", error);
    return { success: false, message: "Failed to update coupon" };
  }
}

/**
 * Deletes a coupon.
 */
export async function deleteCoupon(id: string) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");

    const res = await fetch(`${BASE_URL}/coupons/${id}`, {
      method: "DELETE",
      headers: {
        Cookie: cookieHeader,
      },
    });
    const data = await res.json();
    revalidatePath("/admin/dashboard/coupons-managements");
    revalidatePath("/");
    return data;
  } catch (error) {
    console.error("Delete coupon error:", error);
    return { success: false, message: "Failed to delete coupon" };
  }
}
