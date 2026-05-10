"use client";

import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { updateCoupon } from "@/services/admin-server-action";
import { Loader2, Edit3, Ticket, DollarSign, Calendar, Hash, Info, Power } from "lucide-react";
import { ICoupon } from "@/types/Dashboard/admin-dashboard-types/coupons-managements.types";
import { Switch } from "@/components/ui/switch";

interface UpdateCouponModalProps {
  coupon: ICoupon | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const UpdateCouponModal = ({ coupon, isOpen, onOpenChange, onSuccess }: UpdateCouponModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    discount: "",
    expiryDate: "",
    usageLimit: "",
    isActive: true,
  });

  useEffect(() => {
    if (coupon) {
      setFormData({
        description: coupon.description,
        discount: coupon.discount.toString(),
        expiryDate: new Date(coupon.expiryDate).toISOString().split("T")[0],
        usageLimit: coupon.usageLimit?.toString() || "",
        isActive: coupon.isActive,
      });
    }
  }, [coupon]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coupon) return;
    
    setIsLoading(true);
    try {
      const payload = {
        description: formData.description,
        discount: parseFloat(formData.discount),
        expiryDate: formData.expiryDate,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
        isActive: formData.isActive,
      };

      const res = await updateCoupon(coupon.id, payload);
      if (res.success) {
        toast.success("Voucher updated successfully");
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("An error occurred while updating coupon");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <Edit3 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-2xl font-black tracking-tighter italic text-zinc-900 dark:text-zinc-100">Update <span className="text-amber-600 font-serif lowercase">#{coupon?.couponCode}</span></DialogTitle>
            <DialogDescription className="text-zinc-500 font-medium leading-relaxed">
              Synchronize campaign parameters and administrative metadata.
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="flex items-center justify-between p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10">
            <div className="flex items-center gap-3">
              <Power className={`w-5 h-5 ${formData.isActive ? "text-emerald-500" : "text-zinc-400"}`} />
              <div className="space-y-0.5">
                <p className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100">Active Status</p>
                <p className="text-[10px] font-medium text-zinc-500 italic">Toggle campaign availability</p>
              </div>
            </div>
            <Switch 
              checked={formData.isActive} 
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              className="data-[state=checked]:bg-amber-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="updateDiscount" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Discount Amount ($)</Label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                id="updateDiscount"
                type="number"
                step="0.01"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                className="pl-12 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-amber-500/20 transition-all font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="updateDescription" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Campaign Description</Label>
            <Textarea
              id="updateDescription"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[100px] rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-amber-500/20 transition-all font-medium py-4 px-6 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="updateExpiryDate" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Expiration Date</Label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  id="updateExpiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="pl-12 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-amber-500/20 transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="updateUsageLimit" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Usage Limit</Label>
              <div className="relative">
                <Info className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  id="updateUsageLimit"
                  type="number"
                  placeholder="∞"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  className="pl-12 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-amber-500/20 transition-all font-bold"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-6">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-14 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-amber-600/20 transition-all active:scale-95 gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Synchronizing Parameters...
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  Update Voucher Record
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCouponModal;
