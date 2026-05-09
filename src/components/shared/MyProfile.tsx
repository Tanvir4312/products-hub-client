"use client";

import React, { useState } from "react";

import MyProfile_Admin from "./MyProfile/MyProfile_Admin";
import { ShieldCheck, Mail, User, Clock, Phone, MapPin, Edit, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import UpdateUserModal from "./UserModals/UpdateUserModal";
import MyProfile_Moderator from "./MyProfile/MyProfile_Moderator";



interface MyProfileProps {
  userInfo: any;
}

const MyProfile = ({ userInfo }: MyProfileProps) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  if (!userInfo) return null;

  const role = userInfo?.role;

  const getRoleData = () => {
    if (userInfo.admin) return userInfo.admin;
    if (userInfo.moderator) return userInfo.moderator;

    return null;
  };

  const roleData = getRoleData();

  if (role === "MODERATOR") {
    return <MyProfile_Moderator userInfo={userInfo} roleData={roleData} />;
  }

  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return <MyProfile_Admin userInfo={userInfo} roleData={roleData} />;
  }

  const profilePhoto =
    roleData?.profilePhoto ||
    roleData?.profileImage ||
    userInfo.profilePhoto ||
    userInfo.image ||
    null;

  const joinDate = userInfo.createdAt
    ? format(new Date(userInfo.createdAt), "MMMM d, yyyy")
    : "N/A";

  return (
    <div className="bg-background transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* 🔥 HERO SECTION */}
        <div className="relative rounded-[2.5rem] overflow-hidden bg-card border border-border shadow-2xl transition-all duration-500 hover:shadow-primary/5 group">
          {/* Brand Gradient Header */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
          </div>

          <div className="relative flex flex-col lg:flex-row items-center lg:items-end gap-8 p-8 sm:p-10 pt-28 sm:pt-32">
            {/* Avatar Wrapper */}
            <div className="relative group/avatar">
              <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-[2rem] overflow-hidden border-4 border-card shadow-2xl bg-muted flex items-center justify-center ring-4 ring-primary/20 transition-all duration-500 group-hover/avatar:ring-primary/40 group-hover/avatar:scale-[1.02]">
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
                      {role === "APPLICANT" ? "Member Profile" : "System Authority"}
                    </p>
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black tracking-tighter text-foreground leading-none">
                    {userInfo.name}
                  </h1>
                </div>

                <Button
                  onClick={() => setIsUpdateModalOpen(true)}
                  disabled={userInfo.status !== "ACTIVE"}
                  className="rounded-2xl font-black text-[12px] uppercase tracking-widest px-8 py-7 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:scale-95 transition-all mx-auto lg:mx-0 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed group"
                >
                  <Edit className="w-4 h-4 mr-2 transition-transform group-hover:rotate-12" />
                  Edit Profile
                </Button>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <div className="flex items-center gap-2 bg-indigo-600/10 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 px-5 py-2 rounded-2xl text-xs font-black tracking-widest border border-indigo-600/20 backdrop-blur-sm">
                  <ShieldCheck className="w-4 h-4" />
                  {role.replace("_", " ")}
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
                    Account Access Restricted
                  </h3>
                  <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                    Your account status is currently set to <span className="text-rose-500 font-black">"{userInfo.status}"</span>.
                    Dashboard activities and application features are temporarily disabled. Please reach out to support for assistance.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* LEFT COLUMN: STATS & INSIGHTS */}
          <div className="lg:col-span-4 space-y-8">
            <div className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white p-8 rounded-[2.5rem] shadow-2xl border border-white/5 group transition-transform duration-500 hover:scale-[1.02]">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
              <div className="relative z-10 space-y-4">
                <p className="text-[10px] uppercase tracking-[0.4em] text-primary font-black">
                  Portal Status
                </p>
                <h4 className="text-3xl font-black tracking-tight leading-tight">Verified <br />Community Member</h4>
                <div className="pt-4 border-t border-white/10 mt-6">
                  <div className="flex items-center gap-3 text-white/60 text-xs font-bold">
                    <Clock className="w-4 h-4 text-primary" />
                    Joined {joinDate}
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Insight Quote Moved Here */}
            <div className="p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-[2.5rem] border border-primary/10 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <User className="w-24 h-24 text-primary" />
              </div>
              <p className="text-xs font-black text-primary mb-4 uppercase tracking-[0.3em]">Personal Insight</p>
              <p className="text-base font-bold text-muted-foreground leading-relaxed italic relative z-10">
                “You are a valued member of the Food Hunt ecosystem. Your contributions help shape the future of our community.”
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: PERMISSIONS & DETAILS */}
          <div className="lg:col-span-8">
            <div className="bg-card border border-border p-8 sm:p-10 rounded-[2.5rem] shadow-2xl h-full space-y-10">
              <div className="flex items-center justify-between border-b border-border pb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary transform hover:rotate-12 transition-transform">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-widest text-foreground">
                      Account Authority
                    </h3>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Security & Privileges</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="group p-8 bg-muted/30 rounded-[2rem] border border-border/50 hover:border-primary/30 transition-all hover:bg-muted/50">
                  <p className="text-[10px] uppercase text-primary font-black mb-2 tracking-[0.2em]">
                    Permission Level
                  </p>
                  <p className="text-2xl font-black text-foreground">{role.replace("_", " ")}</p>
                  <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase">Standard Access Rights</p>
                </div>

                <div className="group p-8 bg-muted/30 rounded-[2rem] border border-border/50 hover:border-primary/30 transition-all hover:bg-muted/50">
                  <p className="text-[10px] uppercase text-emerald-500 font-black mb-2 tracking-[0.2em]">
                    Current Status
                  </p>
                  <p className="text-2xl font-black text-foreground uppercase">{userInfo.status}</p>
                  <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase">Account Operational</p>
                </div>
 
                <div className="group p-8 bg-muted/30 rounded-[2rem] border border-border/50 hover:border-primary/30 transition-all hover:bg-muted/50">
                  <p className="text-[10px] uppercase text-primary font-black mb-2 tracking-[0.2em]">
                    Contact Terminal
                  </p>
                  <p className="text-2xl font-black text-foreground truncate">{userInfo?.contactNumber || "N/A"}</p>
                  <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase">Primary Communication Node</p>
                </div>

                <div className="sm:col-span-2 p-10 bg-muted/20 rounded-[2rem] border border-dashed border-border flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center shadow-sm">
                    <Clock className="w-6 h-6 text-primary/40" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-foreground uppercase tracking-widest">System Ledger</p>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-60">Last sync: Just now</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <UpdateUserModal
          user={{ ...roleData, ...userInfo }}
          isOpen={isUpdateModalOpen}
          onOpenChange={setIsUpdateModalOpen}
        />
      </div>
    </div>
  );
};


const SectionTitle = ({ icon: Icon, title }: any) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
      <Icon size={18} />
    </div>
    <h3 className="text-sm font-bold tracking-wide">{title}</h3>
    <div className="flex-1 h-px bg-gray-200" />
  </div>
);

const InfoItem = ({ icon: Icon, label, value }: any) => (
  <div className="flex items-center gap-3">
    <Icon className="w-4 h-4 text-indigo-500" />
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-semibold text-gray-800">{value || "N/A"}</p>
    </div>
  </div>
);

export default MyProfile;