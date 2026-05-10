import { IProduct, ProductStatus, IProductResponse } from "@/types/product.types";

export type { IProduct, ProductStatus, IProductResponse };

export interface IUpdateProductPayload {
  name?: string;
  description?: string;
  photo?: string;
  links?: string;
  isFeatured?: boolean;
  status?: ProductStatus;
  tagIds?: string[];
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
