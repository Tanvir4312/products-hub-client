"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import { useNewReleases } from '@/hooks/useProducts'
import { ProductCard } from '@/components/shared/ProductCard/ProductCard'
import { Skeleton } from '@/components/ui/skeleton'

const NewReleasesPage = () => {
  const { data: products, isLoading, isError } = useNewReleases(24)

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 sm:py-20 space-y-12">
      {/* Header Section */}
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-indigo-600/5 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-600/10"
        >
          <Clock className="w-3.5 h-3.5" />
          Fresh Innovations
        </motion.div>
        
        <div className="space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-black text-foreground tracking-tighter"
          >
            New <span className="text-indigo-600 italic font-serif">Releases</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-xl font-medium"
          >
            Explore the latest products and tools that have just landed on our platform. Stay up to date with the newest releases from creators around the globe.
          </motion.p>
        </div>
      </div>

      {/* Products Grid */}
      {isError ? (
        <div className="py-20 text-center bg-destructive/5 rounded-[3rem] border border-destructive/10">
          <p className="text-destructive font-black uppercase tracking-tight">Sync Error</p>
          <p className="text-muted-foreground text-sm">Failed to retrieve the latest releases.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[16/10] w-full rounded-[2rem]" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))
            : products?.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && products?.length === 0 && (
        <div className="py-32 text-center border-2 border-dashed border-border/50 rounded-[4rem] bg-muted/5">
          <div className="h-20 w-20 bg-muted/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Clock className="h-10 w-10 text-muted-foreground/30" />
          </div>
          <p className="text-muted-foreground text-xl font-bold italic tracking-tight opacity-50">
            No new releases found in the current period.
          </p>
        </div>
      )}
    </div>
  )
}

export default NewReleasesPage
