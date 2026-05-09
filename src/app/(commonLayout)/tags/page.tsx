"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Hash, Search, ArrowRight, Sparkles, Tag as TagIcon, Rocket } from 'lucide-react'
import { useTags } from '@/hooks/useTags'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from '@/lib/utils'

const TagSkeleton = () => (
  <div className="bg-background border border-border rounded-3xl p-6 space-y-4">
    <div className="flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-2xl" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  </div>
)

const TagsPage = () => {
  const [selectedTag, setSelectedTag] = React.useState('all')
  const { data: tags, isLoading, isError } = useTags()

  const displayTags = React.useMemo(() => {
    if (!tags || selectedTag === 'all') return tags
    return tags.filter(t => t.name === selectedTag)
  }, [tags, selectedTag])

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <div className="relative pt-24 pb-16 overflow-hidden border-b border-border/50 bg-muted/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -ml-64 -mb-64" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="max-w-2xl space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/10"
            >
              <Hash className="w-3.5 h-3.5" />
              Categorical Discovery
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl font-black text-foreground tracking-tighter"
            >
              Explore by <span className="text-primary italic font-serif">Topic</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg font-medium leading-relaxed"
            >
              Discover innovations organized by industry, technology, and use-case. Find exactly what you're looking for.
            </motion.p>
          </div>

          {/* Tag Select Filter */}
          <div className="flex flex-col gap-2 w-full md:max-w-xs">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ml-1">Subject</span>
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-full h-14 rounded-2xl bg-background border border-border shadow-xl shadow-primary/5 focus:ring-1 focus:ring-primary font-bold transition-all">
                <SelectValue placeholder="All Tags" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-border shadow-2xl">
                <SelectItem value="all" className="rounded-xl font-bold py-3">All Tags</SelectItem>
                {tags?.map((tag) => (
                  <SelectItem key={tag.id} value={tag.name} className="rounded-xl font-medium py-3">
                    {tag.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 space-y-10">
        {selectedTag !== 'all' && (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-500">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-black text-foreground tracking-tight">
              Isolated Discovery: <span className="text-primary italic font-serif">{selectedTag}</span>
            </h2>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => <TagSkeleton key={i} />)}
          </div>
        ) : isError ? (
          <div className="text-center py-20 bg-destructive/5 rounded-[3rem] border border-destructive/10">
            <p className="text-destructive font-bold">Failed to load innovation tags. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayTags?.map((tag, index) => (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/products?tagName=${tag.name}`}>
                  <div className="group relative bg-background border border-border rounded-[2rem] p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 overflow-hidden">

                    {/* Decorative Background Icon */}
                    <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                      <TagIcon className="w-24 h-24 rotate-12" />
                    </div>

                    <div className="flex items-center gap-5 relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <TagIcon className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-black text-foreground tracking-tight group-hover:text-primary transition-colors">
                          {tag.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                          <Rocket className="w-3 h-3" />
                          View Innovations
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border/50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-bold text-muted-foreground">Click to browse</span>
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && tags?.length === 0 && (
          <div className="text-center py-40 border-2 border-dashed border-border/50 rounded-[3rem]">
            <Sparkles className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium italic">No tags have been registered yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TagsPage
