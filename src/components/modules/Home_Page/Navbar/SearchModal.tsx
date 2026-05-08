"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useEffect, useRef } from "react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-2 sm:p-4 overflow-hidden"
          >
            <div className="relative flex items-center">
              <Search className="absolute left-6 w-6 h-6 text-slate-400 dark:text-slate-500" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search notices, results, teachers..."
                className="w-full bg-transparent text-slate-900 dark:text-white text-lg sm:text-xl font-medium pl-16 pr-16 py-6 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
              <button
                onClick={onClose}
                className="absolute right-4 p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-2xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Suggestions / Info */}
            <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Quick Hits:</span>
                {["Notices", "Results", "Faculty", "Admission"].map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1 text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-500/20 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
