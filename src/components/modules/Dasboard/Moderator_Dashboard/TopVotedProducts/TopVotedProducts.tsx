"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Eye,
  Loader2,
  ThumbsUp,
  Award,
  Crown,
  Trophy,
  Medal
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { getAllProductsForReview } from "@/services/moderator-server-action";
import { IProduct } from "@/types/Dashboard/moderator-dashboard-types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TopVotedProducts = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTopVotedProducts = async () => {
    setIsLoading(true);
    try {
      // Fetch top 6 products sorted by votes in descending order
      const res = await getAllProductsForReview(
        1,
        6,
        undefined,
        undefined,
        undefined,
        "votes",
        "desc"
      );
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
    fetchTopVotedProducts();
  }, []);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="w-5 h-5 text-amber-500 fill-amber-500/10" />;
      case 1: return <Trophy className="w-5 h-5 text-zinc-400 fill-zinc-400/10" />;
      case 2: return <Medal className="w-5 h-5 text-orange-400 fill-orange-400/10" />;
      default: return <Award className="w-5 h-5 text-zinc-300" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            <h1 className="text-3xl font-bold tracking-tight">Top Voted Products</h1>
          </div>
          <p className="text-zinc-500 text-sm">Real-time ranking of the top 6 most popular innovations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {products.slice(0, 3).map((product, index) => (
          <div key={product.id} className="relative group overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="absolute top-4 right-4">
              {getRankIcon(index)}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shrink-0">
                <img src={product.photo} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <h3 className="font-black text-lg truncate dark:text-zinc-100">{product.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-[10px] py-0 h-4 border-zinc-200 dark:border-zinc-800">
                    Rank #{index + 1}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-50 dark:border-zinc-900">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <ThumbsUp size={14} className="text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xl font-black dark:text-zinc-100">{product.votes}</span>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Votes</span>
              </div>

              <Button size="sm" variant="ghost" className="rounded-lg h-9" asChild>
                <Link href={`/products/${product.id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  <span className="text-xs font-bold">Details</span>
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="border rounded-2xl bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
        <div className="relative">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
              <p className="text-zinc-500 font-medium">Calculating current rankings...</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[80px] font-black uppercase text-[10px] tracking-widest text-center">Rank</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">Product Details</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Popularity</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product, index) => (
                  <TableRow key={product.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                    <TableCell className="text-center font-black text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-800 flex-shrink-0">
                          <img src={product.photo} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-sm dark:text-zinc-100">{product.name}</p>
                          <p className="text-[10px] text-zinc-500 truncate max-w-[200px]">{product.description.substring(0, 50)}...</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                        <ThumbsUp size={12} className="text-blue-500" />
                        <span className="text-xs font-black">{product.votes}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 rounded-lg px-4 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all active:scale-95"
                        asChild
                      >
                        <Link href={`/products/${product.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          <span className="text-xs font-bold">Details</span>
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopVotedProducts;
