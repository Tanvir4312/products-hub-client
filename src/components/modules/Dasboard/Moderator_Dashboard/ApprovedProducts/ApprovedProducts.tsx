"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Eye, 
  Loader2, 
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  ThumbsUp
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const ApprovedProducts = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchApprovedProducts = async () => {
    setIsLoading(true);
    try {
      // Fetch only products with status: APPROVED
      const res = await getAllProductsForReview(1, 50, "APPROVED");
      if (res.success) {
        setProducts(res.data.data);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Failed to load approved products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedProducts();
  }, []);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <h1 className="text-3xl font-bold tracking-tight">Approved Library</h1>
          </div>
          <p className="text-zinc-500 text-sm">Review the full collection of live products on the platform.</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            placeholder="Search approved items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 rounded-xl"
          />
        </div>
      </div>

      <div className="border rounded-2xl bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
            <p className="text-zinc-500 font-medium animate-pulse">Accessing live registry...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <Table>
            <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[40%] font-black uppercase text-[10px] tracking-widest">Product</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Stats</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Approval Date</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex-shrink-0">
                        <img 
                          src={product.photo} 
                          alt={product.name} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate dark:text-zinc-100">{product.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge className="text-[9px] py-0 h-4 uppercase tracking-tighter bg-emerald-500/10 text-emerald-600 border-none">
                            Live
                          </Badge>
                          {product.isFeatured && (
                            <Badge className="text-[9px] py-0 h-4 uppercase tracking-tighter bg-amber-500/10 text-amber-600 border-none">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-4">
                      <div className="flex flex-col items-center">
                        <ThumbsUp size={12} className="text-blue-500 mb-0.5" />
                        <span className="text-[10px] font-black">{product._count?.votedUsers || 0}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <MessageSquare size={12} className="text-purple-500 mb-0.5" />
                        <span className="text-[10px] font-black">{product._count?.reviews || 0}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-xs font-medium text-zinc-500">
                      {new Date(product.updatedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </p>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 rounded-lg px-4 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all active:scale-95"
                      asChild
                    >
                      <Link href={`/products/${product.id}`}>
                        <Eye className="w-4 h-4 mr-2 text-zinc-500" /> 
                        <span className="text-xs font-bold">Details</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center gap-2 bg-zinc-50/50 dark:bg-zinc-900/30">
            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-2">
              <CheckCircle2 className="w-6 h-6 opacity-20" />
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 font-bold">No approved products</p>
            <p className="text-zinc-400 text-xs">Waiting for moderation actions to be performed.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovedProducts;
