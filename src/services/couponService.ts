"use server"

import { httpClient } from "@/lib/axios/httpClient";

export interface ICoupon {
  id: string;
  couponCode: string;
  description: string;
  discount: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICouponResponse {
  success: boolean;
  message: string;
  data: {
    data: ICoupon[];
    meta: {
      limit: number;
      current_Page: number;
      total_page: number;
      total: number;
    };
  };
}

/**
 * Fetches all active coupons for the special offers section.
 */
export const getActiveCoupons = async (limit: number = 4): Promise<ICouponResponse> => {
  try {
    const response = await httpClient.get<ICouponResponse>(`/coupons?isActive=true&limit=${limit}&sortBy=createdAt&sortOrder=desc`);
    return response as unknown as ICouponResponse;
  } catch (error: any) {
    console.error("Error fetching active coupons:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to fetch active coupons.",
      data: {
        data: [],
        meta: { limit: 0, current_Page: 0, total_page: 0, total: 0 }
      },
    };
  }
};
/**
 * Validates a coupon code.
 */
export const validateCoupon = async (couponCode: string): Promise<{ success: boolean; message: string; data?: ICoupon }> => {
  try {
    const response = await httpClient.post<{ success: boolean; message: string; data: ICoupon }>(`/coupons/validate-coupon`, { couponCode });
    return response as unknown as { success: boolean; message: string; data: ICoupon };
  } catch (error: any) {
    console.error("Error validating coupon:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Coupon code not valid",
    };
  }
};
