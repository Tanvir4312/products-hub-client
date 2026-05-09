"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Ticket, Sparkles, Clock, Copy, CheckCircle2, AlertCircle } from 'lucide-react'
import { useActiveCoupons } from '@/hooks/useCoupons'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// --- Countdown Timer Component ---
const CountdownTimer = ({ expiryDate }: { expiryDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(expiryDate) - +new Date()
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        }
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [expiryDate])

  const TimeBlock = ({ label, value }: { label: string; value: number }) => (
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FF4D00] rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg shadow-[#FF4D00]/20">
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-[10px] font-bold text-muted-foreground uppercase mt-1 tracking-tighter">{label}</span>
    </div>
  )

  return (
    <div className="flex justify-between items-center px-2">
      <TimeBlock label="days" value={timeLeft.days} />
      <TimeBlock label="hrs" value={timeLeft.hours} />
      <TimeBlock label="min" value={timeLeft.minutes} />
      <TimeBlock label="sec" value={timeLeft.seconds} />
    </div>
  )
}

// --- Skeleton Loader ---
const OfferSkeleton = () => (
  <div className="bg-background border border-border rounded-[2.5rem] p-8 space-y-6">
    <Skeleton className="h-6 w-20 rounded-full" />
    <Skeleton className="h-12 w-3/4" />
    <Skeleton className="h-8 w-1/2" />
    <Skeleton className="h-4 w-full" />
    <div className="space-y-2">
      <Skeleton className="h-2 w-full rounded-full" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
    <Skeleton className="h-24 w-full rounded-2xl" />
    <Skeleton className="h-12 w-full rounded-xl" />
  </div>
)

const SpecialOffers = () => {
  const { data: offers, isLoading, isError } = useActiveCoupons(4)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleClaimOffer = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success(`Coupon ${code} copied to clipboard!`, {
      description: "Apply this code at checkout to claim your discount.",
      icon: <CheckCircle2 className="w-4 h-4 text-green-500" />
    })
    setTimeout(() => setCopiedCode(null), 2000)
  }

  if (!isLoading && (!offers || offers.length === 0)) return null

  return (
    <section className="w-full bg-muted/5 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF4D00]/5 blur-[120px] rounded-full -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -ml-48 -mb-48" />

      <div className="px-3 lg:px-0 space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF4D00]"
          >
            Limited Time
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-7xl font-black text-foreground tracking-tighter"
          >
            Special <span className="italic font-serif">Offers</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground font-medium text-lg max-w-lg mx-auto"
          >
            Unlock premium innovations with exclusive community deals. Grab these offers before they're gone.
          </motion.p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <OfferSkeleton key={i} />)
            : offers?.map((offer, index) => {
              const usagePercent = (offer.usedCount / offer.usageLimit) * 100
              const isExpiringSoon = +new Date(offer.expiryDate) - +new Date() < 1000 * 60 * 60 * 24 * 3

              return (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "group relative bg-background border rounded-[2.5rem] p-8 flex flex-col space-y-6 transition-all hover:shadow-2xl hover:-translate-y-2",
                    index === 0 && "border-[#FF4D00]/30 shadow-xl shadow-[#FF4D00]/5 bg-orange-50/10 dark:bg-[#FF4D00]/5"
                  )}
                >
                  {/* Badge */}
                  <div className="flex justify-between items-start">
                    <div className={cn(
                      "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                      index === 0 ? "bg-[#FF4D00] text-white border-transparent" : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    )}>
                      {index === 0 ? "Hot Deal" : "Active"}
                    </div>
                    {isExpiringSoon && (
                      <div className="flex items-center gap-1 text-rose-500 animate-pulse">
                        <Clock className="w-3 h-3" />
                        <span className="text-[8px] font-black uppercase">Ending Soon</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-4xl font-black text-foreground tracking-tighter">
                      {offer.discount}% <span className="text-2xl font-serif italic text-[#FF4D00]">OFF</span>
                    </h3>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted rounded-lg border border-border">
                      <Ticket className="w-3.5 h-3.5 text-[#FF4D00]" />
                      <span className="text-xs font-black uppercase tracking-widest">{offer.couponCode}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Valid until {new Date(offer.expiryDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${usagePercent}%` }}
                        viewport={{ once: true }}
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          usagePercent > 80 ? "bg-rose-500" : "bg-[#FF4D00]"
                        )}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
                      <span>{offer.usedCount} used</span>
                      <span>{offer.usageLimit} max</span>
                    </div>
                  </div>

                  {/* Timer */}
                  <div className="py-6 border-y border-border/50">
                    <CountdownTimer expiryDate={offer.expiryDate} />
                  </div>

                  {/* Claim Button */}
                  <Button
                    onClick={() => handleClaimOffer(offer.couponCode)}
                    className={cn(
                      "w-full h-12 rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 transition-all active:scale-95",
                      copiedCode === offer.couponCode
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
                        : "bg-[#FF4D00] hover:bg-[#E64500] text-white shadow-[#FF4D00]/20"
                    )}
                  >
                    {copiedCode === offer.couponCode ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Code Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Claim Offer
                      </>
                    )}
                  </Button>
                </motion.div>
              )
            })}
        </div>
      </div>
    </section>
  )
}

export default SpecialOffers
