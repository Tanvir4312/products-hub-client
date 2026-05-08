"use client";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { getIconComponent } from '@/lib/iconMapper';
import { cn } from '@/lib/utils';
import { NavSection } from '@/types/navItems.types';
import { UserInfo } from '@/types/user.types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface DashboardSidebarContentProps {
    userInfo: UserInfo;
    navItems: NavSection[];
    dashboardHome: string;
}

const DashboardSidebarContent = ({ userInfo, navItems, dashboardHome }: DashboardSidebarContentProps) => {
    const pathname = usePathname();
    return (
        <div className="hidden md:flex h-full w-64 flex-col border-r bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 overflow-y-auto">
            {/* Logo / Brand */}
            <div className="flex h-16 items-center border-b px-6 py-3 border-gray-200 dark:border-gray-800">
                <Link href={dashboardHome}>
                    <span className="text-xl font-bold text-[#FF5E3A] dark:text-[#FF6B4A]">Products Hunt</span>
                </Link>
            </div>

            {/* Navigation Area */}
            <ScrollArea className="flex-1 px-3 py-4">
                <nav className="space-y-6">
                    {navItems?.map((section, sectionId) => (
                        <div key={sectionId}>
                            {section.title && (
                                <h4 className="mb-2 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {section.title}
                                </h4>
                            )}

                            <div className="space-y-1">
                                {section.items?.map((item, id) => {
                                    const isActive = pathname === item.href;
                                    const Icon = getIconComponent(item.icon);

                                    return (
                                        <Link
                                            href={item.href}
                                            key={id}
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                                                isActive
                                                    ? "bg-[#FF5E3A] dark:bg-[#FF6B4A] text-white"
                                                    : "text-gray-700 dark:text-gray-300 hover:bg-[#FF5E3A]/10 dark:hover:bg-[#FF6B4A]/10 hover:text-[#FF5E3A] dark:hover:text-[#FF6B4A]",
                                            )}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    );
                                })}
                            </div>

                            {sectionId < (navItems?.length || 0) - 1 && (
                                <Separator className="my-4 bg-gray-200 dark:bg-gray-800" />
                            )}
                        </div>
                    ))}
                </nav>
            </ScrollArea>

            {/* User Info At Bottom */}
            <div className="border-t px-3 py-4 border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#FF5E3A]/10 dark:bg-[#FF6B4A]/20 flex items-center justify-center">
                        <span className="text-sm font-semibold text-[#FF5E3A] dark:text-[#FF6B4A]">
                            {userInfo?.name?.charAt(0).toUpperCase()}
                        </span>
                    </div>

                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">{userInfo?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {userInfo?.role?.toLocaleLowerCase().replace("_", " ")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardSidebarContent;