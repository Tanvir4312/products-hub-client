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
import { toast } from "sonner";
import { deleteCoupon } from "@/services/admin-server-action";
import { Loader2, Trash2, AlertTriangle, Hash, Ticket } from "lucide-react";
import { ICoupon } from "@/types/Dashboard/admin-dashboard-types/coupons-managements.types";

interface DeleteCouponModalProps {
  coupon: ICoupon | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const DeleteCouponModal = ({ coupon, isOpen, onOpenChange, onSuccess }: DeleteCouponModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!coupon) return;
    
    setIsLoading(true);
    try {
      const res = await deleteCoupon(coupon.id);
      if (res.success) {
        toast.success("Voucher purged successfully");
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Failed to purge voucher record");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] rounded-[2.5rem] border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 shadow-2xl">
        <DialogHeader className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-600 animate-pulse">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-2xl font-black tracking-tighter italic text-rose-600">Purge <span className="text-zinc-900 dark:text-zinc-100 font-serif">Campaign</span></DialogTitle>
            <DialogDescription className="text-zinc-500 font-medium leading-relaxed">
              You are about to permanently decommission voucher <span className="text-zinc-900 dark:text-zinc-100 font-bold uppercase tracking-tighter">#{coupon?.couponCode}</span>.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="py-4 px-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-start gap-3">
          <Ticket className="w-5 h-5 text-zinc-400 mt-1 flex-shrink-0" />
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
            Warning: This action will immediately invalidate the code for all future redemptions. Existing discount histories will remain in audit logs.
          </p>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
          >
            Abort Action
          </Button>
          <Button 
            onClick={handleDelete}
            disabled={isLoading}
            className="flex-1 h-14 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-rose-600/20 transition-all active:scale-95 gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Purging...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Confirm Decommission
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCouponModal;
