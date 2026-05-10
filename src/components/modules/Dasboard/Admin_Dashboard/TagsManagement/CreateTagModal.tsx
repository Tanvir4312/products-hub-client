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
import { toast } from "sonner";
import { createTag } from "@/services/admin-server-action";
import { Loader2, Plus, Hash } from "lucide-react";

interface CreateTagModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const CreateTagModal = ({ isOpen, onOpenChange, onSuccess }: CreateTagModalProps) => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      toast.error("Tag name must be at least 2 characters");
      return;
    }

    setIsLoading(true);
    try {
      const res = await createTag({ name: name.trim() });
      if (res.success) {
        toast.success("Tag created successfully");
        setName("");
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("An error occurred while creating tag");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 shadow-2xl">
        <DialogHeader className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-600">
            <Plus className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-2xl font-black tracking-tighter italic">Create <span className="text-teal-600 font-serif">Taxonomy</span></DialogTitle>
            <DialogDescription className="text-zinc-500 font-medium">Add a new classification tag to the platform index.</DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="tagName" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Tag Name</Label>
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                id="tagName"
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
                  Generating Classification...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Taxonomy Record
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTagModal;
