"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Trophy, AlertCircle, Heart } from 'lucide-react'
import Link from 'next/link'
import { useMostVotedProducts } from '@/hooks/useProducts'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductCard } from '@/components/shared/ProductCard/ProductCard'

const ProductSkeleton = () => (
  <div className="bg-background border border-border rounded-[2rem] overflow-hidden">
    <Skeleton className="aspect-[16/10] w-full rounded-none" />
    <div className="p-6 space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-10" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-8 w-full" />
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-border/50">
        <Skeleton className="h-7 w-20 rounded-full" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  </div>
)

const MostVotedProducts = () => {
  const { data: products, isLoading, isError, error } = useMostVotedProducts(5)

  return (
    <section className="w-full bg-muted/5">
      <div className="px-3 lg:px-0 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/10"
            >
              <Trophy className="w-3.5 h-3.5" />
              Community Choice
            </motion.div>
            <div className="space-y-2">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl sm:text-5xl font-black text-foreground tracking-tighter"
              >
                Most Voted <span className="text-primary italic font-serif">Innovations</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground max-w-xl font-medium"
              >
                Discover the products that the community loves most. These are our top-ranked innovations by total support.
              </motion.p>
            </div>
          </div>

          {products && products.length > 4 && (
            <Link href="/products/most-voted">
              <Button variant="outline" className="group h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 hover:bg-primary hover:text-white hover:border-primary transition-all">
                View All Most Voted Products
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          )}
        </div>

        {/* Smart Grid */}
        {isError ? (
          <div className="bg-destructive/5 border border-destructive/10 rounded-[2.5rem] p-12 text-center">
            <div className="h-16 w-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-xl font-black text-destructive mb-2 uppercase tracking-tight">Sync Error</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              {error?.message || "Failed to load the community leaderboard."}
            </p>
            <Button onClick={() => window.location.reload()} variant="outline" size="sm" className="mt-6 rounded-lg border-destructive/20 text-destructive text-[10px] font-black uppercase">
              Retry Sync
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
              : products?.slice(0, 4).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && products?.length === 0 && (
          <div className="py-24 text-center border-2 border-dashed border-border/50 rounded-[3rem] bg-muted/5">
            <p className="text-muted-foreground font-bold italic tracking-tight opacity-50">
              The community hasn't started voting yet.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default MostVotedProducts
