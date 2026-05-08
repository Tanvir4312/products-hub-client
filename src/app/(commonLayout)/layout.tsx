
import Navbar from "@/components/modules/Home_Page/Navbar/Navbar";
import { getUserInfo } from "@/services/authService";
import { UserRole } from "@/lib/authUtils";
import ScrollToTop from "@/components/shared/ScrollToTop";

export default async function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userInfo = await getUserInfo();
  let userRole = userInfo?.role;
  const unifySuperAdminAndAdminRole = userRole === "SUPER_ADMIN" ? "ADMIN" : userRole;
  userRole = (unifySuperAdminAndAdminRole as UserRole) || null;

  return (
    <div className="flex flex-col min-h-screen">
  
      <Navbar userRole={userRole} />
      <main className="flex-grow">
        {children}
      </main>
      <ScrollToTop />
    </div>
  );
}
