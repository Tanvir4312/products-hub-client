
import Navbar from "@/components/shared/dashboard/Navbar/Navbar";
import { getUserInfo } from "@/services/authService";
import { UserRole } from "@/lib/authUtils";


export default async function NavbarRoutesLayout({
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
      <main className="flex-grow max-w-7xl mx-auto">
        {children}
      </main>

    </div>
  );
}
