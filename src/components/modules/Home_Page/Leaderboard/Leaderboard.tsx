"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Medal, Trophy, Star, Crown, AlertCircle, User as UserIcon } from 'lucide-react'
import Image from 'next/image'
import { useUserLeaderboard } from '@/hooks/useStats'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const UserSkeleton = () => (
  <div className="bg-background border border-border rounded-3xl p-6 flex items-center gap-4">
    <Skeleton className="h-16 w-16 rounded-2xl flex-shrink-0" />
    <div className="space-y-2 flex-1">
      <Skeleton className="h-5 w-1/2" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  </div>
)

const Leaderboard = () => {
  const { data: users, isLoading, isError, error } = useUserLeaderboard()

  const getRankStyles = (index: number) => {
    switch (index) {
      case 0: return {
        bg: "bg-yellow-500/10 border-yellow-500/20",
        text: "text-yellow-600",
        icon: <Crown className="w-5 h-5 text-yellow-500" />,
        shadow: "shadow-yellow-500/5"
      }
      case 1: return {
        bg: "bg-slate-300/10 border-slate-300/20",
        text: "text-slate-500",
        icon: <Medal className="w-5 h-5 text-slate-400" />,
        shadow: "shadow-slate-400/5"
      }
      case 2: return {
        bg: "bg-orange-400/10 border-orange-400/20",
        text: "text-orange-600",
        icon: <Medal className="w-5 h-5 text-orange-500" />,
        shadow: "shadow-orange-500/5"
      }
      default: return {
        bg: "bg-primary/5 border-primary/10",
        text: "text-primary",
        icon: null,
        shadow: "shadow-primary/5"
      }
    }
  }

  return (
    <section className="pb-10 w-full bg-background">
      <div className="px-3 lg:px-0 space-y-12">
        {/* Section Header */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/10"
          >
            <Trophy className="w-3.5 h-3.5" />
            Top Contributors
          </motion.div>
          <div className="space-y-2">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl font-black text-foreground tracking-tighter"
            >
              The <span className="text-primary italic font-serif">Leaderboard</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground max-w-xl font-medium"
            >
              Celebrating our most active innovators who consistently contribute high-quality products to the ecosystem.
            </motion.p>
          </div>
        </div>

        {/* Leaderboard Grid */}
        {isError ? (
          <div className="bg-destructive/5 border border-destructive/10 rounded-[2.5rem] p-12 text-center">
            <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
            <h3 className="text-xl font-black text-destructive mb-2 uppercase tracking-tight">Sync Error</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              {error?.message || "Failed to load the innovator leaderboard."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <UserSkeleton key={i} />)
              : users?.map((user, index) => {
                const styles = getRankStyles(index)
                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "group relative bg-background border rounded-[2rem] p-6 flex items-center gap-6 transition-all hover:shadow-2xl hover:-translate-y-1",
                      styles.bg,
                      styles.shadow
                    )}
                  >
                    {/* Rank Badge */}
                    <div className="absolute -top-3 -left-3 w-10 h-10 rounded-xl bg-background border shadow-lg flex items-center justify-center font-black text-sm z-10 text-foreground">
                      {index + 1}
                    </div>

                    {/* User Avatar */}
                    <div className="relative h-20 w-20 flex-shrink-0">
                      <div className="absolute inset-0 rounded-2xl bg-primary/10 animate-pulse group-hover:scale-105 transition-transform" />
                      {user.profilePhoto || user.image ? (
                        <Image
                          src={user.profilePhoto || user.image || ""}
                          alt={user.name}
                          fill
                          unoptimized
                          className="object-cover rounded-2xl z-10"
                        />
                      ) : (
                        <div className="absolute inset-0 rounded-2xl bg-muted flex items-center justify-center z-10">
                          <UserIcon className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      {styles.icon && (
                        <div className="absolute -bottom-2 -right-2 bg-background border rounded-full p-1.5 shadow-md z-20">
                          {styles.icon}
                        </div>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="text-lg font-black text-foreground truncate group-hover:text-primary transition-colors">
                        {user.name}
                      </h4>
                      <p className="text-xs text-muted-foreground/80 font-medium truncate mb-2">
                        {user.email}
                      </p>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/30 border border-border shadow-sm">
                        <Star className="w-3 h-3 text-primary fill-primary" />
                        <span className="text-[10px] font-black uppercase tracking-tight text-foreground/90">
                          {user._count.products} Innovations
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && users?.length === 0 && (
          <div className="py-24 text-center border-2 border-dashed border-border/50 rounded-[3rem] bg-muted/5">
            <p className="text-muted-foreground font-bold italic tracking-tight opacity-50">
              No contributors found yet. Be the first!
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Leaderboard
