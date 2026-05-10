"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Loader2, 
  Tags, 
  Hash, 
  ExternalLink,
  Plus,
  AlertCircle,
  TrendingUp,
  Clock,
  Edit3,
  Trash2,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getAllTags, deleteTag } from "@/services/admin-server-action";
import { ITag } from "@/types/Dashboard/admin-dashboard-types/tags-managements.types";
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
import CreateTagModal from "./CreateTagModal";
import UpdateTagModal from "./UpdateTagModal";
import DeleteTagModal from "./DeleteTagModal";

const TagsManagement = () => {
  const router = useRouter();
  const [tags, setTags] = useState<ITag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState("all");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [tagToUpdate, setTagToUpdate] = useState<ITag | null>(null);
  const [tagToDelete, setTagToDelete] = useState<ITag | null>(null);

  const fetchTags = async () => {
    setIsLoading(true);
    try {
      const res = await getAllTags();
      if (res.success) {
        setTags(res.data);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Failed to load tags");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const displayTags = React.useMemo(() => {
    if (selectedTag === "all") return tags;
    return tags.filter(t => t.name === selectedTag);
  }, [tags, selectedTag]);

  const handleTagClick = (tagName: string) => {
    router.push(`/products?tagName=${tagName}`);
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-zinc-950 p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-900 shadow-xl shadow-zinc-200/20 dark:shadow-none relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Hash className="w-40 h-40 text-zinc-900 dark:text-white" />
        </div>
        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-2 px-3 py-1 bg-teal-500/10 text-teal-600 w-fit rounded-lg text-[10px] font-black uppercase tracking-widest border border-teal-500/20">
            <Tags className="w-3 h-3" />
            Taxonomy Governance
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 italic">Classification <span className="text-zinc-400 font-serif">Tags</span></h1>
          <p className="text-zinc-500 text-sm font-medium">Managing platform classification system and innovation discovery.</p>
          
          <Button 
            onClick={() => setIsCreateOpen(true)}
            className="h-12 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-teal-600/20 transition-all active:scale-95 gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Taxonomy
          </Button>
        </div>

        <div className="flex flex-col gap-2 w-full md:max-w-xs relative z-10">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-600/60 ml-1">Subject</span>
          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="w-full h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-teal-500/5 focus:ring-1 focus:ring-teal-500 font-bold transition-all text-xs uppercase tracking-widest px-6">
              <SelectValue placeholder="All Tags" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-zinc-200 dark:border-zinc-800 shadow-2xl">
              <SelectItem value="all" className="rounded-xl font-black py-3 text-[10px] uppercase tracking-widest">All Tags</SelectItem>
              {tags.map((tag) => (
                <SelectItem key={tag.id} value={tag.name} className="rounded-xl font-bold py-3 text-[10px] uppercase tracking-widest">
                  {tag.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedTag !== 'all' && (
        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-500">
          <Sparkles className="w-5 h-5 text-teal-600" />
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight italic">
            Isolated Governance: <span className="text-teal-600 font-serif lowercase">#{selectedTag}</span>
          </h2>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {isLoading ? (
          [...Array(15)].map((_, i) => (
            <div key={i} className="animate-pulse bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 h-32 rounded-[2rem]" />
          ))
        ) : displayTags.length > 0 ? (
          displayTags.map((tag) => (
            <div
              key={tag.id}
              className="group relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 p-6 rounded-[2.5rem] transition-all duration-500 hover:shadow-2xl hover:shadow-teal-500/10 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-all">
                <Hash className="w-12 h-12 text-zinc-900 dark:text-white" />
              </div>
              
              <div className="relative z-10 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-600 group-hover:bg-teal-500 group-hover:text-white transition-all duration-500">
                    <Hash size={18} />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all translate-y-[-10px] group-hover:translate-y-0">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => { setTagToUpdate(tag); setIsUpdateOpen(true); }}
                      className="h-8 w-8 rounded-lg hover:bg-teal-500/10 hover:text-teal-600"
                    >
                      <Edit3 size={14} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => { setTagToDelete(tag); setIsDeleteOpen(true); }}
                      className="h-8 w-8 rounded-lg hover:bg-rose-500/10 hover:text-rose-600"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-black tracking-tighter text-zinc-900 dark:text-zinc-100 uppercase text-sm">{tag.name}</h3>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    <Clock size={10} />
                    {new Date(tag.createdAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  onClick={() => handleTagClick(tag.name)}
                  className="w-full h-10 px-0 rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 text-teal-600 hover:bg-teal-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 border border-teal-500/20"
                >
                  <ExternalLink size={12} />
                  Explore Intel
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full h-96 flex flex-col items-center justify-center space-y-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-[3rem] opacity-50">
            <AlertCircle className="w-16 h-16 text-zinc-400" />
            <div className="text-center">
              <p className="font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest text-sm italic">Zero Taxonomy Records</p>
              <p className="text-zinc-500 text-[10px] font-bold uppercase mt-1 tracking-tighter">No tags matched your current classification query.</p>
            </div>
          </div>
        )}
      </div>

      <CreateTagModal 
        isOpen={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
        onSuccess={fetchTags} 
      />
      
      <UpdateTagModal 
        tag={tagToUpdate} 
        isOpen={isUpdateOpen} 
        onOpenChange={setIsUpdateOpen} 
        onSuccess={fetchTags} 
      />

      <DeleteTagModal 
        tag={tagToDelete} 
        isOpen={isDeleteOpen} 
        onOpenChange={setIsDeleteOpen} 
        onSuccess={fetchTags} 
      />
    </div>
  );
};

export default TagsManagement;
