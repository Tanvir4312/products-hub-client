"use client";

import { getDefaultDashboardRoute, UserRole } from "../../../../lib/authUtils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TiArrowSortedDown } from "react-icons/ti";
import { LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/services/authService";
import { toast } from "sonner";
import SearchModal from "./SearchModal";

const menuItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Products", path: "/products" },
  { name: "Tags", path: "/tags" },
];

const roleLinks: Record<string, { name: string; path: string }[]> = {
  ADMIN: [
    { name: "User Management", path: "/admin/dashboard/users-managements" },
    { name: "Moderator Management", path: "/admin/dashboard/moderators-management" },
  ],
  SUPER_ADMIN: [
    { name: "User Management", path: "/admin/dashboard/users-managements" },
    { name: "Moderator Management", path: "/admin/dashboard/moderators-management" },
  ],
  MODERATOR: [
    { name: "Product Review Queue", path: "/moderator/dashboard/product-review-queue" },
    { name: "Reported Products", path: "/moderator/dashboard/reported-products" },
  ],
  USER: [
    { name: "Add Product", path: "/user/dashboard/add-product" },
    { name: "My Products", path: "/user/dashboard/my-products" },
  ],
};

export default function Navbar({ userRole }: { userRole: UserRole }) {
  const [open, setOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  const defaulDashboard = getDefaultDashboardRoute(userRole);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      const result = await logoutUser();
      if (result.success) {
        queryClient.clear();
        toast.success("Logged out successfully");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to logout");
      }
    } catch {
      toast.error("An error occurred during logout");
    }
  };

  const toggleAccordion = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY > 123);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkSmallerScreen = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkSmallerScreen();
    window.addEventListener("resize", checkSmallerScreen);
    return () => window.removeEventListener("resize", checkSmallerScreen);
  }, []);

  return (
    <div className={`w-full z-50 transition-all duration-300 ${
      isFixed ? 'fixed top-0 shadow-lg' : 'relative'
    } bg-white dark:bg-[#0F172A] border-b border-gray-200 dark:border-gray-800`}>
      <div className="max-w-7xl mx-auto py-3 px-2 md:px-4 lg:px-0">
        <div className="flex gap-2 lg:gap-6 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-xl font-bold text-[#FF5E3A] dark:text-[#FF6B4A] cursor-pointer whitespace-nowrap">
              Products Hunt
            </h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center text-base font-medium text-gray-700 dark:text-gray-200">
            <div className="flex items-center gap-x-3 xl:gap-x-5">
              {menuItems?.map((item, i) => (
                <div key={i} className="relative group whitespace-nowrap">
                  {item.path ? (
                    <Link href={item.path}>
                      <div className="hover:text-[#FF5E3A] dark:hover:text-[#FF6B4A] cursor-pointer transition-all duration-300 px-2 py-2 rounded-md hover:bg-[#FF5E3A]/10 dark:hover:bg-[#FF6B4A]/10">
                        {item.name}
                      </div>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-1 cursor-pointer hover:text-[#FF5E3A] dark:hover:text-[#FF6B4A] transition-all duration-300 px-2 py-2 rounded-md hover:bg-[#FF5E3A]/10 dark:hover:bg-[#FF6B4A]/10">
                      {item.name}
                      <TiArrowSortedDown className="transition-transform group-hover:rotate-180" />
                    </div>
                  )}
                </div>
              ))}

              {/* Role-Based Links */}
              {userRole && roleLinks[userRole]?.map((link, index) => (
                <Link key={index} href={link.path}>
                  <div className="hover:text-[#FF5E3A] dark:hover:text-[#FF6B4A] cursor-pointer transition-all duration-300 px-2 py-2 rounded-md hover:bg-[#FF5E3A]/10 dark:hover:bg-[#FF6B4A]/10 whitespace-nowrap">
                    {link.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Section: Action Group */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Login / Dashboard */}
            <div className="hidden sm:flex items-center gap-x-4">
              {userRole && (
                <Link
                  href={defaulDashboard}
                  className="bg-[#FF5E3A] dark:bg-[#FF6B4A] hover:bg-[#E5532D] dark:hover:bg-[#FF5E3A] text-white px-4 py-1.5 rounded-md font-semibold transition-colors shadow-sm"
                >
                  Dashboard
                </Link>
              )}

              {userRole ? (
                <p
                  onClick={handleLogout}
                  className="hover:text-red-600 dark:hover:text-red-400 font-medium transition-all duration-300 px-3 py-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center justify-center gap-2 cursor-pointer text-gray-700 dark:text-gray-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </p>
              ) : (
                <Link href="/login" onClick={() => setOpen(false)} className="block">
                  <p className="hover:text-[#FF5E3A] dark:hover:text-[#FF6B4A] font-medium transition-all duration-300 px-3 py-1.5 rounded-md hover:bg-[#FF5E3A]/10 dark:hover:bg-[#FF6B4A]/10 text-gray-700 dark:text-gray-200">
                    Login
                  </p>
                </Link>
              )}
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setOpen(true)}
                className="text-gray-700 dark:text-gray-200 text-2xl p-2 hover:bg-[#FF5E3A]/10 dark:hover:bg-[#FF6B4A]/10 rounded-md transition-colors"
              >
                ☰
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white dark:bg-[#0F172A] overflow-y-auto shadow-lg transform transition-transform duration-300 z-[60] ${
          open && isMobile ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-gray-900 dark:text-white font-bold">Menu</h2>
          <button 
            onClick={() => setOpen(false)} 
            className="text-gray-600 dark:text-gray-400 text-xl p-2 hover:text-[#FF5E3A] dark:hover:text-[#FF6B4A]"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="p-4 space-y-4 text-gray-700 dark:text-gray-200">
          {menuItems?.map((item, i) => (
            <div key={i}>
              {item?.path && (
                <Link href={item.path} onClick={() => setOpen(false)}>
                  <p className="font-semibold hover:text-[#FF5E3A] dark:hover:text-[#FF6B4A] py-1">
                    {item.name}
                  </p>
                </Link>
              )}
              {!item.path && (
                <div
                  onClick={() => toggleAccordion(item.name)}
                  className="flex justify-between items-center cursor-pointer py-1 group"
                >
                  <p className="font-semibold group-hover:text-[#FF5E3A] dark:group-hover:text-[#FF6B4A]">
                    {item.name}
                  </p>
                  <TiArrowSortedDown className={`transition-transform duration-300 text-lg ${
                    expandedItems.includes(item.name) 
                      ? 'rotate-180 text-[#FF5E3A] dark:text-[#FF6B4A]' 
                      : ''
                  }`} />
                </div>
              )}
            </div>
          ))}

          {/* Mobile Role-Based Links */}
          {userRole && roleLinks[userRole]?.map((link, index) => (
            <Link key={index} href={link.path} onClick={() => setOpen(false)}>
              <p className="font-semibold hover:text-[#FF5E3A] dark:hover:text-[#FF6B4A] py-3">
                {link.name}
              </p>
            </Link>
          ))}

          <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-4">
            {userRole && (
              <Link href={defaulDashboard} onClick={() => setOpen(false)}>
                <p className="bg-[#FF5E3A] dark:bg-[#FF6B4A] hover:bg-[#E5532D] dark:hover:bg-[#FF5E3A] text-white text-center px-3 py-2 rounded mt-3 font-bold shadow-md">
                  Dashboard
                </p>
              </Link>
            )}
            {userRole ? (
              <p
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white text-center px-3 py-2 rounded mt-3 font-bold shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </p>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)} className="block">
                <p className="hover:text-[#FF5E3A] dark:hover:text-[#FF6B4A] text-center">
                  Login
                </p>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {open && isMobile && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
        />
      )}

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}