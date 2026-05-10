import { getUserInfo } from '../../../../services/authService';
import ModeratorStatsOverview from '@/components/modules/Dasboard/Moderator_Dashboard/ModeratorStatsOverview';

const ModeratorDashboardPage = async () => {
    const userInfo = await getUserInfo();
   
    return (
        <div className="p-6 md:p-8 lg:p-12 space-y-8 lg:space-y-12 max-w-[1600px] mx-auto">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="h-px w-8 bg-zinc-200 dark:bg-zinc-800" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Moderator Control Center</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 italic">
                    Welcome, <span className="text-zinc-400 font-serif">{userInfo?.name || "Moderator"}</span>
                </h1>
                <p className="text-zinc-500 text-sm font-medium">Monitoring the pulse of global innovation and community standards.</p>
            </div>

            <ModeratorStatsOverview />
        </div>
    );
};

export default ModeratorDashboardPage;