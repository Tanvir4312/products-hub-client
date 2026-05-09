"use client"

import React from 'react'
import { 
  TrendingUp, 
  ArrowRight, 
  ExternalLink,
  Zap,
  Star,
  Package,
  Eye,
  Trophy,
  Flame,
  Crown
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'

import { useMostVotedProducts } from '@/hooks/useProducts'
import { IProduct } from '@/types/product.types'

const UpvotedProducts = () => {
  // Fetch top 6 most voted products globally
  const { data: products, isLoading } = useMostVotedProducts(6)

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="w-5 h-5 text-amber-400" />
      case 1: return <Trophy className="w-4 h-4 text-slate-300" />
      case 2: return <Trophy className="w-4 h-4 text-amber-600" />
      default: return <div className="text-[10px] font-black opacity-40">{index + 1}</div>
    }
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card border border-border p-8 rounded-[2.5rem] shadow-xl shadow-primary/5 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <TrendingUp className="w-40 h-40" />
        </div>
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 w-fit rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
            <Flame className="w-3 h-3" />
            Global Trending Protocol
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tighter">Market <span className="text-amber-500 italic font-serif">Leaderboard</span></h2>
          <p className="text-muted-foreground text-sm font-medium">Monitoring the top 6 highest-velocity technological breakthroughs in the ecosystem.</p>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border hover:bg-transparent h-16">
              <TableHead className="w-[80px] text-[10px] font-black uppercase tracking-[0.2em] text-center">Rank</TableHead>
              <TableHead className="w-[350px] text-[10px] font-black uppercase tracking-[0.2em] px-8">Innovation Entity</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em]">Velocity (Likes)</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em]">Classification</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-right px-8">Analysis</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i} className="border-border animate-pulse">
                  <TableCell><div className="h-8 w-8 bg-muted rounded-full mx-auto" /></TableCell>
                  <TableCell className="px-8"><div className="h-12 bg-muted rounded-xl w-full" /></TableCell>
                  <TableCell><div className="h-6 bg-muted rounded-lg w-20" /></TableCell>
                  <TableCell><div className="h-6 bg-muted rounded-lg w-32" /></TableCell>
                  <TableCell className="px-8"><div className="h-10 bg-muted rounded-xl w-10 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : products?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-80 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4 opacity-50">
                    <Zap className="w-12 h-12 text-muted-foreground" />
                    <p className="font-bold italic text-muted-foreground uppercase tracking-widest text-[10px]">No trending innovations detected.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : products?.map((product, index) => (
              <TableRow key={product.id} className="border-border hover:bg-muted/30 group transition-all duration-300">
                <TableCell className="text-center">
                   <div className="flex items-center justify-center">
                     {getRankIcon(index)}
                   </div>
                </TableCell>
                <TableCell className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-border group-hover:scale-105 transition-transform shrink-0">
                      <img src={product.photo} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-black text-foreground truncate group-hover:text-amber-500 transition-colors uppercase tracking-tight">{product.name}</h4>
                      <p className="text-[10px] text-muted-foreground font-bold truncate opacity-60">Status: {product.status}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                   <div className="flex items-center gap-2">
                      <div className="h-8 px-3 rounded-lg bg-amber-500/10 text-amber-500 flex items-center gap-1.5 font-black text-xs">
                         <Zap className="w-3 h-3 fill-amber-500" />
                         {product.votes}
                      </div>
                   </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1.5">
                    {product.tags?.slice(0, 1).map(pt => (
                      <Badge key={pt.tagId} variant="outline" className="text-[8px] font-black uppercase tracking-widest h-6 border-primary/20 bg-primary/5 text-primary">
                        {pt.tag.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="px-8 text-right">
                   <Link href={`/products/${product.id}`}>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 rounded-xl hover:bg-amber-500/10 hover:text-amber-500 transition-all group/btn"
                      >
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Button>
                    </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pro-Tips Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="p-8 rounded-[2rem] bg-card border border-border space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
               <Trophy className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-black uppercase tracking-tight">Market Dominance</h4>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">These products currently hold the highest engagement magnitude across the entire innovation ecosystem.</p>
         </div>
         <div className="p-8 rounded-[2rem] bg-card border border-border space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
               <Zap className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-black uppercase tracking-tight">Velocity Pulse</h4>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">Engagement is measured by total upvote synchronization from all verified platform participants.</p>
         </div>
         <div className="p-8 rounded-[2rem] bg-card border border-border space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
               <Star className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-black uppercase tracking-tight">Elite Selection</h4>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">Only the top 0.1% of innovations reach this leaderboard, representing the pinnacle of user sentiment.</p>
         </div>
      </div>
    </div>
  )
}

export default UpvotedProducts
