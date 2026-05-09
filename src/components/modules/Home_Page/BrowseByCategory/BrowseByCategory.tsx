"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutGrid, AlertCircle, Search, Sparkles, ArrowRight } from 'lucide-react'
import { useTags } from '@/hooks/useTags'
import { useFeaturedProducts } from '@/hooks/useProducts'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductCard } from '@/components/shared/ProductCard/ProductCard'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const TagSkeleton = () => (
  <Skeleton className="h-10 w-24 rounded-xl" />
)

const ProductSkeleton = () => (
  <div className="bg-background border border-border rounded-[2rem] overflow-hidden">
    <Skeleton className="aspect-[16/10] w-full rounded-none" />
    <div className="p-6 space-y-4">
      <div className="space-y-2">
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

const BrowseByCategory = () => {
  const { data: tags, isLoading: isTagsLoading, isError: isTagsError } = useTags()
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // Fetch products filtered by the selected tag
  const {
    data: products,
    isLoading: isProductsLoading,
    isError: isProductsError
  } = useFeaturedProducts(
    selectedTag ? { tagName: selectedTag } : undefined,
    { showAll: true }
  )

  // Handle tag selection
  const handleTagClick = (tagName: string) => {
    if (selectedTag === tagName) {
      setSelectedTag(null) // Unselect if clicked again
    } else {
      setSelectedTag(tagName)
    }
  }

  return (
    <section className="w-full bg-muted/5">
      <div className="px-3 lg:px-0 space-y-12">
        {/* Section Header */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/10"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Discover by Topic
          </motion.div>
          <div className="space-y-2">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl font-black text-foreground tracking-tighter"
            >
              Browse by <span className="text-primary italic font-serif">Category</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground max-w-xl font-medium"
            >
              Filter our vast index of innovations by specific industries and technologies to find exactly what you're looking for.
            </motion.p>
          </div>
        </div>

        {/* Tag Cloud */}
        <div className="space-y-8">
          <div className="flex flex-wrap gap-3">
            {isTagsLoading ? (
              Array.from({ length: 8 }).map((_, i) => <TagSkeleton key={i} />)
            ) : isTagsError ? (
              <p className="text-destructive text-sm font-bold">Failed to load categories.</p>
            ) : (
              <>
                <Button
                  onClick={() => setSelectedTag(null)}
                  variant={selectedTag === null ? "default" : "outline"}
                  className={cn(
                    "rounded-xl h-10 px-6 font-black uppercase tracking-widest text-[10px] transition-all",
                    selectedTag === null ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:border-primary hover:text-primary"
                  )}
                >
                  All Innovations
                </Button>
                {tags?.map((tag) => (
                  <Button
                    key={tag.id}
                    onClick={() => handleTagClick(tag.name)}
                    variant={selectedTag === tag.name ? "default" : "outline"}
                    className={cn(
                      "rounded-xl h-10 px-6 font-black uppercase tracking-widest text-[10px] transition-all",
                      selectedTag === tag.name ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:border-primary hover:text-primary"
                    )}
                  >
                    {tag.name}
                  </Button>
                ))}
              </>
            )}
          </div>

          {/* Products Grid */}
          <div className="min-h-[400px] space-y-12">
            {isProductsError ? (
              <div className="py-20 text-center bg-destructive/5 rounded-[2.5rem] border border-destructive/10">
                <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
                <p className="text-destructive font-black uppercase tracking-tight">Sync Interrupt</p>
                <p className="text-muted-foreground text-sm">Failed to load filtered innovations.</p>
              </div>
            ) : (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedTag || 'all'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
                  >
                    {isProductsLoading
                      ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
                      : products && products.length > 0 ? (
                        products.slice(0, 4).map((product, index) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <ProductCard product={product} />
                          </motion.div>
                        ))
                      ) : (
                        <div className="col-span-full py-32 text-center border-2 border-dashed border-border/50 rounded-[3rem] bg-muted/5">
                          <Search className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                          <p className="text-muted-foreground font-bold italic tracking-tight opacity-50">
                            No innovations found under "{selectedTag || 'this'}" category yet.
                          </p>
                        </div>
                      )}
                  </motion.div>
                </AnimatePresence>

                {/* View All for Category */}
                {!isProductsLoading && products && products.length > 4 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center pt-4"
                  >
                    <Link href={selectedTag ? `/products?tag=${selectedTag}` : "/products"}>
                      <Button variant="outline" className="group h-12 px-10 rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-xl shadow-primary/5">
                        View All {selectedTag ? `in ${selectedTag}` : "Innovations"}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default BrowseByCategory
