"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutUser } from "../../../services/authService";
import { UserInfo } from "@/types/user.types";
import { Key, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface UserDropdownProps {
    userInfo: UserInfo;
}

const UserDropdown = ({ userInfo }: UserDropdownProps) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const handleLogout = async () => {
        try {
            const result = await logoutUser();

            if (result.success) {
                queryClient.clear();
                toast.success("Logged out successfully");
                router.push("/login");
                router.refresh();
            } else {
                toast.error(result.message || "Failed to logout");
            }
        } catch {
            toast.error("An error occurred during logout");
        }
    };

    const userInitial = userInfo?.name?.charAt(0)?.toUpperCase() || "?";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-10 w-10 hover:bg-[#FF5E3A]/10 dark:hover:bg-[#FF6B4A]/20 transition border-[#FF5E3A] dark:border-[#FF6B4A]"
                >
                    <span className="text-sm font-semibold text-[#FF5E3A] dark:text-[#FF6B4A]">{userInitial}</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-64 p-2 rounded-xl shadow-lg bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800"
            >
                <DropdownMenuLabel className="px-2 py-2">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold leading-none text-gray-900 dark:text-gray-100">
                            {userInfo?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {userInfo?.email}
                        </p>
                        <p className="text-xs text-[#FF5E3A] dark:text-[#FF6B4A] capitalize font-medium">
                            {userInfo?.role?.toLowerCase().replace("_", " ")}
                        </p>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800" />

                <DropdownMenuItem asChild>
                    <Link
                        href="/my-profile"
                        className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300 hover:text-[#FF5E3A] dark:hover:text-[#FF6B4A] hover:bg-[#FF5E3A]/10 dark:hover:bg-[#FF6B4A]/10"
                    >
                        <User className="h-4 w-4" />
                        <span>My Profile</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link
                        href="/change-password"
                        className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300 hover:text-[#FF5E3A] dark:hover:text-[#FF6B4A] hover:bg-[#FF5E3A]/10 dark:hover:bg-[#FF6B4A]/10"
                    >
                        <Key className="h-4 w-4" />
                        <span>Change Password</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800" />

                <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/50"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserDropdown;