import MyProfile from "@/components/shared/MyProfile";
import { getUserInfo } from "@/services/authService";


const MyProfilePage = async () => {
    const userInfo = await getUserInfo()


    return (
        <div className="p-4 md:p-8 min-h-[calc(100vh-80px)] bg-gray-50/50">
            <MyProfile userInfo={userInfo} />
        </div>
    );
};

export default MyProfilePage;