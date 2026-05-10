
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
          <BrowseByCategory />
          <SpecialOffers />
          <Leaderboard />
        </div>
      </div>
    </div>
  );
};

export default CommonHomePage;
