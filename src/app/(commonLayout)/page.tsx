
import { getUserInfo } from "../../services/authService";

// import { UserRole } from "../../lib/authUtils";

import background_image from "@/assets/background-image/background-design.jpeg"


// import Information from "@/components/modules/Home_Page/Information/Information";
import Footer from "@/components/modules/Home_Page/Footer/Footer";




const CommonHomePage = async () => {
  const userInfo = await getUserInfo();
  // console.log(userInfo);
  // let userRole = userInfo?.role
  // const unifySuperAdminAndAdminRole = userRole === "SUPER_ADMIN" ? "ADMIN" : userRole
  // userRole = unifySuperAdminAndAdminRole as UserRole

  return (
    <div>
      {/* Background Image */}
      <div className="relative">
        {/* <div
          style={{
            backgroundImage: `url(${background_image.src})`,
            opacity: 0.3,
          }}
          className="absolute inset-0 z-0"
        >
        </div> */}

       
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default CommonHomePage;
