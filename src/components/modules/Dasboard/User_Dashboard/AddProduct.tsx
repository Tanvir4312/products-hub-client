"use client"

import React, { useState, useEffect } from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
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
  CheckCircle2,
  ArrowRight,
  Info
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover'
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem 
} from '@/components/ui/command'
import { cn } from '@/lib/utils'

import { useTags } from '@/hooks/useTags'
import { createProduct } from '@/services/productService'
import { createProductSchema, CreateProductFormValues } from '@/zod/productZodValidation'
import { ProductCard } from '@/components/shared/ProductCard/ProductCard'

const AddProduct = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: tagsData } = useTags()
  
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const { 
    register, 
    handleSubmit, 
    control, 
    watch, 
    setValue,
    formState: { errors } 
  } = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      tagIds: [],
      links: '',
      photo: undefined as unknown as File,
    } as CreateProductFormValues
  })

  const watchedValues = watch()

  const mutation = useMutation({
    mutationFn: (formData: FormData) => createProduct(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success("Innovation Successfully Registered", {
        description: "Your product has been submitted and is pending review by our moderators.",
        className: "bg-primary text-white border-none shadow-2xl",
      })
      router.push('/user/dashboard/my-products')
    },
    onError: (error: any) => {
      toast.error("Launch Interrupted", {
        description: error.message || "An unexpected error occurred during the product registration.",
      })
    }
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setValue('photo', file, { shouldValidate: true })
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit: SubmitHandler<CreateProductFormValues> = (values) => {
    const formData = new FormData()
    formData.append('name', values.name)
    formData.append('description', values.description)
    formData.append('links', values.links)
    
    values.tagIds.forEach(id => formData.append('tagIds', id))
    
    if (selectedFile) {
      formData.append('photo', selectedFile)
    }

    mutation.mutate(formData)
  }

  const mockProduct = {
    name: watchedValues.name || 'Your Product Name',
    description: watchedValues.description || 'Describe your innovation here...',
    photo: imagePreview || '',
    links: watchedValues.links,
    votes: 0,
    tags: watchedValues.tagIds.map(id => ({
      tag: tagsData?.find(t => t.id === id) || { name: 'Tag' }
    })),
    _count: { votedUsers: 0, reportedUsers: 0, reviews: 0 }
  } as any

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Dynamic Header */}
      <div className="relative pt-12 pb-12 overflow-hidden border-b border-border/50 bg-muted/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -mr-48 -mt-48" />
        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
          <div className="space-y-4 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/10"
            >
              <Rocket className="w-3.5 h-3.5" />
              Launch Terminal
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl sm:text-6xl font-black text-foreground tracking-tighter"
            >
              Post <span className="text-primary italic font-serif">Innovation</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg font-medium"
            >
              Introduce your creation to the community. Every great innovation starts with a single post.
            </motion.p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Form Area */}
          <div className="lg:col-span-7 space-y-10">
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-8 bg-primary rounded-full" />
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-foreground">Basic Intelligence</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Innovation Name</label>
                  <div className="relative group">
                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input 
                      {...register('name')}
                      placeholder="e.g. QuantumDesk AI"
                      className="rounded-2xl border-border bg-muted/30 focus:bg-background focus:ring-4 focus:ring-primary/10 h-14 pl-12 font-bold transition-all"
                    />
                  </div>
                  {errors.name && <p className="text-[10px] text-destructive font-bold ml-1 uppercase tracking-tight">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">The Narrative</label>
                  <div className="relative group">
                    <AlignLeft className="absolute left-4 top-5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Textarea 
                      {...register('description')}
                      placeholder="Explain the problem you're solving and how your innovation works..."
                      className="rounded-2xl border-border bg-muted/30 focus:bg-background focus:ring-4 focus:ring-primary/10 min-h-[160px] pl-12 pt-5 font-medium leading-relaxed transition-all"
                    />
                  </div>
                  {errors.description && <p className="text-[10px] text-destructive font-bold ml-1 uppercase tracking-tight">{errors.description.message}</p>}
                </div>
              </div>
            </section>

            <section className="space-y-8 pt-6">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-8 bg-primary rounded-full" />
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-foreground">Assets & Connectivity</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Visual Identity</label>
                  <div 
                    className={cn(
                      "relative h-40 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all group cursor-pointer overflow-hidden",
                      imagePreview ? "border-primary/40 bg-primary/5" : "border-border/60 bg-muted/20 hover:border-primary/40 hover:bg-muted/40"
                    )}
                  >
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all" alt="Preview" />
                        <div className="relative z-10 flex flex-col items-center gap-2">
                          <CheckCircle2 className="w-8 h-8 text-primary" />
                          <span className="text-[10px] font-black uppercase text-primary">Image Captured</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">Upload Hero Image</span>
                      </>
                    )}
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleFileChange} />
                  </div>
                  {errors.photo && <p className="text-[10px] text-destructive font-bold ml-1 uppercase tracking-tight">{errors.photo.message as string}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Primary Link (URL)</label>
                  <div className="relative group">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input 
                      {...register('links')}
                      placeholder="https://yourapp.com"
                      className="rounded-2xl border-border bg-muted/30 focus:bg-background focus:ring-4 focus:ring-primary/10 h-14 pl-12 font-bold transition-all"
                    />
                  </div>
                  {errors.links && <p className="text-[10px] text-destructive font-bold ml-1 uppercase tracking-tight">{errors.links.message}</p>}
                  <p className="text-[9px] text-muted-foreground/60 font-bold italic ml-1 flex items-center gap-1.5 pt-2">
                    <Info className="w-3 h-3 text-primary" />
                    Link to your landing page or store.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-8 pt-6">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-8 bg-primary rounded-full" />
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-foreground">Classification</h3>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Discovery Tags (Select 1-3)</label>
                
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {watchedValues.tagIds.map(tagId => {
                      const tag = tagsData?.find(t => t.id === tagId)
                      if (!tag) return null
                      return (
                        <motion.div
                          key={tagId}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                        >
                          <Badge 
                            variant="secondary" 
                            className="h-10 px-4 rounded-xl gap-2 font-black uppercase text-[10px] tracking-wider bg-primary/10 text-primary border border-primary/20"
                          >
                            <Hash className="w-3 h-3" />
                            {tag.name}
                            <button 
                              type="button"
                              onClick={() => {
                                setValue('tagIds', watchedValues.tagIds.filter(id => id !== tagId), { shouldValidate: true })
                              }}
                              className="hover:text-foreground"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </Badge>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>

                  <Controller 
                    name="tagIds"
                    control={control}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="h-10 px-4 rounded-xl border-dashed border-border/50 hover:border-primary/40 hover:bg-primary/5 text-[10px] font-black uppercase tracking-widest gap-2"
                          >
                            <Plus className="w-3.5 h-3.5 text-primary" />
                            Add Tag
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 rounded-2xl border-border" align="start">
                          {mounted && (
                            <Command className="rounded-2xl">
                              <CommandInput placeholder="Search tech/industries..." className="font-bold text-xs" />
                              <CommandEmpty className="py-4 text-xs font-bold text-muted-foreground text-center">No categories found.</CommandEmpty>
                              <CommandGroup className="max-h-60 overflow-auto">
                                {tagsData?.filter(t => !field.value?.includes(t.id)).map((tag) => (
                                  <CommandItem
                                    key={tag.id}
                                    value={tag.name}
                                    onSelect={() => {
                                      const currentTags = field.value || []
                                      field.onChange([...currentTags, tag.id])
                                    }}
                                    className="rounded-xl font-bold text-xs py-3 px-4 cursor-pointer"
                                  >
                                    {tag.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          )}
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                </div>
                {errors.tagIds && <p className="text-[10px] text-destructive font-bold ml-1 uppercase tracking-tight">{errors.tagIds.message}</p>}
              </div>
            </section>
          </div>

          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6 sticky top-24">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-8 bg-indigo-500 rounded-full" />
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-foreground">Card Preview</h3>
              </div>
              
              <div className="perspective-1000">
                <motion.div 
                  className="w-full max-w-sm mx-auto"
                  animate={{ rotateY: 0 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <ProductCard product={mockProduct} />
                </motion.div>
              </div>

              <div className="bg-muted/20 border border-border/50 rounded-[2.5rem] p-8 space-y-6">
                <div className="space-y-2">
                  <h4 className="text-lg font-black text-foreground tracking-tight">Deployment Protocol</h4>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                    By submitting this innovation, you agree to our community guidelines. Your post will undergo a validation check by our moderator team.
                  </p>
                </div>

                <Button 
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full h-16 rounded-[1.5rem] bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1 active:scale-95 group"
                >
                  {mutation.isPending ? (
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Transmitting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                      Initialize Product Launch
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  )
}

export default AddProduct
