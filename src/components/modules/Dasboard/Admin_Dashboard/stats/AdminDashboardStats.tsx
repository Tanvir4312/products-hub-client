"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Package,
  Shield,
  UserCog,
  CreditCard,
  Heart,
  MessageSquare,
  Flag,
  DollarSign,
  TrendingUp,
  Activity,
  Zap,
} from "lucide-react";


import DashboardPieChart from "@/components/shared/charts/DashboardPieChart";
import DashboardBarChart from "@/components/shared/charts/DashboardBarChart";
import SectionHeader from "@/components/shared/dashboard/SectionHeader";
import { getAdminDashboardStats } from "@/services/admin-srever-action/adminDashboard.service";
import { IAdminDashboardStats } from "@/types/Dashboard/admin-dashboard-types/admins-dashboardStat.types";
import StatsCard from "@/components/shared/statsCard/statsCard";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

const AdminDashboardStats = () => {
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const { data: adminDashboardStats, isLoading, isError } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: getAdminDashboardStats,
    refetchOnWindowFocus: "always",
  });

  // Only set timestamp on client side to avoid hydration mismatch
  useEffect(() => {
    setLastUpdated(new Date().toLocaleString());
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 animate-pulse" />
          <Activity className="h-8 w-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
        </div>
        <p className="text-muted-foreground font-medium animate-pulse">
          Loading dashboard statistics...
        </p>
      </div>
    );
  }

  if (isError || adminDashboardStats?.success === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-destructive/10 border border-destructive/20 rounded-3xl p-8 text-center max-w-md"
        >
          <div className="h-16 w-16 bg-destructive/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Flag className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="text-xl font-bold text-destructive mb-2">
            Failed to Load Dashboard
          </h3>
          <p className="text-muted-foreground text-sm">
            {adminDashboardStats?.message ||
              "Unable to fetch statistics. Please check your connection and try again."}
          </p>
        </motion.div>
      </div>
    );
  }

  const data = adminDashboardStats?.data as IAdminDashboardStats;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-10"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Real-time insights and analytics for your platform
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-medium border border-primary/20">
          <Zap className="h-4 w-4" />
          <span>Live Updates</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </motion.div>

      {/* Key Metrics - Revenue & Engagement */}
      <motion.section variants={itemVariants} className="space-y-4">
        <SectionHeader
          title="Key Performance Metrics"
          iconName="TrendingUp"
          description="Financial and engagement overview"
          indicatorColor="bg-emerald-500"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Revenue"
            value={`$${data?.revenueStats?.totalRevenue?.toLocaleString() || 0}`}
            iconName="DollarSign"
            description={`${data?.revenueStats?.totalPayments || 0} total payments`}
            className="bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 dark:from-emerald-950/20 dark:to-emerald-900/10 border-emerald-200/50 dark:border-emerald-800/30"
          />
          <StatsCard
            title="Total Users"
            value={data?.userStats?.total || 0}
            iconName="Users"
            description={`${data?.userStats?.active || 0} active users`}
            className="bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200/50 dark:border-blue-800/30"
          />
          <StatsCard
            title="Total Products"
            value={data?.productStats?.total || 0}
            iconName="Package"
            description={`${data?.productStats?.approved || 0} approved`}
            className="bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-950/20 dark:to-purple-900/10 border-purple-200/50 dark:border-purple-800/30"
          />
          <StatsCard
            title="Total Votes"
            value={data?.engagementStats?.totalVotes?.toLocaleString() || 0}
            iconName="Heart"
            description={`${data?.engagementStats?.totalReviews || 0} reviews`}
            className="bg-gradient-to-br from-rose-50/50 to-rose-100/30 dark:from-rose-950/20 dark:to-rose-900/10 border-rose-200/50 dark:border-rose-800/30"
          />
        </div>
      </motion.section>

      {/* Product Statistics */}
      <motion.section variants={itemVariants} className="space-y-4">
        <SectionHeader
          title="Product Statistics"
          iconName="Package"
          description="Product submission and approval status"
          indicatorColor="bg-purple-500"
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <StatsCard
            title="Approved"
            value={data?.productStats?.approved || 0}
            iconName="CheckCircle"
            description="Live products"
            className="bg-muted/50"
          />
          <StatsCard
            title="Pending"
            value={data?.productStats?.pending || 0}
            iconName="Clock"
            description="Awaiting review"
            className="bg-muted/50"
          />
          <StatsCard
            title="Rejected"
            value={data?.productStats?.rejected || 0}
            iconName="XCircle"
            description="Not approved"
            className="bg-muted/50"
          />
          <StatsCard
            title="Reports"
            value={data?.engagementStats?.totalReports || 0}
            iconName="Flag"
            description="Flagged items"
            className="bg-muted/50"
          />
        </div>
      </motion.section>

      {/* User Management */}
      <motion.section variants={itemVariants} className="space-y-4">
        <SectionHeader
          title="User Management"
          iconName="Users"
          description="User account status breakdown"
          indicatorColor="bg-blue-500"
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <StatsCard
            title="Active"
            value={data?.userStats?.active || 0}
            iconName="UserCheck"
            description="Active accounts"
            className="bg-muted/50"
          />
          <StatsCard
            title="Inactive"
            value={data?.userStats?.inactive || 0}
            iconName="UserX"
            description="Inactive accounts"
            className="bg-muted/50"
          />
          <StatsCard
            title="Suspended"
            value={data?.userStats?.suspended || 0}
            iconName="ShieldAlert"
            description="Suspended accounts"
            className="bg-muted/50"
          />
          <StatsCard
            title="Total"
            value={data?.userStats?.total || 0}
            iconName="Users"
            description="All registered"
            className="bg-muted/50"
          />
        </div>
      </motion.section>

      {/* Staff Management - Admins & Moderators */}
      <motion.section variants={itemVariants} className="space-y-4">
        <SectionHeader
          title="Staff Management"
          iconName="Shield"
          description="Administrators and moderators overview"
          indicatorColor="bg-amber-500"
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <StatsCard
            title="Admins Active"
            value={data?.adminStats?.active || 0}
            iconName="Shield"
            description="Platform admins"
            className="bg-gradient-to-br from-amber-50/50 to-amber-100/30 dark:from-amber-950/20 dark:to-amber-900/10"
          />
          <StatsCard
            title="Admins Inactive"
            value={data?.adminStats?.inactive || 0}
            iconName="ShieldOff"
            description="Inactive admins"
            className="bg-muted/50"
          />
          <StatsCard
            title="Moderators Active"
            value={data?.moderatorStats?.active || 0}
            iconName="UserCog"
            description="Content moderators"
            className="bg-gradient-to-br from-cyan-50/50 to-cyan-100/30 dark:from-cyan-950/20 dark:to-cyan-900/10"
          />
          <StatsCard
            title="Moderators Inactive"
            value={data?.moderatorStats?.inactive || 0}
            iconName="UserX"
            description="Inactive moderators"
            className="bg-muted/50"
          />
        </div>
      </motion.section>

      {/* Subscription Stats */}
      <motion.section variants={itemVariants} className="space-y-4">
        <SectionHeader
          title="Subscription Overview"
          iconName="CreditCard"
          description="Premium subscription status"
          indicatorColor="bg-pink-500"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <StatsCard
            title="Verified Subscriptions"
            value={data?.subscriptionStats?.verified || 0}
            iconName="BadgeCheck"
            description="Active premium users"
            className="bg-gradient-to-br from-pink-50/50 to-pink-100/30 dark:from-pink-950/20 dark:to-pink-900/10 border-pink-200/50 dark:border-pink-800/30"
          />
          <StatsCard
            title="Pending Subscriptions"
            value={data?.subscriptionStats?.pending || 0}
            iconName="Clock"
            description="Awaiting verification"
            className="bg-muted/50"
          />
          <StatsCard
            title="Total Subscriptions"
            value={(data?.subscriptionStats?.verified || 0) + (data?.subscriptionStats?.pending || 0)}
            iconName="CreditCard"
            description="All subscriptions"
            className="bg-muted/50"
          />
        </div>
      </motion.section>

      {/* Charts Section */}
      <motion.section variants={itemVariants} className="space-y-4">
        <SectionHeader
          title="Analytics & Trends"
          iconName="BarChart3"
          description="Visual data representation"
          indicatorColor="bg-indigo-500"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <DashboardPieChart
            data={data?.pieChartData || []}
            title="Status Distribution"
            description="Breakdown by category"
          />
          <DashboardBarChart
            data={data?.barChartData || []}
            title="Monthly Growth"
            description="Activity over time"
          />
        </div>
      </motion.section>

      {/* Footer Info */}
      {lastUpdated && (
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-4"
        >
          <Activity className="h-3 w-3" />
          <span>Last updated: {lastUpdated}</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminDashboardStats;
