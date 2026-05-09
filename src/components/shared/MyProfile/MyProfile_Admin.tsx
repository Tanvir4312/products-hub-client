"use client";

import React from "react";
import { ShieldCheck, Mail, User, Clock, Phone, MapPin, Edit, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import UpdateAdminModal from "../adminModals/UpdateAdminModal";
import { Button } from "@/components/ui/button";

interface MyProfile_AdminProps {
    userInfo: any;
    roleData: any;
}

const MyProfile_Admin = ({ userInfo, roleData }: MyProfile_AdminProps) => {
    const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState(false);

    const profilePhoto = roleData?.profilePhoto || roleData?.profileImage || userInfo.image || null;
    const joinDate = userInfo.createdAt ? format(new Date(userInfo.createdAt), "MMMM d, yyyy") : "N/A";

    return (
        <div className="w-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* ADMIN HERO */}
            <div className="relative overflow-hidden bg-card border border-border rounded-[2.5rem] shadow-2xl transition-all duration-500 group">
                {/* Brand Gradient Header */}
                <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-r from-indigo-900 via-[#0F172A] to-indigo-950">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                </div>

                <div className="relative flex flex-col lg:flex-row items-center lg:items-end gap-8 p-8 sm:p-10 pt-28 sm:pt-32">
                    {/* Avatar Wrapper */}
                    <div className="relative group/avatar">
                        <div className="w-32 h-32 lg:w-44 lg:h-44 rounded-[2rem] overflow-hidden border-4 border-card shadow-2xl bg-muted flex items-center justify-center ring-4 ring-primary/20 transition-all duration-500 group-hover/avatar:ring-primary/40 group-hover/avatar:scale-[1.02]">
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

                        <div className="absolute -bottom-2 -right-2 bg-primary p-2.5 rounded-2xl border-4 border-card shadow-xl transition-transform duration-500 hover:rotate-12">
                            <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 text-center lg:text-left space-y-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                                    <span className="w-8 h-1 bg-primary rounded-full" />
                                    <p className="text-[10px] uppercase tracking-[0.4em] text-primary font-black">
                                        Root Administrator
                                    </p>
                                </div>
                                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black tracking-tighter text-foreground leading-none">
                                    {userInfo.name}
                                </h1>
                            </div>

                            <Button
                                onClick={() => setIsUpdateModalOpen(true)}
                                disabled={userInfo.status !== "ACTIVE"}
                                className="rounded-2xl font-black text-[12px] uppercase tracking-widest px-8 py-7 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:scale-95 transition-all mx-auto lg:mx-0 group"
                            >
                                <Edit className="w-4 h-4 mr-2 transition-transform group-hover:rotate-12" />
                                Update Command Profile
                            </Button>
                        </div>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                            <div className="flex items-center gap-2 bg-indigo-600/10 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 px-5 py-2 rounded-2xl text-xs font-black tracking-widest border border-indigo-600/20 backdrop-blur-sm">
                                <ShieldCheck className="w-4 h-4" />
                                {userInfo.role === "ADMIN" ? "ADMIN" : "SUPER ADMIN"}
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
                                <Mail className="w-4 h-4 text-primary" />
                                <span className="text-muted-foreground">{userInfo.email}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Restriction Alert */}
            {(userInfo.status === "INACTIVE" || userInfo.status === "SUSPENDED") && (
                <div className="w-full group">
                    <div className="bg-rose-500/5 dark:bg-rose-500/10 border-2 border-rose-500/20 p-8 rounded-[2.5rem] flex flex-col sm:flex-row items-center gap-8 shadow-2xl transition-all hover:border-rose-500/40">
                        <div className="w-16 h-16 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-rose-500/20 shrink-0 transform group-hover:rotate-6 transition-transform">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <div className="text-center sm:text-left">
                            <h3 className="text-rose-600 dark:text-rose-400 font-black uppercase tracking-widest text-sm mb-1">
                                Administrative Access Revoked
                            </h3>
                            <p className="text-muted-foreground text-sm font-bold leading-relaxed">
                                System protocol has flagged this account as <span className="text-rose-500 font-black">"{userInfo.status}"</span>. 
                                Your administrative privileges have been temporarily suspended. Please reach out to system security for restoration.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* DETAILS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-xl space-y-8 lg:col-span-1 group">
                    <SectionTitle icon={Clock} title="Time Logistics" color="text-primary" />
                    <div className="space-y-2">
                        <InfoItem icon={Clock} label="Member Since" value={joinDate} />
                        <InfoItem icon={Phone} label="Terminal Contact" value={roleData?.contactNumber || "N/A"} />
                        <InfoItem icon={MapPin} label="Base Location" value={roleData?.address || "Headquarters"} />
                    </div>
                </div>

                <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-xl lg:col-span-2 space-y-8">
                    <SectionTitle icon={ShieldCheck} title="Privilege Protocol" color="text-emerald-500" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="p-6 bg-muted/30 rounded-3xl border border-border hover:border-primary/30 transition-all">
                            <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-2 opacity-60">Authorization Level</p>
                            {userInfo?.role === "ADMIN" ? (
                                <p className="text-2xl font-black text-foreground">MANAGEMENT</p>
                            ) : (
                                <p className="text-2xl font-black text-foreground">ROOT ACCESS</p>
                            )}
                        </div>
                        <div className="p-6 bg-muted/30 rounded-3xl border border-border hover:border-primary/30 transition-all">
                            <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mb-2 opacity-60">System Status</p>
                            <p className="text-2xl font-black text-foreground uppercase">{userInfo.status}</p>
                        </div>
                        
                        <div className="sm:col-span-2 p-8 bg-gradient-to-br from-primary/5 to-transparent rounded-[2rem] border border-primary/10 relative overflow-hidden">
                            <div className="absolute -right-4 -bottom-4 opacity-5">
                                <ShieldCheck className="w-32 h-32" />
                            </div>
                            <p className="text-xs font-black text-primary mb-3 uppercase tracking-[0.3em]">Security Mandate</p>
                            <p className="text-sm font-bold text-muted-foreground leading-relaxed italic">
                                “As an administrator, you hold the highest level of trust within our ecosystem. Your actions shape the community's growth and safety. Use your privileges with diligence.”
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <UpdateAdminModal
                admin={{ ...roleData, name: userInfo.name, id: userInfo.id }}
                isOpen={isUpdateModalOpen}
                onOpenChange={setIsUpdateModalOpen}
            />
        </div>
    );
};


const SectionTitle = ({ icon: Icon, title, color }: any) => (
    <div className="flex items-center gap-4 mb-4">
        <div className={cn("p-2 rounded-xl bg-white shadow-sm", color)}>
            <Icon size={16} />
        </div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">{title}</h3>
    </div>
)

const InfoItem = ({ icon: Icon, label, value }: any) => (
    <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/50 transition-all duration-300 group">
        <div className="p-2 bg-white shadow-sm rounded-xl text-indigo-500 group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 opacity-70 group-hover:opacity-100 transition-opacity">{label}</p>
            <p className="font-bold text-gray-900 break-words group-hover:text-indigo-600 transition-colors">
                {value || "N/A"}
            </p>
        </div>
    </div>
);

export default MyProfile_Admin;
