export interface ICoupon {
  id: string;
  couponCode: string;
  description: string;
  discount: number;
  expiryDate: string;
  usageLimit?: number;
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
      total: number;
      page: number;
      limit: number;
      total_page: number;
    };
  };
}
