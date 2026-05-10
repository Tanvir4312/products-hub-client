import { redirect } from "next/navigation";
import { getUserInfo } from "@/services/authService";
import SubscriptionClient from "../../../../../components/modules/Dasboard/User_Dashboard/SubscriptionClient";

// Server Component — can read httpOnly cookies via getUserInfo
const MySubscriptionPage = async () => {
  const user = await getUserInfo();

  if (!user) {
    redirect("/login");
  }

  return <SubscriptionClient />;
};

export default MySubscriptionPage;
