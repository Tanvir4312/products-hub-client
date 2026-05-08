"use client";

import { Button } from "@/components/ui/button";
import { UserRole } from "@/types/Dashboard/enums";

interface DemoLoginButtonsProps {
  onQuickLogin: (email: string, password: string) => void;
  isLoading: boolean;
}

const demoAccounts = [
  {
    role: "SUPER ADMIN",
    email: "superadmin@gmail.com",
    password: "password1234",
    badge: "VIP",
  },
  {
    role: "ADMIN",
    email: "admin1@gmail.com",
    password: "password123",
    badge: "Admin",
  },
  {
    role: "MODERATOR",
    email: "moderator1@gmail.com",
    password: "password123",
    badge: "Mod",
  },
  {
    role: "USER",
    email: "user1@gmail.com",
    password: "password1234",
    badge: "Maker",
  },
];

const DemoLoginButtons = ({ onQuickLogin, isLoading }: DemoLoginButtonsProps) => {
  return (
    <div className="mt-8 space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-4 bg-white dark:bg-[#0F172A] text-gray-400 uppercase tracking-wide font-semibold">
            Demo Access
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {demoAccounts.map((account) => (
          <Button
            key={account.role}
            variant="outline"
            disabled={isLoading}
            onClick={() => onQuickLogin(account.email, account.password)}
            className="flex flex-col items-center justify-center gap-0.5 h-auto py-2.5 px-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:bg-[#FF5E3A] hover:border-[#FF5E3A] hover:text-white transition-all group"
          >
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 group-hover:text-white">
              {account.role}
            </span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 group-hover:text-white/80">
              {account.badge}
            </span>
          </Button>
        ))}
      </div>

      <p className="text-center text-[11px] text-gray-400 dark:text-gray-500">
        🔑 Click any role to explore Products Hunt as a{' '}
        <span className="font-semibold text-[#FF5E3A]">Maker</span>,{' '}
        <span className="font-semibold text-[#FF5E3A]">Moderator</span>, or{' '}
        <span className="font-semibold text-[#FF5E3A]">Admin</span>
      </p>
    </div>
  );
};

export default DemoLoginButtons;