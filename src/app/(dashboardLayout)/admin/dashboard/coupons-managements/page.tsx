import CouponsManagement from "@/components/modules/Dasboard/Admin_Dashboard/CouponsManagement/CouponsManagement";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Coupon Governance | Admin Dashboard",
  description: "Managing platform promotional incentives and redemption logic.",
};

export default function CouponsManagementPage() {
  return (
    <Suspense 
      fallback={
        <div className="h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
        </div>
      }
    >
      <CouponsManagement />
    </Suspense>
  );
}