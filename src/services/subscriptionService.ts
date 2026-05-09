"use server"

import { httpClient } from "@/lib/axios/httpClient";

export interface ISubscription {
  id: string;
  email: string;
  name: string;
  isSubscribed: boolean;
  paymentVerified: boolean;
  status: string;
  subscriptionDate: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    profilePhoto: string;
  };
  payments?: {
    id: string;
    price: number;
    transactionId: string;
    subscriptionDate: string;
    createdAt: string;
  }[];
}

export const subscribe = async (couponCode?: string) => {
  try {
    const response = await httpClient.post("/subscription/subscribe", { couponCode });
    return response;
  } catch (error: any) {
    console.error("Error subscribing:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to subscribe.",
    };
  }
};

export const getMySubscription = async (): Promise<{ success: boolean; data?: ISubscription; message?: string }> => {
  try {
    const response = await httpClient.get("/subscription/my-subscription");
    return response as unknown as { success: boolean; data: ISubscription };
  } catch (error: any) {
    console.error("Error fetching my subscription:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to fetch subscription data.",
    };
  }
};
