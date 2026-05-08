
import { getUserInfo } from '../../../../services/authService';



const ModeratorDashboardPage = async () => {
    const userInfo = await getUserInfo()
   
    return (
        <div>
             {JSON.stringify(userInfo?.role)}
        </div>
    );
};

export default ModeratorDashboardPage;