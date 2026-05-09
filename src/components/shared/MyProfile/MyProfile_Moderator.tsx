"use client";

import React from "react";
import {
    User,
    Mail,
    ShieldCheck,
    Calendar,
    Phone,
    BadgeCheck,
    Briefcase,
    GraduationCap,
    Clock,
    Camera,
    MapPin,
    Edit,
    Shield,
    Fingerprint,
    Heart,
    Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import UpdateModeratorModal from "../ModeratorModals/UpdateModeratorModal";
import { Button } from "@/components/ui/button";

interface MyProfile_ModeratorProps {
    userInfo: any;
    roleData: any;
}

const MyProfile_Moderator = ({ userInfo, roleData }: MyProfile_ModeratorProps) => {
    const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState(false);

    const profilePhoto = roleData?.profilePhoto || userInfo.image || null;
    const joinDate = userInfo.createdAt ? format(new Date(userInfo.createdAt), "MMMM d, yyyy") : "N/A";

    return (
        <div className="bg-background transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* 🔥 HERO SECTION */}
                <div className="relative rounded-[2.5rem] overflow-hidden bg-card border border-border shadow-2xl transition-all duration-500 hover:shadow-indigo-500/5 group">
                    {/* Brand Gradient Header */}
                    <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
                        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                    </div>

                    <div className="relative flex flex-col lg:flex-row items-center lg:items-end gap-8 p-8 sm:p-10 pt-28 sm:pt-32">
                        {/* Avatar Wrapper */}
                        <div className="relative group/avatar">
                            <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-[2rem] overflow-hidden border-4 border-card shadow-2xl bg-muted flex items-center justify-center ring-4 ring-indigo-500/20 transition-all duration-500 group-hover/avatar:ring-indigo-500/40 group-hover/avatar:scale-[1.02]">
                                {profilePhoto ? (
                                    <img
                                        src={profilePhoto}
                                        alt="profile"
                                        className="w-full h-full object-cover transition duration-700 group-hover/avatar:scale-110"
                                    />
                                ) : (
                                    <User className="w-16 h-16 text-muted-foreground" />
                                )}

                                <div
                                    className={cn(
                                        "absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-md cursor-pointer",
                                        userInfo.status !== "ACTIVE" && "pointer-events-none opacity-0"
                                    )}
                                    onClick={() => userInfo.status === "ACTIVE" && setIsUpdateModalOpen(true)}
                                >
                                    <div className="bg-white/20 p-4 rounded-2xl border border-white/30 transform translate-y-4 group-hover/avatar:translate-y-0 transition-transform duration-500">
                                        <Camera className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -bottom-2 -right-2 bg-indigo-600 p-2.5 rounded-2xl border-4 border-card shadow-xl transition-transform duration-500 hover:rotate-12">
                                <ShieldCheck className="w-5 h-5 text-white" />
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="flex-1 text-center lg:text-left space-y-6">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                                        <span className="w-8 h-1 bg-indigo-600 rounded-full" />
                                        <p className="text-[10px] uppercase tracking-[0.4em] text-indigo-600 font-black">
                                            Moderator Node
                                        </p>
                                    </div>
                                    <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black tracking-tighter text-foreground leading-none">
                                        {userInfo.name}
                                    </h1>
                                </div>

                                <Button
                                    onClick={() => setIsUpdateModalOpen(true)}
                                    disabled={userInfo.status !== "ACTIVE"}
                                    className="rounded-2xl font-black text-[12px] uppercase tracking-widest px-8 py-7 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-1 active:scale-95 transition-all mx-auto lg:mx-0 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed group"
                                >
                                    <Edit className="w-4 h-4 mr-2 transition-transform group-hover:rotate-12" />
                                    Edit Node
                                </Button>
                            </div>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                <div className="flex items-center gap-2 bg-indigo-600/10 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 px-5 py-2 rounded-2xl text-xs font-black tracking-widest border border-indigo-600/20 backdrop-blur-sm">
                                    <ShieldCheck className="w-4 h-4" />
                                    {userInfo.role}
                                </div>

                                <div
                                    className={cn(
                                        "flex items-center gap-2 px-5 py-2 rounded-2xl text-xs font-black tracking-widest border shadow-sm backdrop-blur-md transition-colors",
                                        userInfo.status === "ACTIVE"
                                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "w-2 h-2 rounded-full",
                                            userInfo.status === "ACTIVE" ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                                        )}
                                    />
                                    {userInfo.status}
                                </div>

                                <div className="flex items-center gap-2 bg-muted/50 backdrop-blur-md px-5 py-2 rounded-2xl text-sm font-bold border border-border shadow-sm">
                                    <Mail className="w-4 h-4 text-indigo-600" />
                                    <span className="text-muted-foreground">{userInfo.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 🔥 GRID CONTENT */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Restriction Alert */}
                    {(userInfo.status === "INACTIVE" || userInfo.status === "SUSPENDED") && (
                        <div className="lg:col-span-12 group">
                            <div className="bg-rose-500/5 dark:bg-rose-500/10 border-2 border-rose-500/20 p-6 rounded-[2rem] flex flex-col sm:flex-row items-center gap-6 shadow-2xl transition-all hover:border-rose-500/40">
                                <div className="w-16 h-16 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-rose-500/20 shrink-0 transform group-hover:rotate-6 transition-transform">
                                    <ShieldCheck className="w-8 h-8" />
                                </div>
                                <div className="text-center sm:text-left">
                                    <h3 className="text-rose-600 dark:text-rose-400 font-black uppercase tracking-widest text-sm mb-1">
                                        Access Restricted
                                    </h3>
                                    <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                                        Your account is currently <span className="text-rose-500 font-black">"{userInfo.status}"</span>. 
                                        System activities are locked. Please contact administration.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* LEFT COLUMN: STATS & INSIGHTS */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white p-8 rounded-[2.5rem] shadow-2xl border border-white/5 group transition-transform duration-500 hover:scale-[1.02]">
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl group-hover:bg-indigo-600/20 transition-colors" />
                            <div className="relative z-10 space-y-4">
                                <p className="text-[10px] uppercase tracking-[0.4em] text-indigo-400 font-black">
                                    System Status
                                </p>
                                <h4 className="text-3xl font-black tracking-tight leading-tight">Verified <br />Moderator</h4>
                                <div className="pt-4 border-t border-white/10 mt-6">
                                    <div className="flex items-center gap-3 text-white/60 text-xs font-bold">
                                        <Clock className="w-4 h-4 text-indigo-400" />
                                        Joined {joinDate}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-gradient-to-br from-indigo-600/10 via-indigo-600/5 to-transparent rounded-[2.5rem] border border-indigo-600/10 relative overflow-hidden group">
                            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                <Shield className="w-24 h-24 text-indigo-600" />
                            </div>
                            <p className="text-xs font-black text-indigo-600 mb-4 uppercase tracking-[0.3em]">Node Authority</p>
                            <p className="text-base font-bold text-muted-foreground leading-relaxed italic relative z-10">
                                “Your role as a Moderator is critical to maintaining the integrity of the Food Hunt platform. Secure the ecosystem.”
                            </p>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: PERMISSIONS & DETAILS */}
                    <div className="lg:col-span-8">
                        <div className="bg-card border border-border p-8 sm:p-10 rounded-[2.5rem] shadow-2xl h-full space-y-10">
                            <div className="flex items-center justify-between border-b border-border pb-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-indigo-600/10 rounded-2xl text-indigo-600 transform hover:rotate-12 transition-transform">
                                        <Fingerprint className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black uppercase tracking-widest text-foreground">
                                            Biometric Dossier
                                        </h3>
                                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Identity & Terminal</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="group p-8 bg-muted/30 rounded-[2rem] border border-border/50 hover:border-indigo-600/30 transition-all hover:bg-muted/50">
                                    <p className="text-[10px] uppercase text-indigo-600 font-black mb-2 tracking-[0.2em]">
                                        Terminal Contact
                                    </p>
                                    <p className="text-2xl font-black text-foreground">{roleData?.contactNumber || "N/A"}</p>
                                    <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase">Primary Communication Node</p>
                                </div>

                                <div className="group p-8 bg-muted/30 rounded-[2rem] border border-border/50 hover:border-indigo-600/30 transition-all hover:bg-muted/50">
                                    <p className="text-[10px] uppercase text-indigo-600 font-black mb-2 tracking-[0.2em]">
                                        Biological Gender
                                    </p>
                                    <p className="text-2xl font-black text-foreground uppercase">{roleData?.gender || "N/A"}</p>
                                    <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase">System Profile Tag</p>
                                </div>
                                
                                <div className="sm:col-span-2 p-10 bg-muted/20 rounded-[2rem] border border-dashed border-border flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center shadow-sm">
                                        <ShieldCheck className="w-6 h-6 text-indigo-600/40" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-black text-foreground uppercase tracking-widest">Authority Node</p>
                                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-60">System Synchronized</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <UpdateModeratorModal
                    moderator={roleData}
                    isOpen={isUpdateModalOpen}
                    onOpenChange={setIsUpdateModalOpen}
                />
            </div>
        </div>
    );
};

export default MyProfile_Moderator;
