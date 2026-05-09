import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { 
  BadgeCheck, 
  Calendar, 
  CreditCard, 
  ExternalLink, 
  ShieldAlert, 
  ShieldCheck, 
  User as UserIcon,
  Zap
} from "lucide-react";

import { getUserInfo } from "@/services/authService";
import { getMySubscription } from "@/services/subscriptionService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const UserDashboardPage = async () => {
  const userInfo = await getUserInfo();
  const subscriptionRes = await getMySubscription();
  const subscription = subscriptionRes.data;

  const isSubscribed = subscription?.isSubscribed && subscription?.paymentVerified;

  return (
    <div className="container mx-auto py-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Welcome back, {userInfo?.name || "User"}</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your account and subscription preferences.</p>
        </div>
        {!isSubscribed && (
          <Link href="/user/dashboard/my-subscription">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/20 gap-2">
              <Zap className="w-4 h-4 fill-white" />
              Upgrade to Premium
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-lg">Profile Details</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-zinc-500">Email Address</p>
              <p className="text-sm text-zinc-900 dark:text-white truncate">{userInfo?.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-zinc-500">Account Role</p>
              <Badge variant="outline" className="capitalize">
                {userInfo?.role?.toLowerCase() || "User"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Status Card */}
        <Card className="md:col-span-2 border-zinc-200 dark:border-zinc-800 shadow-sm bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm relative overflow-hidden">
          {isSubscribed && (
            <div className="absolute top-0 right-0 p-4">
              <div className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full uppercase tracking-tighter">
                <BadgeCheck className="w-3 h-3" /> Premium
              </div>
            </div>
          )}
          
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-zinc-500" />
              <CardTitle className="text-lg">Subscription Overview</CardTitle>
            </div>
            <CardDescription>Current plan and billing details</CardDescription>
          </CardHeader>
          
          <CardContent>
            {isSubscribed ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-500">Current Status</p>
                      <p className="text-lg font-bold text-zinc-900 dark:text-white capitalize">{subscription.status.toLowerCase()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-500">Subscribed On</p>
                      <p className="text-zinc-900 dark:text-white font-medium">
                        {subscription.subscriptionDate ? format(new Date(subscription.subscriptionDate), "PPP") : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-500">Valid Until</p>
                      <p className="text-zinc-900 dark:text-white font-medium">
                        {subscription.subscriptionDate ? format(new Date(new Date(subscription.subscriptionDate).setMonth(new Date(subscription.subscriptionDate).getMonth() + 1)), "PPP") : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Latest Payment</p>
                        <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                          ${subscription.payments?.[0]?.price || 0}
                        </p>
                      </div>
                      <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-none">Verified</Badge>
                    </div>
                    <div className="pt-3 border-t border-zinc-200 dark:border-zinc-700">
                      <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Transaction ID</p>
                      <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400 break-all">
                        {subscription.payments?.[0]?.transactionId || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div className="max-w-xs">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">No active subscription</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                    Upgrade to Premium to unlock unlimited product submissions and more exclusive features.
                  </p>
                </div>
                <Link href="/user/dashboard/my-subscription">
                  <Button variant="outline" className="mt-2 group">
                    View Pricing Plans
                    <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboardPage;