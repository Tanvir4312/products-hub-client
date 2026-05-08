"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavSection } from "@/types/navItems.types";
import { UserInfo } from "@/types/user.types";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import DashboardMobileSidebar from "./DashboardMobileSidebar";
import UserDropdown from "./UserDropdown";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

interface DashboardNavbarProps {
    userInfo: UserInfo;
    navItems: NavSection[];
    dashboardHome: string;
}

const DashboardNavbarContent = ({ dashboardHome, navItems, userInfo }: DashboardNavbarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkSmallerScreen = () => {
            setIsMobile(window.innerWidth < 768);
        }

        checkSmallerScreen();
        window.addEventListener("resize", checkSmallerScreen);

        return () => {
            window.removeEventListener("resize", checkSmallerScreen);
        };
    }, []);

    return (
        <div className="flex items-center w-full px-4 md:px-6 lg:px-10 py-1.5 border-b bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
            <div>
                <Sheet open={isOpen && isMobile} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild className="md:hidden">
                        <Button 
                            variant={"outline"} 
                            size={"icon"} 
                            className="border-[#FF5E3A] dark:border-[#FF6B4A] text-[#FF5E3A] dark:text-[#FF6B4A] hover:bg-[#FF5E3A]/10 dark:hover:bg-[#FF6B4A]/20"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>

                    <SheetContent side="left" className="w-64 p-0 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                        <DashboardMobileSidebar userInfo={userInfo} dashboardHome={dashboardHome} navItems={navItems} />
                    </SheetContent>
                </Sheet>
            </div>

            <div className="flex items-center justify-end gap-2 w-full">
                <ThemeToggle />
                <div className="flex items-center gap-2">
                    <UserDropdown userInfo={userInfo} />
                </div>
            </div>
        </div>
    );
};

export default DashboardNavbarContent;