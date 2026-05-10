"use client";

import React, { useState, useEffect } from "react";
import {
  Eye,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Star,
  Loader2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";


import {
  getAllProductsForReview,
  updateProductByModerator
} from "@/services/moderator-server-action";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductDetailsModal from "@/components/modules/Dasboard/Moderator_Dashboard/ProductReviewQueue/ProductDetailsModal";
import { IProduct, ProductStatus } from "@/types/Dashboard/moderator-dashboard-types";

const ProductReviewQueue = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [featuredFilter, setFeaturedFilter] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const isFeatured = featuredFilter === "featured" ? true : featuredFilter === "unfeatured" ? false : undefined;
      const res = await getAllProductsForReview(1, 50, statusFilter === "all" ? undefined : statusFilter, isFeatured);
      if (res.success) {
        setProducts(res.data.data);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [statusFilter, featuredFilter]);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusUpdate = async (id: string, status: ProductStatus) => {
    try {
      const res = await updateProductByModerator(id, { status });
      if (res.success) {
        toast.success(`Product ${status.toLowerCase()} successfully`);
        fetchProducts();
        if (selectedProduct?.id === id) setIsModalOpen(false);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      const res = await updateProductByModerator(id, { isFeatured: !current });
      if (res.success) {
        toast.success(current ? "Removed from featured" : "Marked as featured");
        fetchProducts();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Review Queue</h1>
          <p className="text-zinc-500">Review, feature, or moderate submitted products.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <Star className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Featured" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="featured">Featured Only</SelectItem>
              <SelectItem value="unfeatured">Unfeatured</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-xl bg-white dark:bg-zinc-900 overflow-hidden">
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-zinc-500 animate-pulse">Loading review queue...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-zinc-100 bg-zinc-50 flex-shrink-0">
                        <img
                          src={product.photo}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="max-w-[200px]">
                        <p className="font-semibold truncate">{product.name}</p>
                        <p className="text-xs text-zinc-500 truncate">{product.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {product.tags?.slice(0, 2).map((t, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] px-1 py-0 h-4">
                          {t.tag.name}
                        </Badge>
                      ))}
                      {(product.tags?.length ?? 0) > 2 && (
                        <span className="text-[10px] text-zinc-400">+{product.tags!.length - 2}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        product.status === "APPROVED" ? "bg-green-100 text-green-700 border-green-200" :
                          product.status === "REJECTED" ? "bg-red-100 text-red-700 border-red-200" :
                            "bg-yellow-100 text-yellow-700 border-yellow-200"
                      }
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleFeatured(product.id, product.isFeatured)}
                      className={product.isFeatured ? "text-yellow-500" : "text-zinc-300"}
                    >
                      <Star className={product.isFeatured ? "fill-yellow-500" : ""} size={18} />
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsModalOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" /> Details
                      </Button>

                      {product.status === "PENDING" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleStatusUpdate(product.id, "APPROVED")}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleStatusUpdate(product.id, "REJECTED")}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center gap-2 text-zinc-500">
            <AlertCircle className="w-8 h-8 opacity-20" />
            <p>No products found in the review queue.</p>
          </div>
        )}
      </div>

      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={fetchProducts}
      />
    </div>
  );
};

export default ProductReviewQueue;
