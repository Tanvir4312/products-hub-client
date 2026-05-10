"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Loader2, 
  Ticket, 
  Tag, 
  ExternalLink,
  Plus,
  AlertCircle,
  TrendingUp,
  Clock,
  Edit3,
  Trash2,
  Sparkles,
  Calendar,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Filter
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getAllCoupons } from "@/services/admin-server-action";
import { ICoupon } from "@/types/Dashboard/admin-dashboard-types/coupons-managements.types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateCouponModal from "@/components/modules/Dasboard/Admin_Dashboard/CouponsManagement/CreateCouponModal";
import UpdateCouponModal from "@/components/modules/Dasboard/Admin_Dashboard/CouponsManagement/UpdateCouponModal";
import DeleteCouponModal from "@/components/modules/Dasboard/Admin_Dashboard/CouponsManagement/DeleteCouponModal";

const CouponsManagement = () => {
  const router = useRouter();
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState<any>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [couponToUpdate, setCouponToUpdate] = useState<ICoupon | null>(null);
  const [couponToDelete, setCouponToDelete] = useState<ICoupon | null>(null);

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const res = await getAllCoupons(
        page, 
        limit, 
        searchTerm || undefined, 
        statusFilter === "all" ? undefined : statusFilter
      );
      if (res.success) {
        setCoupons(res.data.data);
        setMeta(res.data.meta);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Failed to load coupons");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCoupons();
    }, 500);
    return () => clearTimeout(timer);
  }, [page, limit, searchTerm, statusFilter]);

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-zinc-950 p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-900 shadow-xl shadow-zinc-200/20 dark:shadow-none relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Ticket className="w-40 h-40 text-zinc-900 dark:text-white" />
        </div>
        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-600 w-fit rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
            <Ticket className="w-3 h-3" />
            Voucher Governance
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 italic">Campaign <span className="text-zinc-400 font-serif">Coupons</span></h1>
          <p className="text-zinc-500 text-sm font-medium">Managing promotional incentives and redemption logic.</p>
          
          <Button 
            onClick={() => setIsCreateOpen(true)}
            className="h-12 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-amber-600/20 transition-all active:scale-95 gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Campaign Voucher
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto relative z-10">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              placeholder="Search voucher code..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="pl-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-amber-500/20 transition-all font-medium"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="h-12 rounded-2xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-[10px] font-black uppercase tracking-widest">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest">All Status</SelectItem>
                <SelectItem value="true" className="text-[10px] font-black uppercase tracking-widest">Active Only</SelectItem>
                <SelectItem value="false" className="text-[10px] font-black uppercase tracking-widest">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          [...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 h-64 rounded-[2.5rem]" />
          ))
        ) : coupons.length > 0 ? (
          coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="group relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 p-8 rounded-[2.5rem] transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-all">
                <Ticket className="w-16 h-16 text-zinc-900 dark:text-white" />
              </div>
              
              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                    coupon.isActive 
                      ? "bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white" 
                      : "bg-zinc-500/10 text-zinc-600 group-hover:bg-zinc-500 group-hover:text-white"
                  }`}>
                    <Tag size={20} />
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-[-10px] group-hover:translate-y-0">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => { setCouponToUpdate(coupon); setIsUpdateOpen(true); }}
                      className="h-10 w-10 rounded-xl hover:bg-amber-500/10 hover:text-amber-600"
                    >
                      <Edit3 size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => { setCouponToDelete(coupon); setIsDeleteOpen(true); }}
                      className="h-10 w-10 rounded-xl hover:bg-rose-500/10 hover:text-rose-600"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-black tracking-tighter text-2xl text-zinc-900 dark:text-zinc-100 uppercase">{coupon.couponCode}</h3>
                  <p className="text-zinc-500 text-xs font-medium line-clamp-2">{coupon.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-zinc-100 dark:border-zinc-900">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Discount</p>
                    <p className="text-sm font-black text-amber-600">${coupon.discount}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Expiry</p>
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {new Date(coupon.expiryDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {coupon.isActive ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/10 rounded-lg text-[10px] font-black uppercase tracking-widest px-2 py-0.5">
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-zinc-500/10 text-zinc-600 border-zinc-500/20 hover:bg-zinc-500/10 rounded-lg text-[10px] font-black uppercase tracking-widest px-2 py-0.5">
                        Inactive
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    <Clock size={10} />
                    Limit: {coupon.usageLimit || "∞"}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full h-96 flex flex-col items-center justify-center space-y-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-[3rem] opacity-50">
            <AlertCircle className="w-16 h-16 text-zinc-400" />
            <div className="text-center">
              <p className="font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest text-sm italic">Zero Voucher Records</p>
              <p className="text-zinc-500 text-[10px] font-bold uppercase mt-1 tracking-tighter">No coupons matched your current campaign query.</p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination Section */}
      {meta && meta.total_page > 1 && (
        <div className="flex justify-center items-center gap-4 pt-8">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="h-12 w-12 rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-amber-500/10 hover:text-amber-600 transition-all"
          >
            <ChevronLeft size={20} />
          </Button>
          <div className="flex gap-2">
            {[...Array(meta.total_page)].map((_, i) => (
              <Button
                key={i}
                variant={page === i + 1 ? "default" : "outline"}
                onClick={() => setPage(i + 1)}
                className={`h-12 w-12 rounded-2xl font-black transition-all ${
                  page === i + 1 
                    ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20" 
                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-amber-500/10 hover:text-amber-600"
                }`}
              >
                {i + 1}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            disabled={page === meta.total_page}
            onClick={() => setPage(page + 1)}
            className="h-12 w-12 rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-amber-500/10 hover:text-amber-600 transition-all"
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      )}

      {/* Modals */}
      <CreateCouponModal 
        isOpen={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
        onSuccess={fetchCoupons} 
      />
      
      <UpdateCouponModal 
        coupon={couponToUpdate} 
        isOpen={isUpdateOpen} 
        onOpenChange={setIsUpdateOpen} 
        onSuccess={fetchCoupons} 
      />

      <DeleteCouponModal 
        coupon={couponToDelete} 
        isOpen={isDeleteOpen} 
        onOpenChange={setIsDeleteOpen} 
        onSuccess={fetchCoupons} 
      />
    </div>
  );
};

export default CouponsManagement;
