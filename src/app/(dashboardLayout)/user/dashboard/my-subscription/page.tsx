"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CreditCard, Gift, Loader2, Star, Zap } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { validateCoupon } from "@/services/couponService";
import { subscribe } from "@/services/subscriptionService";

const BASE_PRICE = 500;

const MySubscriptionPage = () => {
  const router = useRouter();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const discountedPrice = BASE_PRICE - (BASE_PRICE * discount) / 100;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsValidating(true);
    try {
      const res = await validateCoupon(couponCode);
      if (res.success && res.data) {
        setDiscount(res.data.discount);
        setAppliedCoupon(couponCode);
        toast.success(`Coupon applied! ${res.data.discount}% discount added.`);
      } else {
        setDiscount(0);
        setAppliedCoupon(null);
        toast.error(res.message || "Coupon code not valid");
      }
    } catch (error) {
      toast.error("Failed to validate coupon");
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    try {
      const res = await subscribe(appliedCoupon || undefined);
      if (res.success) {
        toast.success("Subscription successful! Welcome aboard.");
        router.push("/user/dashboard");
      } else {
        toast.error(res.message || "Subscription failed. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong during payment");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-none shadow-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl overflow-hidden relative border border-zinc-200 dark:border-zinc-800">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          
          <CardHeader className="text-center pt-10">
            <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20 rotate-3">
              <Zap className="text-white w-8 h-8 fill-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400">
              Go Premium
            </CardTitle>
            <CardDescription className="text-zinc-500 dark:text-zinc-400 text-lg">
              Unlock all features and elevate your experience
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  What's included:
                </h3>
                <ul className="space-y-3">
                  {[
                    "Unlimited Product Submissions",
                    "Early Access to Features",
                    "Premium Badge on Profile",
                    "Priority Support",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                        <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800 flex flex-col justify-center items-center text-center">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-medium">Monthly Plan</p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-zinc-900 dark:text-white">${discountedPrice}</span>
                  <span className="text-zinc-500 dark:text-zinc-400">/mo</span>
                </div>
                {discount > 0 && (
                  <motion.p 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-1 text-xs text-green-600 font-semibold bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full"
                  >
                    Save {discount}% with coupon
                  </motion.p>
                )}
                {discount > 0 && (
                   <p className="mt-1 text-xs text-zinc-400 line-through">${BASE_PRICE}</p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                <Gift className="w-4 h-4" /> Have a coupon code?
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-blue-500 h-11"
                  disabled={isValidating || isSubscribing}
                />
                <Button 
                  onClick={handleApplyCoupon}
                  variant="outline"
                  disabled={isValidating || isSubscribing || !couponCode}
                  className="h-11 px-6 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="px-8 pb-10">
            <Button
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-70"
              disabled={isSubscribing}
              onClick={handleSubscribe}
            >
              {isSubscribing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Subscribe Now
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default MySubscriptionPage;
