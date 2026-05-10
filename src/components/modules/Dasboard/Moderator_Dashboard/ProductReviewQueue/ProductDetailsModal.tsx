"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  ExternalLink, 
  MessageSquare, 
  ThumbsUp, 
  Flag,
  Save,
  Loader2,
  Calendar,
  User,
  Hash,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { toast } from "sonner";

import { updateProductByModerator } from "@/services/moderator-server-action";
import { IProduct } from "@/types/Dashboard/moderator-dashboard-types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProductDetailsModalProps {
  product: IProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const ProductDetailsModal = ({ product, isOpen, onClose, onUpdate }: ProductDetailsModalProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    links: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        links: product.links || "",
      });
    }
  }, [product]);

  const handleSave = async () => {
    if (!product) return;
    
    setIsUpdating(true);
    try {
      const res = await updateProductByModerator(product.id, formData);
      if (res.success) {
        toast.success("Product updated");
        onUpdate();
        onClose();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleQuickAction = async (status: "APPROVED" | "REJECTED") => {
    if (!product) return;
    setIsUpdating(true);
    try {
      const res = await updateProductByModerator(product.id, { status });
      if (res.success) {
        toast.success(`Product ${status.toLowerCase()}ed`);
        onUpdate();
        onClose();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl w-[96vw] sm:w-[94vw] md:w-[92vw] !max-w-[1200px] h-[95vh] md:h-[90vh] max-h-[95vh] rounded-2xl">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Mobile Header (No manual X button, relies on Dialog default) */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 md:hidden bg-white dark:bg-zinc-950 shrink-0">
            <DialogTitle className="text-base sm:text-lg font-bold truncate pr-3 text-zinc-900 dark:text-zinc-100">
              {product.name}
            </DialogTitle>
          </div>

          <div className="flex flex-col lg:flex-row flex-1 overflow-hidden min-h-0">
            {/* LEFT PANEL */}
            <ScrollArea className="w-full lg:w-[40%] xl:w-[35%] border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 min-h-0">
              <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20"></div>
                  <div className="relative aspect-video overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900">
                    <img 
                      src={product.photo} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className={`
                        px-3 py-1 text-[10px] font-black uppercase tracking-widest border-none
                        ${product.status === "APPROVED" ? "bg-emerald-500 text-white" : 
                          product.status === "REJECTED" ? "bg-rose-500 text-white" : 
                          "bg-amber-500 text-white"}
                      `}>
                        {product.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3 sm:p-4 flex flex-col items-center justify-center text-center shadow-sm">
                    <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mb-2" />
                    <span className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-100">{product._count?.votedUsers || 0}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wide text-zinc-500">Votes</span>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3 sm:p-4 flex flex-col items-center justify-center text-center shadow-sm">
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 mb-2" />
                    <span className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-100">{product._count?.reviews || 0}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wide text-zinc-500">Reviews</span>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3 sm:p-4 flex flex-col items-center justify-center text-center shadow-sm">
                    <Flag className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 mb-2" />
                    <span className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-100">{product._count?.reportedUsers || 0}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wide text-zinc-500">Reports</span>
                  </div>
                </div>

                {/* Info Card */}
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-5 sm:p-6 space-y-5 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-zinc-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-widest font-black text-zinc-400">Product Owner</p>
                      <p className="text-xs sm:text-sm font-medium text-zinc-800 dark:text-zinc-200 break-all">{product.ownerId}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-zinc-500" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-black text-zinc-400">Submission Date</p>
                      <p className="text-xs sm:text-sm font-medium text-zinc-800 dark:text-zinc-200">
                        {new Date(product.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                      <Hash className="w-5 h-5 text-zinc-500" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.tags?.map((t, i) => (
                        <Badge key={i} variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                          {t.tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full h-12 sm:h-14 rounded-2xl border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold"
                  asChild
                >
                  <a href={product.links} target="_blank" rel="noopener noreferrer">
                    Launch Project <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </ScrollArea>

            {/* RIGHT PANEL */}
            <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-white dark:bg-zinc-950">
              {/* Desktop Header (No manual X button) */}
              <div className="hidden md:flex flex-col px-6 lg:px-8 py-6 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
                <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">Moderation Panel</h2>
                <p className="text-sm text-zinc-500 mt-1">Review quality and update metadata.</p>
              </div>

              <ScrollArea className="flex-1 min-h-0">
                <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-400">Product Identity</Label>
                    <Input 
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="h-12 sm:h-14 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus-visible:ring-2 focus-visible:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-400">Project Endpoint</Label>
                    <Input 
                      value={formData.links}
                      onChange={(e) => setFormData(prev => ({ ...prev, links: e.target.value }))}
                      className="h-12 sm:h-14 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-400">Product Narrative</Label>
                    <Textarea 
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="min-h-[220px] sm:min-h-[300px] rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 resize-none p-4 sm:p-6"
                    />
                  </div>
                </div>
              </ScrollArea>

              {/* ACTION BAR */}
              <div className="border-t border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 lg:p-8 bg-white dark:bg-zinc-950 shrink-0">
                <div className="flex flex-col xl:flex-row gap-3 sm:gap-4">
                  <div className="flex flex-col sm:flex-row gap-3 flex-1">
                    <Button 
                      className="flex-1 h-12 sm:h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
                      onClick={() => handleQuickAction("APPROVED")}
                      disabled={isUpdating || product.status === "APPROVED"}
                    >
                      <CheckCircle2 className="w-5 h-5 mr-2" /> Approve
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 h-12 sm:h-14 rounded-2xl border-rose-200 dark:border-rose-900 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      onClick={() => handleQuickAction("REJECTED")}
                      disabled={isUpdating || product.status === "REJECTED"}
                    >
                      <XCircle className="w-5 h-5 mr-2" /> Reject
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={handleSave} 
                    disabled={isUpdating}
                    className="w-full xl:w-[220px] h-12 sm:h-14 rounded-2xl bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-bold"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" /> Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal;
