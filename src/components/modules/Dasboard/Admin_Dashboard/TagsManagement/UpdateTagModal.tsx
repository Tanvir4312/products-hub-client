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
import { toast } from "sonner";
import { updateTag } from "@/services/admin-server-action";
import { Loader2, Edit3, Hash } from "lucide-react";
import { ITag } from "@/types/Dashboard/admin-dashboard-types/tags-managements.types";

interface UpdateTagModalProps {
  tag: ITag | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const UpdateTagModal = ({ tag, isOpen, onOpenChange, onSuccess }: UpdateTagModalProps) => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (tag) {
      setName(tag.name);
    }
  }, [tag]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tag) return;
    
    if (name.trim().length < 2) {
      toast.error("Tag name must be at least 2 characters");
      return;
    }

    setIsLoading(true);
    try {
      const res = await updateTag(tag.id, { name: name.trim() });
      if (res.success) {
        toast.success("Tag updated successfully");
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("An error occurred while updating tag");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 shadow-2xl">
        <DialogHeader className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-600">
            <Edit3 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-2xl font-black tracking-tighter italic">Update <span className="text-teal-600 font-serif">Taxonomy</span></DialogTitle>
            <DialogDescription className="text-zinc-500 font-medium">Modify existing classification metadata.</DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="updateTagName" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Tag Name</Label>
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                id="updateTagName"
                placeholder="e.g. Artificial Intelligence"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-12 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-teal-500/20 transition-all font-bold"
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-14 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-teal-600/20 transition-all active:scale-95 gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Synchronizing Metadata...
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  Update Taxonomy Record
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTagModal;
