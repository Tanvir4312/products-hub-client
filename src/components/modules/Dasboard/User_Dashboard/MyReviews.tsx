"use client"

import React from 'react'
import { 
  MessageSquare, 
  Star, 
  ExternalLink,
  Package,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'

import { useMyReviews } from '@/hooks/useReviews'
import { IReview } from '@/types/product.types'

const MyReviews = () => {
  const { data: reviews, isLoading } = useMyReviews()
  
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`w-3.5 h-3.5 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`} 
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card border border-border p-8 rounded-[2.5rem] shadow-xl shadow-primary/5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-500 w-fit rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
            <MessageSquare className="w-3 h-3" />
            Feedback History
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tighter">My <span className="text-indigo-500 italic font-serif">Contributions</span></h2>
          <p className="text-muted-foreground text-sm font-medium">A historical log of your technological assessments and quality contributions.</p>
        </div>
        <div className="hidden lg:flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          {(reviews as IReview[])?.length || 0} Total Critiques
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border hover:bg-transparent h-16">
              <TableHead className="w-[350px] text-[10px] font-black uppercase tracking-[0.2em] px-8">Innovation Target</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em]">Rating</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] max-w-[500px]">The Critique</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-right px-8">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i} className="border-border animate-pulse">
                  <TableCell className="px-8"><div className="h-12 bg-muted rounded-xl w-full" /></TableCell>
                  <TableCell><div className="h-6 bg-muted rounded-lg w-20" /></TableCell>
                  <TableCell><div className="h-12 bg-muted rounded-xl w-full" /></TableCell>
                  <TableCell className="px-8"><div className="h-10 bg-muted rounded-xl w-10 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : (reviews as IReview[])?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-80 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4 opacity-50">
                    <MessageSquare className="w-12 h-12 text-muted-foreground" />
                    <p className="font-bold italic text-muted-foreground uppercase tracking-widest text-[10px]">No historical critiques found.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (reviews as IReview[])?.map((review: IReview) => (
              <TableRow key={review.id} className="border-border hover:bg-muted/30 group transition-all duration-300">
                <TableCell className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-border group-hover:scale-105 transition-transform shrink-0">
                      <img src={review.product?.photo} alt={review.product?.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-black text-foreground truncate group-hover:text-indigo-500 transition-colors uppercase tracking-tight">{review.product?.name}</h4>
                      <div className="flex items-center gap-2 text-[9px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
                        <Calendar className="w-2.5 h-2.5" /> {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {renderStars(review.rating)}
                    <span className="text-[10px] font-black text-amber-500/80 uppercase">{review.rating}.0 Magnitude</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[500px]">
                  <p className="text-sm text-muted-foreground font-medium line-clamp-2 italic leading-relaxed">
                    "{review.comment}"
                  </p>
                </TableCell>
                <TableCell className="px-8 text-right">
                   <Link href={`/products/${review.product?.id}`}>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 rounded-xl hover:bg-indigo-500/10 hover:text-indigo-500 transition-all group/btn"
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
    </div>
  )
}

export default MyReviews
