export interface IProduct {
  id: string;
  name: string;
  description: string;
  photo: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  isFeatured: boolean;
  reportedStatus: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  links?: string;
  owner: {
    id: string;
    name: string;
    email: string;
    profilePhoto: string | null;
  };
  tags: {
    tag: {
      id: string;
      name: string;
    };
  }[];
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

export interface IProductDetailsResponse {
  success: boolean;
  message: string;
  data: IProduct;
}
