"use client";

import React, { useState } from "react";
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
import { createCoupon } from "@/services/admin-server-action";
import { Loader2, Plus, Ticket, DollarSign, Calendar, Hash, Info } from "lucide-react";

interface CreateCouponModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const CreateCouponModal = ({ isOpen, onOpenChange, onSuccess }: CreateCouponModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    couponCode: "",
    description: "",
    discount: "",
    expiryDate: "",
    usageLimit: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.couponCode || !formData.description || !formData.discount || !formData.expiryDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        discount: parseFloat(formData.discount),
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
      };

      const res = await createCoupon(payload);
      if (res.success) {
        toast.success("Coupon created successfully");
        setFormData({
          couponCode: "",
          description: "",
          discount: "",
          expiryDate: "",
          usageLimit: "",
        });
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("An error occurred while creating coupon");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <Plus className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-2xl font-black tracking-tighter italic text-zinc-900 dark:text-zinc-100">Create <span className="text-amber-600 font-serif lowercase">#CampaignVoucher</span></DialogTitle>
            <DialogDescription className="text-zinc-500 font-medium leading-relaxed">
              Register a new promotional code with custom discount and expiry logic.
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="couponCode" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Voucher Code</Label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  id="couponCode"
                  placeholder="SAVE50"
                  value={formData.couponCode}
                  onChange={(e) => setFormData({ ...formData, couponCode: e.target.value.toUpperCase() })}
                  className="pl-12 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-amber-500/20 transition-all font-bold uppercase"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Discount Amount ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  id="discount"
                  type="number"
                  placeholder="19.99"
                  step="0.01"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  className="pl-12 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-amber-500/20 transition-all font-bold"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Campaign Description</Label>
            <Textarea
              id="description"
              placeholder="Provide context for this promotional campaign..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[100px] rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-amber-500/20 transition-all font-medium py-4 px-6 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Expiration Date</Label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="pl-12 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-amber-500/20 transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="usageLimit" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Usage Limit (Optional)</Label>
              <div className="relative">
                <Info className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  id="usageLimit"
                  type="number"
                  placeholder="100"
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
                  Generating Voucher...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Register Campaign Voucher
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCouponModal;
