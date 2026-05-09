/**
 * Product-related types strictly aligned with the backend Prisma schema and service responses.
 */

export type ProductStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ITag {
  id: string;
  name: string;
}

export interface IProductTag {
  productId: string;
  tagId: string;
  tag: ITag;
}

export interface IReview {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    profilePhoto: string | null;
  };
  product?: {
    id: string;
    name: string;
    photo: string;
    description: string;
  };
}

export interface IReport {
  id: string;
  userId?: string;
  reason: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    profilePhoto: string | null;
  };
}

export interface IProduct {
  id: string;
  name: string;
  photo: string;
  description: string;
  links: string;
  votes: number;
  isFeatured: boolean;
  isDeleted: boolean;
  status: ProductStatus;
  report: number;
  reportedStatus: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations included in service calls
  owner?: {
    id: string;
    name: string;
    email: string;
    profilePhoto: string | null;
  };
  tags?: IProductTag[];
  reviews?: IReview[];
  reportedUsers?: IReport[];
  votedUsers?: { userId: string }[];
  
  // Aggregate counts
  _count: {
    votedUsers: number;
    reportedUsers: number;
    reviews: number;
  };
}

export interface IProductResponse {
  success: boolean;
  message: string;
  data: {
    data: IProduct[];
    meta: {
      limit: number;
      current_Page: number;
      total_page: number;
      total: number;
    };
  };
}

export interface ISingleProductResponse {
  success: boolean;
  message: string;
  data: IProduct;
}
