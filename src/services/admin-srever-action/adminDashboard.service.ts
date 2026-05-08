"use server"

import { httpClient } from "@/lib/axios/httpClient"
import { IAdminDashboardStats } from "@/types/Dashboard/admin-dashboard-types/admins-dashboardStat.types";



export const getAdminDashboardStats = async () => {
    try {
        const response = await httpClient.get<IAdminDashboardStats>("/stats")
        return response;
    } catch (error: any) {
        return {
            success: false,
            message: error?.response?.data?.message || "Unauthorized or unknown error fetching stats",
            data: null
        }
    }
}

