import TopVotedProducts from "@/components/modules/Dasboard/Admin_Dashboard/TopVotedProducts/TopVotedProducts";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Innovation Leaderboard | Admin Dashboard",
  description: "Viewing the most impactful and upvoted innovations across the platform.",
};

export default function TopVotedProductsPage() {
  return (
    <Suspense 
      fallback={
        <div className="h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        </div>
      }
    >
      <TopVotedProducts />
    </Suspense>
  );
}