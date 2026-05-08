import AdminDashboardStats from '@/components/modules/Dasboard/Admin_Dashboard/stats/AdminDashboardStats';
import { getAdminDashboardStats } from '@/services/admin-srever-action/adminDashboard.service';

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
        <div>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <AdminDashboardStats />
            </HydrationBoundary>
        </div>
    );
};

export default AdminDasboardPage;