"use client"

import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Rocket, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Type, 
  AlignLeft, 
  Hash, 
  Plus, 
  X, 
  Sparkles, 
  Save, 
  CheckCircle2,
  Info 
} from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

import { useTags } from '@/hooks/useTags'
import { updateProduct } from '@/services/productService'
import { IProduct } from '@/types/product.types'
import { z } from 'zod'

const updateProductSchema = z.object({
  name: z.string().min(1, "Product name is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  tagIds: z.array(z.string()).optional(),
  links: z.string().url("Must be a valid URL").optional(),
  photo: z.any().optional(),
})

type UpdateProductFormValues = z.infer<typeof updateProductSchema>

interface UpdateProductModalProps {
  product: IProduct | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const UpdateProductModal = ({ product, isOpen, onOpenChange }: UpdateProductModalProps) => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { data: tagsData } = useTags()
  
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const form = useForm<UpdateProductFormValues>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      name: '',
      description: '',
      tagIds: [],
      links: '',
    }
  })

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description,
        tagIds: product.tags?.map(t => t.tagId) || [],
        links: product.links,
      })
      setImagePreview(null)
      setSelectedFile(null)
    }
  }, [product, form])

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      if (!product) throw new Error("No product selected")
      return updateProduct(product.id, formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', 'my'] })
      toast.success("Innovation Successfully Optimized", {
        description: "The registry has been synchronized with your improvements.",
        className: "bg-primary text-white border-none shadow-2xl",
      })
      onOpenChange(false)
    },
    onError: (error: any) => {
      toast.error("Optimization Interrupted", {
        description: error.message || "An unexpected error occurred during the update.",
      })
    }
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = (values: UpdateProductFormValues) => {
    const formData = new FormData()
    if (values.name) formData.append('name', values.name)
    if (values.description) formData.append('description', values.description)
    if (values.links) formData.append('links', values.links)
    
    if (values.tagIds) {
      values.tagIds.forEach(id => formData.append('tagIds', id))
    }
    
    if (selectedFile) {
      formData.append('photo', selectedFile)
    }

    mutation.mutate(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="lg:max-w-4xl w-[95vw] p-0 overflow-y-auto max-h-[95vh] custom-scrollbar border-none shadow-3xl rounded-[3rem] bg-card transition-all duration-500">
        <DialogHeader className="sr-only">
          <DialogTitle>Optimize Innovation</DialogTitle>
          <DialogDescription>Apply structural improvements to your product dossier.</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          {/* Header */}
          <div className="relative h-64 bg-primary flex items-center px-12 group overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
             <div className="relative z-10 flex items-center gap-10 w-full">
                <div className="relative h-44 w-44 rounded-[2.5rem] overflow-hidden border-4 border-card shadow-2xl bg-muted group/avatar transition-all duration-500 hover:rotate-2 shrink-0">
                    {imagePreview ? (
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    ) : product?.photo ? (
                      <Image src={product.photo} alt={product.name} fill className="object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center"><ImageIcon className="w-12 h-12 text-muted-foreground/40" /></div>
                    )}
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center cursor-pointer transition-all duration-500 backdrop-blur-sm">
                       <Camera className="w-8 h-8 text-white" />
                       <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                </div>
                <div className="flex-1 text-white">
                   <div className="flex items-center gap-2 mb-2 opacity-80 uppercase tracking-[0.4em] text-[10px] font-black">
                      <Rocket className="w-3 h-3" />
                      Innovation Dossier
                   </div>
                   <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-tight truncate">
                      {product?.name || "Optimize Product"}
                   </h2>
                   <div className="mt-3 flex items-center gap-3 px-3 py-1 bg-black/20 rounded-lg w-fit border border-white/10 text-[10px] font-bold tracking-widest opacity-90 uppercase">
                      ID: {product?.id?.slice(0, 8)}...
                   </div>
                </div>
             </div>
             <DialogClose asChild>
                <Button type="button" variant="ghost" className="absolute top-8 right-8 h-12 w-12 rounded-xl bg-black/20 hover:bg-black/40 text-white backdrop-blur-md border border-white/10">
                   <X className="w-6 h-6" />
                </Button>
             </DialogClose>
          </div>

          {/* Form Body */}
          <div className="p-12 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Innovation Name</label>
                    <div className="relative group">
                      <Type className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input {...form.register('name')} className="rounded-2xl border-border bg-muted/30 focus:bg-background focus:ring-4 focus:ring-primary/10 h-14 pl-12 font-bold transition-all" />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">The Narrative</label>
                    <div className="relative group">
                      <AlignLeft className="absolute left-4 top-5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Textarea {...form.register('description')} className="rounded-2xl border-border bg-muted/30 focus:bg-background focus:ring-4 focus:ring-primary/10 min-h-[160px] pl-12 pt-5 font-medium leading-relaxed transition-all" />
                    </div>
                 </div>
              </div>

              <div className="space-y-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Primary Connectivity (URL)</label>
                    <div className="relative group">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input {...form.register('links')} className="rounded-2xl border-border bg-muted/30 focus:bg-background focus:ring-4 focus:ring-primary/10 h-14 pl-12 font-bold transition-all" />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Subject Classification</label>
                    <div className="flex flex-wrap gap-2">
                       <AnimatePresence>
                          {form.watch('tagIds')?.map(tagId => {
                            const tag = tagsData?.find(t => t.id === tagId)
                            return (
                               <motion.div
                                 key={tagId}
                                 initial={{ scale: 0.8, opacity: 0 }}
                                 animate={{ scale: 1, opacity: 1 }}
                                 exit={{ scale: 0.8, opacity: 0 }}
                               >
                                 <Badge variant="secondary" className="h-10 px-4 rounded-xl gap-2 font-black uppercase text-[10px] tracking-wider bg-primary/10 text-primary border border-primary/20">
                                   <Hash className="w-3 h-3" />
                                   {tag?.name || 'Tag'}
                                   <button type="button" onClick={() => form.setValue('tagIds', form.getValues('tagIds')?.filter(id => id !== tagId))}><X className="w-3 h-3" /></button>
                                 </Badge>
                               </motion.div>
                            )
                          })}
                       </AnimatePresence>
                       <Controller 
                         name="tagIds"
                         control={form.control}
                         render={({ field }) => (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button type="button" variant="outline" className="h-10 px-4 rounded-xl border-dashed border-border/50 hover:border-primary/40 text-[10px] font-black uppercase tracking-widest gap-2">
                                  <Plus className="w-3.5 h-3.5 text-primary" /> Add Subject
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="p-0 rounded-2xl border-border" align="start">
                                <Command className="rounded-2xl">
                                  <CommandInput placeholder="Search tech/industries..." className="font-bold text-xs" />
                                  <CommandEmpty className="py-4 text-xs font-bold text-muted-foreground text-center">No categories found.</CommandEmpty>
                                  <CommandGroup className="max-h-60 overflow-auto">
                                    {tagsData?.filter(t => !field.value?.includes(t.id)).map((tag) => (
                                      <CommandItem key={tag.id} value={tag.name} onSelect={() => field.onChange([...(field.value || []), tag.id])} className="rounded-xl font-bold text-xs py-3 px-4 cursor-pointer">
                                        {tag.name}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </Command>
                              </PopoverContent>
                            </Popover>
                         )}
                       />
                    </div>
                 </div>
              </div>
            </div>

            <div className="pt-8 border-t border-border flex flex-col sm:flex-row gap-4">
               <Button type="button" variant="outline" className="w-full sm:flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] border-border hover:bg-muted" onClick={() => onOpenChange(false)}>
                  Cancel Optimization
               </Button>
               <Button type="submit" disabled={mutation.isPending} className="w-full sm:flex-[2] h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 active:scale-95 group">
                  {mutation.isPending ? (
                    <div className="flex items-center gap-3"><div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Transmitting...</div>
                  ) : (
                    <div className="flex items-center gap-2"><Save className="w-4 h-4" /> Commit Changes</div>
                  )}
               </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const Camera = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
)

export default UpdateProductModal
