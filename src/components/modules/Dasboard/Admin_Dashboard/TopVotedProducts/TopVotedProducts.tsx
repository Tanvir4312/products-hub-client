"use client";

import React, { useState, useEffect } from "react";
import { 
  Trophy, 
  TrendingUp, 
  Eye, 
  ArrowUpCircle, 
  MessageSquare, 
  Star,
  Loader2,
  AlertCircle,
  Hash,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getAllProducts } from "@/services/admin-server-action";
import { IProduct } from "@/types/Dashboard/moderator-dashboard-types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const TopVotedProducts = () => {
  const router = useRouter();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTopProducts = async () => {
    setIsLoading(true);
    try {
      const res = await getAllProducts(1, 6, undefined, undefined, undefined, "votedUsers", "desc");
      if (res.success) {
        setProducts(res.data.data);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Failed to load leaderboard");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopProducts();
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-12 pb-20">
      {/* Premium Header */}
      <div className="relative overflow-hidden bg-white dark:bg-zinc-950 p-10 md:p-16 rounded-[3rem] border border-zinc-200 dark:border-zinc-900 shadow-2xl shadow-indigo-500/5 dark:shadow-none group">
        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-all duration-700 translate-x-1/4 -translate-y-1/4">
          <Trophy className="w-96 h-96 text-indigo-600" />
        </div>
        
        <div className="relative z-10 space-y-6 max-w-2xl">
          <div className="flex items-center gap-3 px-4 py-1.5 bg-indigo-500/10 text-indigo-600 w-fit rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-500/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TrendingUp className="w-3 h-3" />
            Global Innovation Index
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 leading-none">
            Top <span className="text-indigo-600 font-serif italic italic-none">Voted</span> Innovations
          </h1>
          <p className="text-zinc-500 text-lg font-medium leading-relaxed">
            Discover the most impactful contributions as selected by the global community. These top-tier projects represent the pinnacle of current development trends.
          </p>
        </div>
      </div>

      {/* Leaderboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 h-[500px] rounded-[3rem]" />
          ))
        ) : products.length > 0 ? (
          products.map((product, index) => (
            <div
              key={product.id}
              className="group relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 p-8 rounded-[3rem] transition-all duration-700 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col h-full"
            >
              {/* Rank Badge */}
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-black italic text-xl shadow-xl group-hover:scale-110 transition-all duration-500 z-20 border-4 border-white dark:border-zinc-950">
                #{index + 1}
              </div>

              {/* Product Visual */}
              <div className="relative h-56 w-full rounded-[2rem] overflow-hidden mb-8 border border-zinc-100 dark:border-zinc-800">
                <Image
                  src={product.photo || "/placeholder-product.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="absolute bottom-6 left-6 flex gap-2">
                  <Badge className="bg-white/20 backdrop-blur-xl text-white border-white/30 rounded-lg font-black uppercase text-[10px] tracking-widest px-3">
                    {product.status}
                  </Badge>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-4 flex-grow">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 uppercase group-hover:text-indigo-600 transition-all">
                    {product.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags?.slice(0, 3).map((t: any) => (
                      <span key={t.tag.id} className="text-[10px] font-black uppercase text-indigo-500/60 tracking-widest">
                        #{t.tag.name}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-zinc-500 text-sm font-medium line-clamp-3 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Stats & Actions */}
              <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-indigo-600">
                      <ArrowUpCircle className="w-5 h-5 fill-indigo-600/10" />
                      <span className="font-black text-xl tracking-tighter">{product._count?.votedUsers || 0}</span>
                    </div>
                    <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Support</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                      <MessageSquare className="w-5 h-5" />
                      <span className="font-black text-xl tracking-tighter">{product._count?.reviews || 0}</span>
                    </div>
                    <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Reviews</span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push(`/products/${product.id}`)}
                  className="h-12 w-12 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-indigo-600 hover:text-white transition-all duration-500 shadow-xl group-hover:shadow-indigo-600/20"
                >
                  <ExternalLink className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full h-96 flex flex-col items-center justify-center space-y-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-[3rem] opacity-50">
            <AlertCircle className="w-16 h-16 text-zinc-400" />
            <div className="text-center">
              <p className="font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest text-sm italic">Leaderboard Vacant</p>
              <p className="text-zinc-500 text-[10px] font-bold uppercase mt-1 tracking-tighter">No voted innovations found in the global index.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopVotedProducts;
