"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Hash,
  ArrowRight,
  TrendingUp,
  Package
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { useMyProducts } from '@/hooks/useProducts'
import { useTags } from '@/hooks/useTags'
import { deleteProduct } from '@/services/productService'
import { IProduct } from '@/types/product.types'
import UpdateProductModal from './UpdateProductModal'
import PaginationControls from '@/components/shared/pagination_controll/PaginationControll'
import { cn } from '@/lib/utils'

const MyProducts = () => {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<IProduct | null>(null)

  const { data, isLoading } = useMyProducts({
    searchTerm,
    tagName: selectedTag === 'all' ? undefined : selectedTag,
    page: currentPage,
    limit: 6
  })

  const { data: tagsData } = useTags()

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', 'my'] })
      toast.success("Product Decommissioned", {
        description: "The innovation has been successfully removed from the registry.",
        className: "bg-destructive text-white border-none shadow-2xl",
      })
      setIsDeleteDialogOpen(false)
    },
    onError: (error: any) => {
      toast.error("Operation Failed", {
        description: error.message || "An unexpected error occurred during decommissioning.",
      })
    }
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1.5 font-bold uppercase text-[9px] px-3"><CheckCircle2 className="w-3 h-3" /> Approved</Badge>
      case 'PENDING':
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 gap-1.5 font-bold uppercase text-[9px] px-3"><Clock className="w-3 h-3" /> Under Review</Badge>
      case 'REJECTED':
        return <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 gap-1.5 font-bold uppercase text-[9px] px-3"><XCircle className="w-3 h-3" /> Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleDeleteClick = (product: IProduct) => {
    if (product.status === 'APPROVED') {
      toast.error("Access Restricted", {
        description: "Approved products cannot be deleted by users. Please contact a moderator for removal requests.",
      })
      return
    }
    setProductToDelete(product)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card border border-border p-8 rounded-[2.5rem] shadow-xl shadow-primary/5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary w-fit rounded-lg text-[10px] font-black uppercase tracking-widest border border-primary/20">
            <Package className="w-3 h-3" />
            Inventory Protocol
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tighter">My <span className="text-primary italic font-serif">Innovations</span></h2>
          <p className="text-muted-foreground text-sm font-medium">Manage and monitor the status of your submitted technological breakthroughs.</p>
        </div>
        <Link href="/user/dashboard/add-product">
          <Button className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] gap-3 shadow-2xl shadow-primary/20 hover:-translate-y-1 transition-all">
            Launch New Innovation
            <Plus className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search innovations by name..."
            className="h-14 pl-12 rounded-2xl bg-card border-border focus:ring-4 focus:ring-primary/10 font-bold transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 lg:w-fit">
          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="h-14 w-full sm:w-[220px] rounded-2xl bg-card border-border font-bold">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" />
                <SelectValue placeholder="Category Filter" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border">
              <SelectItem value="all" className="font-bold">All Categories</SelectItem>
              {tagsData?.map(tag => (
                <SelectItem key={tag.id} value={tag.name} className="font-bold">{tag.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border hover:bg-transparent h-16">
              <TableHead className="w-[300px] text-[10px] font-black uppercase tracking-[0.2em] px-8">Product Intelligence</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em]">Status</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em]">Engagement</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em]">Tags</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-right px-8">Registry Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-border animate-pulse">
                  <TableCell className="px-8"><div className="h-12 bg-muted rounded-xl w-full" /></TableCell>
                  <TableCell><div className="h-6 bg-muted rounded-lg w-24" /></TableCell>
                  <TableCell><div className="h-6 bg-muted rounded-lg w-16" /></TableCell>
                  <TableCell><div className="h-6 bg-muted rounded-lg w-32" /></TableCell>
                  <TableCell className="px-8"><div className="h-10 bg-muted rounded-xl w-10 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : data?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-80 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4 opacity-50">
                    <Package className="w-12 h-12 text-muted-foreground" />
                    <p className="font-bold italic text-muted-foreground uppercase tracking-widest text-[10px]">No innovations found in the current sector.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : data?.data.map((product) => (
              <TableRow key={product.id} className="border-border hover:bg-muted/30 group transition-all duration-300">
                <TableCell className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-border group-hover:scale-105 transition-transform shrink-0">
                      <img src={product.photo} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-black text-foreground truncate group-hover:text-primary transition-colors uppercase tracking-tight">{product.name}</h4>
                      <p className="text-[10px] text-muted-foreground font-bold truncate opacity-60">Posted: {new Date(product.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(product.status)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                    <div className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-primary" /> {product.votes}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1.5">
                    {product.tags?.slice(0, 2).map(pt => (
                      <Badge key={pt.tagId} variant="outline" className="text-[8px] font-black uppercase tracking-widest h-6 border-primary/20 bg-primary/5 text-primary">
                        {pt.tag.name}
                      </Badge>
                    ))}
                    {product.tags && product.tags.length > 2 && <span className="text-[8px] font-black text-muted-foreground">+{product.tags.length - 2}</span>}
                  </div>
                </TableCell>
                <TableCell className="px-8 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-2xl border-border shadow-2xl p-2">
                      <DropdownMenuItem className="rounded-xl font-bold text-xs py-3 gap-3 cursor-pointer" asChild>
                        <Link href={`/products/${product.id}`}>
                          <Eye className="w-4 h-4 text-primary" /> View Registry
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-xl font-bold text-xs py-3 gap-3 cursor-pointer" onClick={() => {
                        setSelectedProduct(product)
                        setIsUpdateModalOpen(true)
                      }}>
                        <Edit2 className="w-4 h-4 text-primary" /> Optimize Product
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-border" />
                      <DropdownMenuItem
                        className={cn(
                          "rounded-xl font-bold text-xs py-3 gap-3 cursor-pointer",
                          product.status === 'APPROVED' ? "opacity-50 cursor-not-allowed" : "text-destructive hover:bg-destructive/5"
                        )}
                        onClick={() => handleDeleteClick(product)}
                      >
                        <Trash2 className="w-4 h-4" /> Decommission
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination Section */}
        {data && data.meta.total_page > 1 && (
          <div className="p-8 border-t border-border bg-muted/20">
            <PaginationControls
              meta={{
                limit: 6,
                current_page: currentPage,
                total_page: data.meta.total_page,
                total: data.meta.total
              }}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-[2.5rem] border-none shadow-3xl bg-card max-w-md p-8">
          <AlertDialogHeader className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="text-center space-y-2">
              <AlertDialogTitle className="text-2xl font-black tracking-tight uppercase">Decommission Innovation?</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground font-medium italic">
                Are you sure you want to remove <span className="text-foreground font-black not-italic">{productToDelete?.name}</span>? This structural removal cannot be synchronized back.
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-3 pt-6">
            <AlertDialogCancel className="h-12 rounded-xl font-bold uppercase text-[10px] tracking-widest border-border flex-1">Cancel Protocol</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => productToDelete && deleteMutation.mutate(productToDelete.id)}
              className="h-12 rounded-xl bg-destructive hover:bg-destructive/90 text-white font-bold uppercase text-[10px] tracking-widest flex-1"
            >
              Confirm Deletion
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Update Modal */}
      <UpdateProductModal
        product={selectedProduct}
        isOpen={isUpdateModalOpen}
        onOpenChange={setIsUpdateModalOpen}
      />
    </div>
  )
}

export default MyProducts
