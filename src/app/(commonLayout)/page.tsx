
import { getUserInfo } from "../../services/authService";
import { getUpvotedProducts } from "@/services/productService";
import { IProduct } from "@/types/product.types";

// import { UserRole } from "../../lib/authUtils";

import background_image from "@/assets/background-image/bg.png"


// import Information from "@/components/modules/Home_Page/Information/Information";
import HomeCarousel from "@/components/modules/Home_Page/Carousel/HomeCarousel";
import FeaturedProducts from "@/components/modules/Home_Page/FeaturedProducts/FeaturedProducts";
import MostVotedProducts from "@/components/modules/Home_Page/MostVotedProducts/MostVotedProducts";
import NewReleases from "@/components/modules/Home_Page/NewReleases/NewReleases";
import BrowseByCategory from "@/components/modules/Home_Page/BrowseByCategory/BrowseByCategory";
import SpecialOffers from "@/components/modules/Home_Page/SpecialOffers/SpecialOffers";
import Leaderboard from "@/components/modules/Home_Page/Leaderboard/Leaderboard";
import { RecommendedContent } from "@/components/shared/AI/RecommendedContent";




const CommonHomePage = async () => {
  const userInfo = await getUserInfo();
  let upvotedProducts: IProduct[] = [];
  if (userInfo) {
    try {
      upvotedProducts = await getUpvotedProducts();
    } catch (error) {
      // Backend endpoint may not exist, continue with empty array
      console.log("Upvoted products fetch failed:", error);
    }
  }
  // console.log(userInfo);
  // let userRole = userInfo?.role
  // const unifySuperAdminAndAdminRole = userRole === "SUPER_ADMIN" ? "ADMIN" : userRole
  // userRole = unifySuperAdminAndAdminRole as UserRole

  return (
    <div className=" relative">
      {/* Background Image */}
      <div className=" max-w-7xl mx-auto">
        <div
          style={{
            backgroundImage: `url(${background_image.src})`,
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
            backgroundRepeat: "no-repeat",
            opacity: 0.2,
          }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
        </div>

        <div className="space-y-20">
          <HomeCarousel />
          <FeaturedProducts />
          <MostVotedProducts />
          <NewReleases />
          
          {/* AI Smart Recommendations - Logged in users only */}
          {userInfo && (
            <section className="px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-indigo-500/5 text-indigo-500 text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-500/10 mb-4">
                    AI Powered
                  </span>
                  <h2 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
                    Recommended <span className="text-indigo-500 italic font-serif">For You</span>
                  </h2>
                  <p className="text-muted-foreground text-lg font-medium mt-3 max-w-2xl mx-auto">
                    Personalized product suggestions based on your interests.
                  </p>
                </div>
                <RecommendedContent upvotedProducts={upvotedProducts} />
              </div>
            </section>
          )}

          
          <BrowseByCategory />
          <SpecialOffers />
          <Leaderboard />
        </div>
      </div>
    </div>
  );
};

export default CommonHomePage;
