"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, LayoutGrid, AlertCircle, Sparkles } from 'lucide-react'
import { ProductCard } from '@/components/shared/ProductCard/ProductCard'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import { useTags } from '@/hooks/useTags'
import { Tag as TagIcon } from 'lucide-react'
import { IProduct, IProductResponse } from '@/types/product.types'
import { useQueryClient } from '@tanstack/react-query'

const ProductSkeleton = () => (
  <div className="bg-background border border-border rounded-[2.5rem] overflow-hidden">
    <Skeleton className="aspect-[16/10] w-full" />
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

interface ProductsClientProps {
  initialData: IProductResponse["data"]
  initialUser: any
}

const ProductsClient = ({ initialData, initialUser }: ProductsClientProps) => {
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const initialTag = searchParams.get('tagName') || ''

  // Pre-hydrate user data from server to prevent "please login" flash
  React.useEffect(() => {
    if (initialUser) {
      queryClient.setQueryData(["user", "me"], initialUser)
    }
  }, [initialUser, queryClient])

  // State for filters and pagination
  const [tagName, setTagName] = useState(initialTag)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  // Fetch available tags for the filter
  const { data: tagsData } = useTags()

  // Update tagName if URL changes
  React.useEffect(() => {
    if (initialTag !== tagName) {
      setTagName(initialTag)
      setPage(1)
    }
  }, [initialTag])

  // Get cached data or use initial data
  const cachedData = queryClient.getQueryData<IProductResponse["data"]>(["products", "all", { tagName: tagName !== 'all' ? (tagName || undefined) : undefined, sortBy, sortOrder, page, limit }])
  const data = cachedData || initialData
  const isLoading = false
  const isError = false
  const error = null as Error | null

  const products = data?.data || []
  const meta = data?.meta

  const handleTagChange = (value: string) => {
    setTagName(value)
    setPage(1)
  }

  const handleSortChange = (value: string) => {
    const [field, order] = value.split('-')
    setSortBy(field)
    setSortOrder(order)
    setPage(1)
  }

  const handleLimitChange = (value: string) => {
    setLimit(Number(value))
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <div className="relative pt-20 pb-12 overflow-hidden border-b border-border/50 bg-muted/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full -ml-48 -mb-48" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="space-y-4 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/10"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Innovation Catalog
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl sm:text-6xl font-black text-foreground tracking-tighter"
            >
              Discover <span className="text-primary italic font-serif">Solutions</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg font-medium"
            >
              Browse through a world of community-driven innovations, from AI tools to creative SaaS.
            </motion.p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 space-y-12">
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-background border border-border/50 p-6 rounded-[2rem] shadow-xl shadow-muted/50">
          {/* Tag Select Filter */}
          <div className="flex flex-col gap-2 w-full lg:max-w-xs">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ml-1">Tags</span>
             <Select value={tagName || 'all'} onValueChange={handleTagChange}>
                <SelectTrigger className="w-full h-12 rounded-2xl bg-muted/30 border border-border/50 focus:ring-1 focus:ring-primary font-bold shadow-sm hover:bg-muted/50 transition-all">
                  <SelectValue placeholder="All Tags" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-border shadow-2xl">
                  <SelectItem value="all" className="rounded-xl font-bold py-3">All Tags</SelectItem>
                  {tagsData?.map((tag) => (
                    <SelectItem key={tag.id} value={tag.name} className="rounded-xl font-medium py-3">
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
          </div>

          <div className="flex flex-wrap items-center gap-6 w-full lg:w-auto">

            {/* Sort */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sort By</span>
              <Select defaultValue="createdAt-desc" onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px] h-12 rounded-xl bg-muted/30 border-none focus:ring-1 focus:ring-primary">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border">
                  <SelectItem value="createdAt-desc">Newest First</SelectItem>
                  <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                  <SelectItem value="votes-desc">Most Voted</SelectItem>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Limit */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Show</span>
              <Select defaultValue="10" onValueChange={handleLimitChange}>
                <SelectTrigger className="w-[100px] h-12 rounded-xl bg-muted/30 border-none focus:ring-1 focus:ring-primary">
                  <SelectValue placeholder="Limit" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border">
                  <SelectItem value="5">5 items</SelectItem>
                  <SelectItem value="10">10 items</SelectItem>
                  <SelectItem value="20">20 items</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Info & Active Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
          {!isLoading && !isError && (
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-muted-foreground">
                Showing <span className="text-foreground">{products.length}</span> of <span className="text-foreground">{meta?.total}</span> innovations
              </span>
            </div>
          )}

          {tagName && tagName !== 'all' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-wider"
            >
              <TagIcon className="w-3.5 h-3.5" />
              {tagName}
              <button 
                onClick={() => setTagName('all')}
                className="ml-2 hover:text-foreground transition-colors"
              >
                ×
              </button>
            </motion.div>
          )}
        </div>


        {/* Grid Layout */}
        <AnimatePresence mode="wait">
          {isError ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-destructive/5 border border-destructive/10 rounded-[3rem] p-20 text-center space-y-4"
            >
              <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
              <h3 className="text-xl font-black text-destructive uppercase tracking-tight">Data Sync Error</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                {error?.message || "Failed to retrieve the innovation catalog."}
              </p>
              <Button onClick={() => window.location.reload()} variant="outline" className="rounded-xl border-destructive/20 text-destructive font-black uppercase text-[10px]">
                Try Again
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              key={`${sortBy}-${sortOrder}-${page}-${tagName}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >

              {isLoading
                ? Array.from({ length: limit }).map((_, i) => <ProductSkeleton key={i} />)
                : products.length > 0 
                  ? products.map((product: IProduct, index: number) => (
                      <ProductCard key={product.id} product={product} />
                    ))
                  : (
                    <div className="col-span-full py-32 text-center border-2 border-dashed border-border/50 rounded-[3rem] bg-muted/5">
                      <p className="text-muted-foreground font-bold italic opacity-50">
                        No innovations matched your current search parameters.
                      </p>
                    </div>
                  )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {meta && meta.total_page > 1 && (
          <div className="flex items-center justify-center gap-3 pt-8">
            <Button
              variant="outline"
              size="icon"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              className="w-12 h-12 rounded-xl border-border/50 hover:bg-primary hover:text-white hover:border-primary disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: meta.total_page }).map((_, i) => {
                const pageNum = i + 1
                // Simple pagination logic: show current, first, last, and neighbors
                if (
                  pageNum === 1 || 
                  pageNum === meta.total_page || 
                  (pageNum >= page - 1 && pageNum <= page + 1)
                ) {
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      onClick={() => handlePageChange(pageNum)}
                      className={cn(
                        "w-12 h-12 rounded-xl font-black text-xs transition-all",
                        page === pageNum 
                          ? "bg-primary text-white shadow-lg shadow-primary/20 border-primary" 
                          : "border-border/50 hover:border-primary/50 text-muted-foreground hover:text-primary"
                      )}
                    >
                      {pageNum}
                    </Button>
                  )
                }
                if (pageNum === page - 2 || pageNum === page + 2) {
                  return <span key={pageNum} className="text-muted-foreground">...</span>
                }
                return null
              })}
            </div>

            <Button
              variant="outline"
              size="icon"
              disabled={page === meta.total_page}
              onClick={() => handlePageChange(page + 1)}
              className="w-12 h-12 rounded-xl border-border/50 hover:bg-primary hover:text-white hover:border-primary disabled:opacity-30 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsClient
