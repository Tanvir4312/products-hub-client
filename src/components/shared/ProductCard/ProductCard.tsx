"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Heart, MessageSquare, Star, AlertTriangle, ShieldAlert, X, Send, Eye } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { IProduct } from '@/types/product.types'
import { cn } from '@/lib/utils'
import { useUser } from '@/hooks/useUser'
import { useProductVote } from '@/hooks/useVote'
import { useProductReport } from '@/hooks/useReport'
import { toast } from 'sonner'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export const ProductCard = ({ product }: { product: IProduct }) => {
  const router = useRouter()
  const { data: user } = useUser()
  const [showReportInput, setShowReportInput] = useState(false)
  const [reportReason, setReportReason] = useState("")

  const isOwner = user?.id === product.ownerId
  const isLoggedIn = !!user

  // Mutation hooks
  const { mutate: toggleVote, isPending: isVoting } = useProductVote(product.id)
  const { mutate: submitReport, isPending: isReporting } = useProductReport(product.id)

  const isVoted = product.votedUsers?.some((v) => v.userId === user?.id)

  const handleVote = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isLoggedIn) return toast.error("Please login to participate")
    if (isOwner) return toast.error("Founders cannot upvote their own innovations")

    toggleVote({ hasVoted: !!isVoted })
  }

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!reportReason.trim()) return toast.error("Please provide a reason")

    submitReport(reportReason, {
      onSuccess: () => {
        setShowReportInput(false)
        setReportReason("")
      }
    })
  }

  const badgeText = product.status === 'APPROVED' ? (product.isFeatured ? 'Featured' : null) : product.status;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative bg-background rounded-[2.5rem] border border-border overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10"
    >
      {/* Featured Badge */}
      {badgeText && (
        <div className="absolute top-6 left-6 z-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg flex items-center gap-1.5 backdrop-blur-md",
              product.status === 'PENDING' ? "bg-amber-500/90 text-white" :
              product.status === 'REJECTED' ? "bg-destructive/90 text-white" :
              "bg-primary/90 text-white"
            )}
          >
            <Star className="w-3 h-3 fill-white" />
            {badgeText}
          </motion.div>
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent z-10" />
        <Image
          src={product.photo || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Interaction Overlay */}
        <div className={cn(
          "absolute inset-0 z-20 bg-background/40 backdrop-blur-sm transition-opacity duration-300 flex flex-col items-center justify-center p-6",
          showReportInput ? "opacity-100" : "opacity-0 lg:group-hover:opacity-100"
        )}>
          {showReportInput ? (
            <motion.form 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onSubmit={handleReportSubmit}
              className="w-full max-w-sm bg-background p-4 rounded-3xl shadow-2xl space-y-3"
            >
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-black uppercase tracking-widest text-destructive flex items-center gap-2">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Report
                </span>
                <button type="button" onClick={() => setShowReportInput(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Why are you reporting this?"
                className="w-full p-3 bg-muted/50 rounded-xl text-sm border-none focus:ring-1 focus:ring-destructive resize-none"
                rows={2}
                autoFocus
              />
              <Button disabled={isReporting} type="submit" size="sm" className="w-full bg-destructive hover:bg-destructive/90 text-white rounded-xl h-10">
                {isReporting ? "Submitting..." : "Submit Report"}
                <Send className="w-3.5 h-3.5 ml-2" />
              </Button>
            </motion.form>
          ) : (
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleVote}
                disabled={isVoting || isOwner}
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xl",
                  isOwner ? "bg-muted text-muted-foreground cursor-not-allowed" :
                  isVoted ? "bg-primary text-white" : "bg-white text-primary hover:bg-primary hover:text-white"
                )}
                title={isOwner ? "Owner cannot vote" : isVoted ? "Remove vote" : "Upvote"}
              >
                <Heart className={cn("w-6 h-6", isVoted && "fill-current")} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation()
                  const hasReported = product.reportedUsers?.some((v) => v.userId === user?.id)
                  if (hasReported) return toast.error("You already reported this innovation")
                  setShowReportInput(true)
                }}
                disabled={isOwner}
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xl",
                  isOwner ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-white text-destructive hover:bg-destructive hover:text-white"
                )}
                title={isOwner ? "Owner cannot report" : "Report"}
              >
                <ShieldAlert className="w-6 h-6" />
              </motion.button>

              <div onClick={(e) => { e.stopPropagation(); router.push(`/products/${product.id}`) }} className="cursor-pointer">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-2xl bg-white text-indigo-600 flex items-center justify-center transition-all shadow-xl hover:bg-indigo-600 hover:text-white"
                  title="View Details"
                >
                  <Eye className="w-6 h-6" />
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div onClick={() => router.push(`/products/${product.id}`)} className="block cursor-pointer">
          <div className="flex flex-col gap-2">
            {/* Desktop Tags and Counts (Hidden on Mobile) */}
            <div className="hidden lg:flex items-center justify-between gap-2">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                {product.tags?.[0]?.tag?.name || "Product"}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleVote}
                  disabled={isVoting || isOwner}
                  className={cn(
                    "flex items-center gap-1 transition-all active:scale-95 lg:pointer-events-none",
                    isVoted ? "text-primary" : "text-muted-foreground/60 hover:text-primary"
                  )}
                  title={isOwner ? "Owner cannot vote" : isVoted ? "Remove vote" : "Upvote"}
                >
                  <Heart className={cn("w-3.5 h-3.5", isVoted && "fill-current")} />
                  <span className="text-xs font-black">{product._count?.votedUsers || 0}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    const hasReported = product.reportedUsers?.some((v) => v.userId === user?.id)
                    if (hasReported) return toast.error("You already reported this innovation")
                    setShowReportInput(true)
                  }}
                  disabled={isOwner}
                  className="flex items-center gap-1 text-destructive/60 hover:text-destructive transition-all active:scale-95 lg:pointer-events-none"
                  title={isOwner ? "Owner cannot report" : "Report"}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span className="text-xs font-black">{product._count?.reportedUsers || 0}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-black text-foreground tracking-tight group-hover:text-primary transition-colors truncate">
                {product.name}
              </h3>
              {product.links && (
                <a 
                  href={product.links.startsWith('http') ? product.links : `https://${product.links}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="shrink-0 p-2 -mr-2 text-muted-foreground hover:text-primary transition-colors"
                  title="Visit Website"
                >
                  <ArrowRight className="w-4 h-4 -rotate-45" />
                </a>
              )}
            </div>
            
            <p className="text-xs text-muted-foreground/80 line-clamp-2 min-h-[32px] leading-relaxed">
              {product.description}
            </p>

            {/* Mobile Tags and Compact Buttons (Hidden on Desktop) */}
            <div className="lg:hidden flex flex-col gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-lg bg-primary/5 text-[8px] font-black uppercase tracking-wider text-primary/70 border border-primary/10">
                  {product.tags?.[0]?.tag?.name || "Product"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleVote}
                  disabled={isVoting || isOwner}
                  className={cn(
                    "flex-1 h-9 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 text-[10px] font-black uppercase tracking-wider shadow-sm border",
                    isVoted 
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                      : "bg-background border-border text-foreground hover:bg-muted"
                  )}
                >
                  <Heart className={cn("w-3 h-3", isVoted && "fill-current")} />
                  {isVoted ? "Upvoted" : "Upvote"} • {product._count?.votedUsers || 0}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    const hasReported = product.reportedUsers?.some((v) => v.userId === user?.id)
                    if (hasReported) return toast.error("You already reported this innovation")
                    setShowReportInput(true)
                  }}
                  disabled={isOwner}
                  className="h-9 px-3 rounded-xl flex items-center justify-center bg-white border border-border text-destructive/80 hover:bg-destructive/5 hover:border-destructive/20 transition-all active:scale-95 text-[10px] font-black uppercase tracking-wider shadow-sm"
                >
                  <ShieldAlert className="w-3.5 h-3.5 mr-1.5" />
                  Report
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-4">
            <div className="flex items-center gap-2">
              <div className="relative w-7 h-7 rounded-full overflow-hidden bg-muted">
                {product.owner?.profilePhoto ? (
                  <Image src={product.owner.profilePhoto} alt={product.owner.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-[10px] font-bold">
                    {product.owner?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <span className="text-[10px] font-bold text-muted-foreground truncate max-w-[80px]">
                {product.owner?.name || "Founder"}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground/60">
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold">Details</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
