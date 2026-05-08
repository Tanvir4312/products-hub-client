"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, BookOpen, Bell, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ContentItem {
  id: string;
  title: string;
  details?: string;
  type?: string;
  createdAt: string;
  category?: string;
  imageUrl?: string;
}

interface RecommendedContentProps {
  items: ContentItem[];
  title?: string;
  isLoading?: boolean;
}

export default function RecommendedContent({ 
  items, 
  title = "Suggested for You", 
  isLoading = false 
}: RecommendedContentProps) {
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-[2rem]" />
        ))}
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm uppercase tracking-widest">
            <Sparkles size={16} className="animate-pulse" />
            <span>AI Powered Suggestions</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {title}
          </h2>
        </div>
        <Link 
          href="/notices" 
          className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors"
        >
          View All
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-6 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
          >
            {/* "Suggested for You" Badge */}
            <div className="absolute top-4 right-4 z-10">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-emerald-500/20">
                <Sparkles size={10} />
                Recommended
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${
                  item.type === 'NOTICE' 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' 
                    : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600'
                }`}>
                  {item.type === 'NOTICE' ? <Bell size={20} /> : <BookOpen size={20} />}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    {item.type || 'Knowledge'}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Calendar size={12} />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight group-hover:text-emerald-600 transition-colors">
                {item.title}
              </h3>

              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed font-medium">
                {item.details || "Click to explore more details about this interesting update from FaithBridge International Academy."}
              </p>

              <div className="pt-2">
                <Link 
                  href={`/notices/${item.id}`}
                  className="inline-flex items-center gap-2 text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest group-hover:gap-3 transition-all"
                >
                  Read More
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
