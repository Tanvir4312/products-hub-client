
import Navbar from "@/components/shared/dashboard/Navbar/Navbar";
import { getUserInfo } from "@/services/authService";
import { UserRole } from "@/lib/authUtils";
import ScrollToTop from "@/components/shared/ScrollToTop";
import Footer from "@/components/shared/ModeratorModals/Footer/Footer";

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
      <Footer />
    </div>
  );
}
