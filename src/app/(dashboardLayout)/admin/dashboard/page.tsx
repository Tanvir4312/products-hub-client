import AdminDashboardStats from '@/components/modules/Dasboard/Admin_Dashboard/stats/AdminDashboardStats';
import { getAdminDashboardStats } from '@/services/admin-srever-action/adminDashboard.service';
import ActivityFeed from "@/components/modules/Home_Page/ActivityFeed/ActivityFeed";

import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import React from 'react';

const AdminDasboardPage = async () => {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["admin-dashboard-stats"],
        queryFn: getAdminDashboardStats,
        staleTime: 1 * 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
    return (
        <div className="space-y-8">
            <HydrationBoundary state={dehydrate(queryClient)}>
                <AdminDashboardStats />
            </HydrationBoundary>
            
            {/* Live Activity Feed - Admin Only */}
            <section className="px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-8">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/10 mb-4">
                            Real-Time Updates
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                            Live <span className="text-primary italic font-serif">Activity</span>
                        </h2>
                        <p className="text-muted-foreground text-base font-medium mt-3 max-w-2xl mx-auto">
                            Watch the community in action as new products launch and votes come in.
                        </p>
                    </div>
                    <ActivityFeed />
                </div>
            </section>
        </div>
    );
};

export default AdminDasboardPage;