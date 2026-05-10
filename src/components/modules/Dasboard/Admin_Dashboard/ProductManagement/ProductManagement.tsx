"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Loader2,
  MoreVertical,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Star,
  StarOff,
  Eye,
  ArrowUpDown,
  Calendar,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Layers,
  ThumbsUp,
  MessageSquare,
  AlertTriangle,
  LayoutGrid,
  Hash,
} from "lucide-react";
import { toast } from "sonner";
import {
  getAllProducts,
  updateProduct,
  getAllTags,
} from "@/services/admin-server-action";
import { IProduct } from "@/types/Dashboard/admin-dashboard-types/products-management.types";
import { ITag } from "@/types/Dashboard/admin-dashboard-types/tags-managements.types";

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

interface ProductManagementProps {
  defaultStatus?: string;
  defaultFeatured?: string;
  defaultReported?: string;
  pageTitle?: string;
  pageSubtitle?: string;
}

const ProductManagement = ({
  defaultStatus = "all",
  defaultFeatured = "all",
  defaultReported = "all",
  pageTitle = "Product",
  pageSubtitle = "Managing platform products, approval cycles, and featured items."
}: ProductManagementProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlTagName = searchParams.get("tagName");

  const [products, setProducts] = useState<IProduct[]>([]);
  const [allTags, setAllTags] = useState<ITag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tagNameFilter, setTagNameFilter] = useState(urlTagName || "all");
  const [statusFilter, setStatusFilter] = useState(defaultStatus);
  const [featuredFilter, setFeaturedFilter] = useState(defaultFeatured);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState<any>(null);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await getAllProducts(
        page,
        limit,
        undefined, // Removed searchTerm
        statusFilter,
        featuredFilter === "all" ? undefined : featuredFilter,
        sortBy,
        sortOrder,
        defaultReported === "all" ? undefined : defaultReported,
        tagNameFilter === "all" ? undefined : tagNameFilter
      );
      if (res.success) {
        setProducts(res.data.data);
        setMeta(res.data.meta);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await getAllTags();
      if (res.success) {
        setAllTags(res.data);
      }
    } catch (error) {
      console.error("Failed to load tags");
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    if (urlTagName) {
      setTagNameFilter(urlTagName);
    } else {
      setTagNameFilter("all");
    }
  }, [urlTagName]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(timer);
  }, [page, limit, tagNameFilter, statusFilter, featuredFilter, sortBy, sortOrder]);

  const handleStatusUpdate = async (productId: string, status: "APPROVED" | "REJECTED") => {
    try {
      const res = await updateProduct(productId, { status });
      if (res.success) {
        toast.success(`Product ${status.toLowerCase()} successfully`);
        fetchProducts();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Failed to update product status");
    }
  };

  const handleFeaturedToggle = async (productId: string, isFeatured: boolean) => {
    try {
      const res = await updateProduct(productId, { isFeatured });
      if (res.success) {
        toast.success(isFeatured ? "Product marked as featured" : "Product unmarked from featured");
        fetchProducts();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Failed to update featured status");
    }
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED": return <Badge className="bg-emerald-500/10 text-emerald-600 border-none px-2 py-0 h-5 uppercase text-[9px] font-black tracking-widest">Approved</Badge>;
      case "PENDING": return <Badge className="bg-amber-500/10 text-amber-600 border-none px-2 py-0 h-5 uppercase text-[9px] font-black tracking-widest">Pending</Badge>;
      case "REJECTED": return <Badge className="bg-rose-500/10 text-rose-600 border-none px-2 py-0 h-5 uppercase text-[9px] font-black tracking-widest">Rejected</Badge>;
      default: return null;
    }
  };

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, meta?.total || 0);

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-zinc-950 p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-900 shadow-xl shadow-zinc-200/20 dark:shadow-none relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Layers className="w-40 h-40 text-zinc-900 dark:text-white" />
        </div>
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-600 w-fit rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
            <LayoutGrid className="w-3 h-3" />
            Inventory Control
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 italic">{pageTitle} <span className="text-zinc-400 font-serif">Registry</span></h1>
          <p className="text-zinc-500 text-sm font-medium">{pageSubtitle}</p>
          {urlTagName && (
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-teal-500/10 text-teal-600 border-teal-500/20 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Hash className="w-3 h-3" />
                Tag: {urlTagName}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/admin/dashboard/products")}
                className="h-7 px-2 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-rose-500 transition-colors"
              >
                Clear Filter
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto relative z-10">
          <div className="relative w-full sm:w-64">
            <Select value={tagNameFilter} onValueChange={(v) => { setTagNameFilter(v); setPage(1); }}>
              <SelectTrigger className="h-12 rounded-2xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-black uppercase tracking-widest pl-10 relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <SelectValue placeholder="All Tags" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest">All Tags</SelectItem>
                {allTags.map((tag) => (
                  <SelectItem key={tag.id} value={tag.name} className="text-[10px] font-black uppercase tracking-widest">
                    {tag.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            {defaultStatus === "all" && (
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                <SelectTrigger className="w-full sm:w-32 h-12 rounded-2xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-black uppercase tracking-widest">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest">All Status</SelectItem>
                  <SelectItem value="APPROVED" className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Approved</SelectItem>
                  <SelectItem value="PENDING" className="text-[10px] font-black uppercase tracking-widest text-amber-600">Pending</SelectItem>
                  <SelectItem value="REJECTED" className="text-[10px] font-black uppercase tracking-widest text-rose-600">Rejected</SelectItem>
                </SelectContent>
              </Select>
            )}

            {defaultFeatured === "all" && (
              <Select value={featuredFilter} onValueChange={(v) => { setFeaturedFilter(v); setPage(1); }}>
                <SelectTrigger className="w-full sm:w-32 h-12 rounded-2xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-black uppercase tracking-widest">
                  <SelectValue placeholder="Featured" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest">All Items</SelectItem>
                  <SelectItem value="true" className="text-[10px] font-black uppercase tracking-widest text-blue-500">Featured</SelectItem>
                  <SelectItem value="false" className="text-[10px] font-black uppercase tracking-widest">Regular</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-zinc-200/20 dark:shadow-none">
        <Table>
          <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50">
            <TableRow className="border-zinc-100 dark:border-zinc-900 hover:bg-transparent h-16">
              <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <button onClick={() => toggleSort("name")} className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  Innovation <ArrowUpDown size={12} />
                </button>
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Owner</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center">Engagement</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center">Lifecycle</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center">Status</TableHead>
              <TableHead className="px-8 text-right text-[10px] font-black uppercase tracking-widest text-zinc-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i} className="animate-pulse border-zinc-100 dark:border-zinc-900 h-24">
                  <TableCell className="px-8"><div className="h-10 w-48 bg-zinc-100 dark:bg-zinc-900 rounded-xl" /></TableCell>
                  <TableCell><div className="h-10 w-32 bg-zinc-100 dark:bg-zinc-900 rounded-xl" /></TableCell>
                  <TableCell><div className="h-6 w-24 bg-zinc-100 dark:bg-zinc-900 rounded-lg mx-auto" /></TableCell>
                  <TableCell><div className="h-6 w-16 bg-zinc-100 dark:bg-zinc-900 rounded-lg mx-auto" /></TableCell>
                  <TableCell><div className="h-6 w-20 bg-zinc-100 dark:bg-zinc-900 rounded-lg mx-auto" /></TableCell>
                  <TableCell className="px-8"><div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-900 rounded-xl ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id} className="border-zinc-100 dark:border-zinc-900 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 group transition-all duration-300 h-24">
                  <TableCell className="px-8">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                        {product.photo ? (
                          <Image src={product.photo} alt={product.name} fill className="object-cover" />
                        ) : (
                          <Layers className="w-5 h-5 text-zinc-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{product.name}</p>
                          {product.isFeatured && <Star className="w-3 h-3 text-blue-500 fill-blue-500" />}
                        </div>
                        <p className="text-[10px] font-medium text-zinc-500 truncate max-w-[200px] mt-0.5">{product.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="relative w-6 h-6 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800">
                        <Image src={product.owner.profilePhoto || "/placeholder.png"} alt={product.owner.name} fill className="object-cover" />
                      </div>
                      <span className="text-[11px] font-black tracking-tighter truncate max-w-[100px]">{product.owner.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-3 text-zinc-400">
                      <div className="flex items-center gap-1">
                        <ThumbsUp size={10} />
                        <span className="text-[10px] font-bold">{product._count.votedUsers}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare size={10} />
                        <span className="text-[10px] font-bold">{product._count.reviews}</span>
                      </div>
                      {product._count.reportedUsers > 0 && (
                        <div className="flex items-center gap-1 text-rose-500">
                          <AlertTriangle size={10} />
                          <span className="text-[10px] font-bold">{product._count.reportedUsers}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="flex items-center gap-1.5 text-zinc-500">
                        <Calendar size={10} />
                        <span className="text-[9px] font-bold uppercase tracking-tighter">
                          {new Date(product.createdAt).toLocaleDateString(undefined, { dateStyle: "short" })}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(product.status)}
                  </TableCell>
                  <TableCell className="px-8 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                          <MoreVertical className="h-4 w-4 text-zinc-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-zinc-200 dark:border-zinc-800 shadow-2xl">
                        <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">Product Control</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => router.push(`/products/${product.id}`)}
                          className="rounded-xl px-3 py-2 text-xs font-bold gap-3 focus:bg-zinc-100 dark:focus:bg-zinc-900 cursor-pointer"
                        >
                          <Eye className="w-4 h-4 text-zinc-400" /> View Intelligence
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <div className="px-3 py-2 space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Governance</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={product.status === "APPROVED"}
                            onClick={() => handleStatusUpdate(product.id, "APPROVED")}
                            className="w-full justify-start h-8 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 mr-2" /> Approve Innovation
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={product.status === "REJECTED"}
                            onClick={() => handleStatusUpdate(product.id, "REJECTED")}
                            className="w-full justify-start h-8 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg"
                          >
                            <ShieldX className="w-3.5 h-3.5 mr-2" /> Reject Concept
                          </Button>
                        </div>

                        <DropdownMenuSeparator />

                        <div className="px-3 py-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Promotion</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFeaturedToggle(product.id, !product.isFeatured)}
                            className={`w-full justify-start h-8 text-xs font-bold rounded-lg ${product.isFeatured
                                ? "text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                : "text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                              }`}
                          >
                            {product.isFeatured ? (
                              <><StarOff className="w-3.5 h-3.5 mr-2" /> Unmark Featured</>
                            ) : (
                              <><Star className="w-3.5 h-3.5 mr-2" /> Mark as Featured</>
                            )}
                          </Button>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-96 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4 opacity-50">
                    <AlertCircle className="w-16 h-16 text-zinc-400" />
                    <div>
                      <p className="font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest text-sm italic">Zero Records Found</p>
                      <p className="text-zinc-500 text-[10px] font-bold uppercase mt-1 tracking-tighter">No products matched your current filtering criteria.</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {meta && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-8 py-6 bg-zinc-50/50 dark:bg-zinc-900/30 border-t border-zinc-100 dark:border-zinc-900 gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-zinc-500">Rows per page</span>
              <Select value={limit.toString()} onValueChange={(v) => { setLimit(Number(v)); setPage(1); }}>
                <SelectTrigger className="w-20 h-9 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-black">
                  <SelectValue placeholder={limit} />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <p className="text-xs font-bold text-zinc-400">
              Showing <span className="text-zinc-900 dark:text-zinc-100">{from}</span> to <span className="text-zinc-900 dark:text-zinc-100">{to}</span> of <span className="text-zinc-900 dark:text-zinc-100">{meta.total}</span> results
            </p>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => setPage(1)} className="rounded-xl h-9 w-9 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-500 transition-all active:scale-95">
                <ChevronsLeft size={16} />
              </Button>
              <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="rounded-xl h-9 w-9 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-500 transition-all active:scale-95">
                <ChevronLeft size={16} />
              </Button>
              <div className="px-4 text-xs font-bold text-zinc-600 dark:text-zinc-400 min-w-[100px] text-center">
                Page <span className="text-zinc-900 dark:text-zinc-100">{page}</span> of <span className="text-zinc-900 dark:text-zinc-100">{meta.total_page}</span>
              </div>
              <Button variant="outline" size="icon" disabled={page >= meta.total_page} onClick={() => setPage(p => p + 1)} className="rounded-xl h-9 w-9 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-500 transition-all active:scale-95">
                <ChevronRight size={16} />
              </Button>
              <Button variant="outline" size="icon" disabled={page >= meta.total_page} onClick={() => setPage(meta.total_page)} className="rounded-xl h-9 w-9 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-500 transition-all active:scale-95">
                <ChevronsRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
