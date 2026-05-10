
import { getUserInfo } from "../../services/authService";

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
import ActivityFeed from "@/components/modules/Home_Page/ActivityFeed/ActivityFeed";




const CommonHomePage = async () => {
  const userInfo = await getUserInfo();
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
          
          {/* Live Activity Feed - Full Width Section */}
          <section className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/10 mb-4">
                  Real-Time Updates
                </span>
                <h2 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
                  Live <span className="text-primary italic font-serif">Activity</span>
                </h2>
                <p className="text-muted-foreground text-lg font-medium mt-3 max-w-2xl mx-auto">
                  Watch the community in action as new products launch and votes come in.
                </p>
              </div>
              <ActivityFeed />
            </div>
          </section>
          
          <BrowseByCategory />
          <SpecialOffers />
          <Leaderboard />
        </div>
      </div>
    </div>
  );
};

export default CommonHomePage;
