export interface IAdminDashboardStats {
  productStats: {
    approved: number;
    pending: number;
    rejected: number;
    total: number;
  };
  userStats: {
    active: number;
    inactive: number;
    suspended: number;
    total: number;
  };
  adminStats: {
    active: number;
    inactive: number;
  };
  moderatorStats: {
    active: number;
    inactive: number;
  };
  subscriptionStats: {
    verified: number;
    pending: number;
  };
  engagementStats: {
    totalVotes: number;
    totalReports: number;
    totalReviews: number;
  };
  revenueStats: {
    totalRevenue: number;
    totalPayments: number;
  };
  pieChartData: {
    status: string;
    count: number;
  }[];
  barChartData: {
    month: Date;
    count: number;
  }[];
}

