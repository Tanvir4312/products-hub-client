import { getDefaultDashboardRoute } from '../../../lib/authUtils';
import { getNavItemsByRole } from '@/lib/navItems';
import { getUserInfo } from '../../../services/authService';
import React from 'react';
import DashboardNavbarContent from './DashboardNavbarContent';

const DashboardNavbar = async () => {
    const userInfo = await getUserInfo()

    const navItems = getNavItemsByRole(userInfo?.role)
    const dashboardHome = getDefaultDashboardRoute(userInfo?.role)
    return (
        <div>
            <DashboardNavbarContent userInfo={userInfo} navItems={navItems} dashboardHome={dashboardHome} />
        </div>
    );
};

export default DashboardNavbar;