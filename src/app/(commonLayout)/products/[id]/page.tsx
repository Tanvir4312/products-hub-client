"use client"

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Heart,
  MessageSquare,
  Share2,
  ExternalLink,
  ShieldCheck,
  Calendar,
  User,
  Tag as TagIcon,
  Sparkles,
  AlertCircle,
  Star,
  AlertTriangle,
  Trash2,
  Edit3,
  X,
  Send,
  ArrowRight
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSingleProduct } from '@/hooks/useSingleProduct'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useUser } from '@/hooks/useUser'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useProductVote } from '@/hooks/useVote'
import { useProductReport } from '@/hooks/useReport'
import { useProductReview } from '@/hooks/useReview'

/**
 * Product Details Page Component
 * Implements a premium, responsive layout for individual product viewing.
 */
const ProductDetailsPage = () => {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const { data: user } = useUser()
  const queryClient = useQueryClient()

  const { data: product, isLoading, isError, error } = useSingleProduct(id)

  const isOwner = user?.id === product?.ownerId
  const isLoggedIn = !!user

  // Mutation hooks
  const { mutate: toggleVote, isPending: isVoting } = useProductVote(id)
  const { mutate: submitReport, isPending: isReporting } = useProductReport(id)
  const { createReview, updateReview, deleteReview } = useProductReview(id)

  const isVoted = product?.votedUsers?.some((v) => v.userId === user?.id)
  const hasReviewed = product?.reviews?.some((r: any) => r.userId === user?.id)

  const handleVote = () => {
    if (!isLoggedIn) return toast.error("Please login to participate")
    if (isOwner) return toast.error("Founders cannot upvote their own innovations")
    toggleVote({ hasVoted: !!isVoted })
  }

  const handleReport = () => {
    if (!isLoggedIn) return toast.error("Please login to report")
    if (isOwner) return toast.error("Founders cannot report their own innovations")

    const hasReported = product?.reportedUsers?.some((v: any) => v.userId === user?.id)
    if (hasReported) return toast.error("You already reported this innovation")

    const reason = window.prompt("Why are you reporting this innovation?")
    if (!reason) return
    submitReport(reason)
  }

  const [reviewRating, setReviewRating] = React.useState(5)
  const [reviewComment, setReviewComment] = React.useState("")
  const [editingReviewId, setEditingReviewId] = React.useState<string | null>(null)

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoggedIn) return toast.error("Please login to participate")
    if (isOwner) return toast.error("Founders cannot review their own innovations")
    if (!reviewComment.trim()) return toast.error("Please provide a comment")

    if (editingReviewId) {
      updateReview.mutate({ id: editingReviewId, rating: reviewRating, comment: reviewComment }, {
        onSuccess: () => {
          setEditingReviewId(null)
          setReviewComment("")
          setReviewRating(5)
        }
      })
    } else {
      createReview.mutate({ rating: reviewRating, comment: reviewComment }, {
        onSuccess: () => {
          setReviewComment("")
          setReviewRating(5)
        }
      })
    }
  }

  const startEditing = (review: any) => {
    setEditingReviewId(review.id)
    setReviewRating(review.rating)
    setReviewComment(review.comment)
    window.scrollTo({ top: 400, behavior: 'smooth' })
  }

  const cancelEditing = () => {
    setEditingReviewId(null)
    setReviewComment("")
    setReviewRating(5)
  }

  if (isLoading) {
    return <ProductDetailsSkeleton />
  }

  if (isError || !product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="h-20 w-20 bg-destructive/10 rounded-3xl flex items-center justify-center mb-6">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="text-3xl font-black text-foreground tracking-tighter mb-2">Sync Interrupted</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          {error?.message || "We couldn't retrieve the details for this innovation. It might have been removed or moved."}
        </p>
        <Button onClick={() => router.back()} variant="outline" className="rounded-xl px-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Top Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="group hover:bg-transparent p-0 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
          <span className="font-bold uppercase tracking-widest text-xs">Back to Discover</span>
        </Button>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column: Visuals & Core Info */}
        <div className="lg:col-span-8 space-y-12">
          {/* Main Hero Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-muted/10 border border-border rounded-[2.5rem] overflow-hidden"
          >
            <div className="relative aspect-video sm:aspect-[21/9] w-full">
              <Image
                src={product.photo || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>

            <div className="absolute bottom-8 left-8 right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {product.tags?.map((pt) => (
                    <span key={pt.tag.id} className="px-3 py-1 rounded-lg bg-primary/90 text-white text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                      {pt.tag.name}
                    </span>
                  ))}
                  {product.isFeatured && (
                    <span className="px-3 py-1 rounded-lg bg-indigo-600/90 text-white text-[10px] font-black uppercase tracking-widest backdrop-blur-md flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 fill-current" />
                      Featured
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-none">
                    {product.name}
                  </h1>
                  {product.links && (
                    <a
                      href={product.links.startsWith('http') ? product.links : `https://${product.links}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-2xl bg-white/10 hover:bg-white text-white hover:text-foreground backdrop-blur-md transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                      title="Visit Website"
                    >
                      <ArrowRight className="w-6 h-6 -rotate-45" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Description & Details */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-primary" />
                Product Overview
              </h2>
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Tags Cloud */}
            <div className="flex flex-wrap gap-3 py-6 border-y border-border">
              {product.tags?.map((pt) => (
                <Link
                  key={pt.tag.id}
                  href={`/products?tagName=${pt.tag.name}`}
                  className="px-4 py-2 rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-bold transition-all border border-transparent hover:border-border flex items-center gap-2"
                >
                  <TagIcon className="w-3.5 h-3.5" />
                  {pt.tag.name}
                </Link>
              ))}
            </div>

            {/* Mobile Action Section (Visible only on medium and small devices) */}
            <div className="lg:hidden space-y-8 py-8 border-b border-border">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex flex-col items-center text-center">
                  <Heart className="w-5 h-5 text-primary mb-2 fill-primary/20" />
                  <span className="text-xl font-black text-primary tracking-tighter">{product._count?.votedUsers || 0}</span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Votes</span>
                </div>
                <div className="p-4 bg-indigo-600/5 rounded-2xl border border-indigo-600/10 flex flex-col items-center text-center">
                  <MessageSquare className="w-5 h-5 text-indigo-600 mb-2 fill-indigo-600/20" />
                  <span className="text-xl font-black text-indigo-600 tracking-tighter">{product._count?.reviews || 0}</span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Reviews</span>
                </div>
                <div className="p-4 bg-destructive/5 rounded-2xl border border-destructive/10 flex flex-col items-center text-center">
                  <AlertTriangle className="w-5 h-5 text-destructive mb-2" />
                  <span className="text-xl font-black text-destructive tracking-tighter">{product._count?.reportedUsers || 0}</span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Reports</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleVote}
                  disabled={isOwner || isVoting}
                  variant={isVoted ? "default" : "outline"}
                  className={cn(
                    "w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl transition-all",
                    isOwner ? "bg-muted text-muted-foreground cursor-not-allowed" :
                      isVoted ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "border-primary text-primary hover:bg-primary hover:text-white"
                  )}
                >
                  {isOwner ? "Owner (No Vote)" : isVoted ? "Upvoted" : "Support Product"}
                  <Heart className={cn("w-3.5 h-3.5 ml-2", isVoted && "fill-current")} />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReport}
                  disabled={isOwner}
                  className={cn(
                    "w-full h-14 rounded-2xl border-border font-black uppercase tracking-[0.2em] text-[10px] gap-2",
                    isOwner ? "opacity-50 cursor-not-allowed" : "hover:bg-destructive hover:text-white hover:border-destructive transition-colors text-destructive/80"
                  )}
                >
                  {isOwner ? "Owner (No Report)" : "Report Inaccurate"}
                  <AlertTriangle className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Submit Review Form */}
            {isLoggedIn && !isOwner && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-[2.5rem] bg-indigo-600/5 border border-indigo-600/10 space-y-6"
              >
                {hasReviewed && !editingReviewId ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                    <div className="h-14 w-14 bg-indigo-600/10 rounded-2xl flex items-center justify-center">
                      <MessageSquare className="w-7 h-7 text-indigo-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-black text-foreground tracking-tight">Thanks for your feedback!</p>
                      <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">you onle once time review in this product</p>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-xs">You can still edit or delete your existing review in the community feed below.</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-foreground tracking-tight">
                        {editingReviewId ? "Update your experience" : "Share your experience"}
                      </h3>
                      <p className="text-xs text-muted-foreground font-medium">Your feedback helps the community discover the best innovations.</p>
                    </div>

                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Rating:</span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewRating(star)}
                                className={cn("transition-transform hover:scale-125", star <= reviewRating ? "text-amber-500" : "text-muted-foreground/30")}
                              >
                                <Star className={cn("w-6 h-6", star <= reviewRating && "fill-current")} />
                              </button>
                            ))}
                          </div>
                        </div>
                        {editingReviewId && (
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={cancelEditing}
                            className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground h-8 px-3"
                          >
                            Cancel Edit
                          </Button>
                        )}
                      </div>

                      <div className="relative">
                        <textarea
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="What do you think about this innovation?"
                          className="w-full min-h-[120px] p-6 rounded-3xl bg-background border border-border focus:border-indigo-600/50 outline-none transition-all text-sm font-medium resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={createReview.isPending || updateReview.isPending}
                        className="h-12 px-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] gap-2"
                      >
                        {createReview.isPending || updateReview.isPending ? "Syncing..." : (editingReviewId ? "Update Review" : "Post Review")}
                        <Send className="w-3.5 h-3.5" />
                      </Button>
                    </form>
                  </>
                )}
              </motion.div>
            )}

            {/* Reports Section */}
            {(product.reportedUsers?.length || 0) > 0 && (
              <div className="space-y-6 pt-4">
                <h2 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                  Community Reports
                </h2>
                <div className="grid gap-4">
                  {product.reportedUsers?.map((report) => (
                    <div key={report.id} className="p-6 rounded-3xl bg-destructive/5 border border-destructive/10 flex gap-4">
                      <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                        <AlertCircle className="w-5 h-5 text-destructive" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-foreground">{report.user.name}</span>
                          <span className="text-[10px] text-muted-foreground font-medium">• {new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-destructive/80 font-medium">{report.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="space-y-8 pt-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-indigo-600" />
                  User Reviews
                </h2>
                <span className="px-3 py-1 rounded-lg bg-indigo-600/10 text-indigo-600 text-xs font-black uppercase tracking-widest">
                  {product.reviews?.length || 0} Reviews
                </span>
              </div>

              <div className="grid gap-6">
                {(product.reviews?.length || 0) > 0 ? (
                  product.reviews?.map((review) => {
                    const isMyReview = user?.id === review.userId;

                    return (
                      <motion.div
                        layout
                        key={review.id}
                        className="group p-8 bg-muted/20 border border-border rounded-[2.5rem] hover:bg-muted/30 transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                          <div className="flex items-center gap-4">
                            <div className="relative h-12 w-12 rounded-2xl overflow-hidden bg-primary/10">
                              {review.user.profilePhoto ? (
                                <Image src={review.user.profilePhoto} alt={review.user.name} fill className="object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center font-black text-primary">
                                  {review.user.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-black text-foreground">{review.user.name}</p>
                              <div className="flex items-center gap-1 mt-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn("w-3 h-3", i < review.rating ? "text-amber-500 fill-amber-500" : "text-muted-foreground/30")}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          {isMyReview && (
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEditing(review)}
                                className="h-9 w-9 p-0 rounded-xl hover:bg-primary/10 hover:text-primary"
                              >
                                <Edit3 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteReview.mutate(review.id)}
                                disabled={deleteReview.isPending}
                                className="h-9 w-9 p-0 rounded-xl hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className={cn("w-4 h-4", deleteReview.isPending && "animate-spin")} />
                              </Button>
                            </div>
                          )}
                        </div>
                        <p className="mt-6 text-muted-foreground leading-relaxed text-sm font-medium">
                          {review.comment}
                        </p>
                      </motion.div>
                    )
                  })
                ) : (
                  <div className="py-20 text-center space-y-4 bg-muted/10 rounded-[2.5rem] border border-dashed border-border">
                    <div className="h-16 w-16 bg-muted/50 rounded-3xl flex items-center justify-center mx-auto">
                      <MessageSquare className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                    <div>
                      <p className="text-lg font-black text-foreground tracking-tight">No voices yet</p>
                      <p className="text-sm text-muted-foreground">Be the first to share your thoughts on this innovation.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Actions & Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          {/* Action Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-8 bg-background border border-border rounded-[2.5rem] shadow-xl shadow-primary/5 space-y-8 sticky top-24"
          >
            {/* Stats Highlight (Hidden on Mobile) */}
            <div className="hidden lg:grid grid-cols-3 gap-3">
              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex flex-col items-center text-center">
                <Heart className="w-5 h-5 text-primary mb-2 fill-primary/20" />
                <span className="text-xl font-black text-primary tracking-tighter">{product._count?.votedUsers || 0}</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Votes</span>
              </div>
              <div className="p-4 bg-indigo-600/5 rounded-2xl border border-indigo-600/10 flex flex-col items-center text-center">
                <MessageSquare className="w-5 h-5 text-indigo-600 mb-2 fill-indigo-600/20" />
                <span className="text-xl font-black text-indigo-600 tracking-tighter">{product._count?.reviews || 0}</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Reviews</span>
              </div>
              <div className="p-4 bg-destructive/5 rounded-2xl border border-destructive/10 flex flex-col items-center text-center">
                <AlertTriangle className="w-5 h-5 text-destructive mb-2" />
                <span className="text-xl font-black text-destructive tracking-tighter">{product._count?.reportedUsers || 0}</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Reports</span>
              </div>
            </div>

            {/* Primary Actions (Hidden on Mobile) */}
            <div className="hidden lg:flex flex-col gap-4">
              <Button
                onClick={handleVote}
                disabled={isOwner || isVoting}
                className={cn(
                  "w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl transition-all group",
                  isOwner ? "bg-muted text-muted-foreground cursor-not-allowed" :
                    isVoted ? "bg-primary text-white shadow-primary/30" : "bg-background border border-primary text-primary hover:bg-primary hover:text-white"
                )}
              >
                {isOwner ? "Owner (No Vote)" : isVoted ? "Upvoted" : "Support this Product"}
                <Heart className={cn("w-4 h-4 ml-2 transition-all", isVoted && "fill-current scale-125", !isOwner && "group-hover:scale-110")} />
              </Button>
              <Button
                variant="outline"
                onClick={handleReport}
                disabled={isOwner}
                className={cn(
                  "w-full h-16 rounded-2xl border-border font-black uppercase tracking-[0.2em] text-xs gap-3",
                  isOwner ? "opacity-50 cursor-not-allowed" : "hover:bg-destructive hover:text-white hover:border-destructive transition-colors"
                )}
              >
                {isOwner ? "Owner (No Report)" : "Report Inaccurate"}
                <AlertTriangle className="w-4 h-4" />
              </Button>
            </div>

            {/* Metadata Sidebar */}
            <div className="space-y-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
                    {product.owner?.profilePhoto ? (
                      <Image src={product.owner.profilePhoto} alt={product.owner.name} width={40} height={40} className="object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Developed by</span>
                    <span className="text-sm font-bold text-foreground">{product.owner?.name || "Independent Creator"}</span>
                  </div>
                </div>
                <Button size="icon" variant="ghost" className="rounded-xl">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-bold">Launched on {new Date(product.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

const ProductDetailsSkeleton = () => (
  <div className="max-w-7xl mx-auto px-6 space-y-12 pb-24">
    <div className="py-8">
      <Skeleton className="h-6 w-32 rounded-lg" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
      <div className="lg:col-span-8 space-y-12">
        <Skeleton className="aspect-video sm:aspect-[21/9] w-full rounded-[2.5rem]" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
      <div className="lg:col-span-4">
        <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
      </div>
    </div>
  </div>
)

export default ProductDetailsPage
