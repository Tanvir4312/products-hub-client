"use client";

import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Star, 
  Flag,
  Loader2,
  TrendingUp,
  LayoutDashboard
} from "lucide-react";
import { getDashboardStats } from "@/services/statsService";

const ModeratorStatsOverview = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const res = await getDashboardStats();
        if (res.success) {
          setStats(res.data.productStats);
        }
      } catch (error) {
        console.error("Failed to fetch moderator stats", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-32 rounded-3xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
        ))}
      </div>
    );
  }

  const statCards = [
    {
      label: "Pending",
      value: stats?.pending || 0,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20"
    },
    {
      label: "Approved",
      value: stats?.approved || 0,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20"
    },
    {
      label: "Rejected",
      value: stats?.rejected || 0,
      icon: XCircle,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20"
    },
    {
      label: "Featured",
      value: stats?.featured || 0,
      icon: Star,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      label: "Reported",
      value: stats?.reported || 0,
      icon: Flag,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <div 
            key={card.label} 
            className={`p-6 rounded-[2rem] border ${card.border} ${card.bg} transition-all hover:scale-[1.02] cursor-default`}
          >
            <div className="flex flex-col gap-4">
              <div className={`w-10 h-10 rounded-2xl bg-white dark:bg-zinc-950 flex items-center justify-center shadow-sm`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{card.label}</p>
                <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-100">{card.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-[2.5rem] bg-zinc-900 text-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform group-hover:scale-110">
            <TrendingUp size={160} />
          </div>
          <div className="relative z-10 space-y-4">
            <Badge className="bg-blue-500 text-white border-none uppercase text-[10px] tracking-widest font-black px-3 py-1">Moderation Protocol</Badge>
            <h2 className="text-3xl font-black tracking-tight leading-none">System <br/> Performance</h2>
            <p className="text-zinc-400 text-sm max-w-[200px]">Real-time synchronization of all innovation lifecycle stages across the global registry.</p>
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <LayoutDashboard size={24} />
              </div>
              <div>
                <h4 className="font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-100 text-sm">Dashboard Overview</h4>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Session monitoring</p>
              </div>
           </div>
           <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                 <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Total Innovation Magnitude</span>
                 <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                    {(stats?.approved || 0) + (stats?.pending || 0) + (stats?.rejected || 0)}
                 </span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                 <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Moderation Velocity</span>
                 <span className="text-sm font-black text-emerald-500">OPTIMAL</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>
    {children}
  </span>
);

export default ModeratorStatsOverview;
