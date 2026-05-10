"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Eye, 
  Trash2, 
  Loader2, 
  Flag,
  AlertTriangle,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { 
  getAllProductsForReview, 
  deleteProductByModerator 
} from "@/services/moderator-server-action";
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
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ReportedProducts = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchReportedProducts = async () => {
    setIsLoading(true);
    try {
      // Fetch only products with reportedStatus: true
      const res = await getAllProductsForReview(1, 50, undefined, undefined, true);
      if (res.success) {
        setProducts(res.data.data);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Failed to load reported products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportedProducts();
  }, []);

  const handleDelete = async () => {
    if (!productToDelete) return;
    
    setIsDeleting(true);
    try {
      const res = await deleteProductByModerator(productToDelete);
      if (res.success) {
        toast.success("Product deleted successfully");
        fetchReportedProducts();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Deletion failed");
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Flag className="w-5 h-5 text-rose-500" />
            <h1 className="text-3xl font-bold tracking-tight">Reported Content</h1>
          </div>
          <p className="text-zinc-500 text-sm">Review products that have been flagged by the community.</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            placeholder="Search reported items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 rounded-xl"
          />
        </div>
      </div>

      <div className="border rounded-2xl bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-rose-500" />
            <p className="text-zinc-500 font-medium animate-pulse">Scanning reported database...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <Table>
            <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[40%] font-black uppercase text-[10px] tracking-widest">Product Info</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Submitter</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Report Count</TableHead>
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
                          <Badge variant="outline" className="text-[9px] py-0 h-4 uppercase tracking-tighter bg-zinc-50 dark:bg-zinc-900 border-none">
                            {product.status}
                          </Badge>
                          <a 
                            href={product.links} 
                            target="_blank" 
                            className="text-[10px] text-zinc-400 hover:text-blue-500 flex items-center gap-0.5 transition-colors"
                          >
                            Live <ExternalLink size={8} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-xs font-mono text-zinc-500 truncate max-w-[120px]">{product.ownerId}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50 flex items-center gap-1.5">
                        <AlertTriangle size={12} className="fill-rose-500/10" />
                        <span className="text-sm font-black">{product.report || 0}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 rounded-lg px-3 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all active:scale-95"
                        asChild
                      >
                        <Link href={`/products/${product.id}`}>
                          <Eye className="w-4 h-4 mr-2 text-zinc-500" /> 
                          <span className="text-xs font-bold">Details</span>
                        </Link>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 rounded-lg px-3 border-rose-100 dark:border-rose-900/30 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all active:scale-95"
                        onClick={() => setProductToDelete(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center gap-2 bg-zinc-50/50 dark:bg-zinc-900/30">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2">
              <Flag className="w-6 h-6 opacity-40" />
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 font-bold">Zero reports found</p>
            <p className="text-zinc-400 text-xs">All products are within community guidelines.</p>
          </div>
        )}
      </div>

      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent className="rounded-2xl border-rose-100 dark:border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-rose-600 font-black">
              <Trash2 className="w-5 h-5" /> Confirm Permanent Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-500 dark:text-zinc-400">
              This action cannot be undone. This product will be permanently removed from the platform. Are you absolutely sure?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="rounded-xl border-zinc-200 dark:border-zinc-800 font-bold">Cancel Operation</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, Delete Product"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ReportedProducts;
