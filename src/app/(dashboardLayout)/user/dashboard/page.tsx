import { getUserInfo } from '../../../../services/authService';


const UserDashboardPage = async () => {
    const userInfo = await getUserInfo()




    return (
        <div>
           {JSON.stringify(userInfo?.role)}
        </div>
    );
};

export default UserDashboardPage;