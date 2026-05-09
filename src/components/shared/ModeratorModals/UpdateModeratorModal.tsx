"use client"

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,

} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { IModeratorData } from '@/types/Dashboard/admin-dashboard-types/moderators-management.types'
import {
    X,
    Briefcase,
    User,
    Camera,
    Save,
    Phone,
    Mail,
    Fingerprint,
    Info
} from 'lucide-react'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateModerator } from '@/services/admin-srever-action/moderator.service'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { IUpdateModeratorFormValues, updateModeratorSchema } from '@/zod/moderatorZodValidation'

interface UpdateModeratorModalProps {
    moderator: IModeratorData | null
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

const UpdateModeratorModal = ({ moderator, isOpen, onOpenChange }: UpdateModeratorModalProps) => {
    const queryClient = useQueryClient()
    const router = useRouter()
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const form = useForm<IUpdateModeratorFormValues>({
        resolver: zodResolver(updateModeratorSchema),
        defaultValues: {
            name: '', 
            email: '', 
            contactNumber: '', 
            gender: 'MALE',
        }
    })

    useEffect(() => {
        if (moderator) {
            form.reset({
                name: moderator?.name || '',
                email: moderator?.email || '',
                contactNumber: moderator?.contactNumber || '',
                gender: moderator?.gender || 'MALE',
            })
            setPreviewImage(moderator.profilePhoto || null)
        }
    }, [moderator, form])

    const mutation = useMutation({
        mutationFn: (values: IUpdateModeratorFormValues) => {
            return updateModerator(moderator!.id, {
                ...values,
                profilePhoto: selectedFile || undefined
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['moderators'] })
            router.refresh()
            toast.success("Moderator profile updated successfully", {
                description: "The registry has been synchronized with your changes.",
                className: "bg-[#FF5E3A] text-white border-none shadow-2xl",
            })
            onOpenChange(false)
        },
        onError: (error: any) => {
            toast.error("Failed to update moderator", {
                description: error.message || "An unexpected error occurred during high-priority update.",
            })
        }
    })

    const onSubmit = (values: IUpdateModeratorFormValues) => {
        mutation.mutate(values)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            const reader = new FileReader()
            reader.onloadend = () => setPreviewImage(reader.result as string)
            reader.readAsDataURL(file)
        }
    }

    if (!moderator) return null

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>

            <DialogContent
                showCloseButton={false}
                className="lg:max-w-3xl w-[95vw] sm:w-[90vw] p-0 overflow-y-auto max-h-[95vh] sm:max-h-[90vh] custom-scrollbar border-none shadow-3xl rounded-[2rem] sm:rounded-[3rem] bg-card transition-all duration-500 focus-visible:ring-0"
            >
                <DialogHeader className="sr-only">
                    <DialogTitle>Update Moderator Registry</DialogTitle>
                    <DialogDescription>Edit profile for {moderator.name}</DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="relative w-full">

                    {/* Premium Header */}
                    <div className="relative min-h-[14rem] sm:h-64 bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-800 flex items-center px-4 sm:px-12 py-8 sm:py-0 group overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] opacity-10" />
                        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-110" />

                        <div className="relative flex flex-col sm:flex-row items-center gap-6 sm:gap-10 w-full z-10 transition-all duration-500 group-hover:translate-x-1">
                            <div className="relative h-28 w-28 sm:h-44 sm:w-44 rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden border-4 border-card shadow-2xl bg-white/10 backdrop-blur-md group/avatar transition-transform duration-500 hover:rotate-2 shrink-0">
                                {previewImage ? (
                                    <Image src={previewImage} alt="Preview" fill className="object-cover transition-transform duration-700 group-hover/avatar:scale-110"
                                        sizes="(max-width: 768px) 112px, 176px" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-white/5 text-white/40">
                                        <User className="h-12 sm:h-20" />
                                    </div>
                                )}
                                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center cursor-pointer transition-all duration-500 backdrop-blur-sm">
                                    <div className="bg-white/20 p-3 rounded-xl border border-white/30 transform translate-y-4 group-hover/avatar:translate-y-0 transition-transform duration-500">
                                        <Camera className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                            </div>

                            <div className="flex-1 text-center sm:text-left text-white min-w-0">
                                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2 opacity-80">
                                    <span className="w-6 h-0.5 bg-white rounded-full" />
                                    <p className="text-[10px] sm:text-[11px] font-black tracking-[0.4em] uppercase">Moderator Node</p>
                                </div>
                                <h2 className="text-xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase leading-tight truncate drop-shadow-xl">
                                    {form.watch('name') || moderator.name}
                                </h2>
                                <div className="mt-3 flex items-center gap-3 px-3 py-1 bg-black/20 rounded-lg w-fit mx-auto sm:mx-0 backdrop-blur-md border border-white/10">
                                    <Fingerprint className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-400" />
                                    <p className="text-[9px] sm:text-[10px] font-bold tracking-widest opacity-90 truncate">
                                        ID: {moderator.id}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <DialogClose asChild>
                            <Button type="button" variant="ghost" className="absolute top-2 right-2 sm:top-8 sm:right-8 h-8 w-8 sm:h-12 sm:w-12 p-0 rounded-xl bg-black/20 hover:bg-black/40 text-white z-50 backdrop-blur-md transition-all duration-300 border border-white/10">
                                <X className="h-4 w-4 sm:h-6 sm:w-6" />
                            </Button>
                        </DialogClose>
                    </div>

                    {/* Form Body */}
                    <div className="px-4 sm:px-12 py-8 sm:py-12 space-y-10 bg-card">
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-1.5 h-8 bg-indigo-600 rounded-full" />
                                <h3 className="text-sm sm:text-base font-black uppercase tracking-[0.3em] text-foreground">Identity Dossier</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                <Field className="space-y-2">
                                    <FieldLabel className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Full Legal Name</FieldLabel>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-indigo-600 transition-colors" />
                                        <Input {...form.register('name')} className="rounded-2xl border-border bg-muted/30 focus:bg-background focus:ring-4 focus:ring-indigo-600/10 h-12 sm:h-14 pl-12 font-bold transition-all text-foreground text-sm" />
                                    </div>
                                    <FieldError errors={[{ message: form.formState.errors.name?.message }]} />
                                </Field>
                                <Field className="space-y-2">
                                    <FieldLabel className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Professional Email</FieldLabel>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-indigo-600 transition-colors" />
                                        <Input {...form.register('email')} className="rounded-2xl border-border bg-muted/30 focus:bg-background focus:ring-4 focus:ring-indigo-600/10 h-12 sm:h-14 pl-12 font-bold transition-all text-foreground text-sm" />
                                    </div>
                                    <FieldError errors={[{ message: form.formState.errors.email?.message }]} />
                                    <p className="text-[10px] text-muted-foreground/60 font-bold italic ml-1 flex items-center gap-2">
                                        <Info className="w-3 h-3 text-indigo-600" />
                                        Avoid changing your email unless absolutely necessary.
                                    </p>
                                </Field>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-1.5 h-8 bg-indigo-600 rounded-full" />
                                <h3 className="text-sm sm:text-base font-black uppercase tracking-[0.3em] text-foreground">Terminal Details</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                <Field className="space-y-2">
                                    <FieldLabel className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Contact Phone</FieldLabel>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-indigo-600 transition-colors" />
                                        <Input {...form.register('contactNumber')} className="rounded-2xl border-border bg-muted/30 focus:bg-background focus:ring-4 focus:ring-indigo-600/10 h-12 sm:h-14 pl-12 font-bold transition-all text-foreground text-sm" />
                                    </div>
                                    <FieldError errors={[{ message: form.formState.errors.contactNumber?.message }]} />
                                </Field>
                                <Field className="space-y-2">
                                    <FieldLabel className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Biological Gender</FieldLabel>
                                    <select 
                                        {...form.register('gender')} 
                                        className="w-full rounded-2xl border-border bg-muted/30 focus:bg-background focus:ring-4 focus:ring-indigo-600/10 h-12 sm:h-14 px-5 font-bold transition-all text-foreground text-sm appearance-none outline-none"
                                    >
                                        <option value="MALE">MALE</option>
                                        <option value="FEMALE">FEMALE</option>
                                        <option value="OTHER">OTHER</option>
                                    </select>
                                    <FieldError errors={[{ message: form.formState.errors.gender?.message }]} />
                                </Field>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8 bg-indigo-600/5 rounded-[1.5rem] sm:rounded-[2rem] border border-indigo-600/10 flex gap-4">
                            <Info className="w-6 h-6 text-indigo-600 shrink-0" />
                            <p className="text-[11px] sm:text-xs font-bold text-muted-foreground leading-relaxed italic">
                                "Moderator privileges are high-security. Ensure all biometric and terminal data is synchronized accurately for system integrity."
                            </p>
                        </div>
                    </div>

                    {/* Action Footer */}
                    <div className="px-4 sm:px-12 py-6 sm:py-8 bg-muted/50 border-t border-border rounded-b-[2rem] sm:rounded-b-[3rem]">
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full sm:flex-1 h-12 sm:h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] sm:text-[12px] border-border hover:bg-muted transition-all active:scale-95"
                                onClick={() => onOpenChange(false)}
                            >
                                Abort Synch
                            </Button>
                            <Button
                                type="submit"
                                disabled={mutation.isPending}
                                className="w-full sm:flex-[2] h-12 sm:h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[11px] sm:text-[12px] shadow-xl shadow-indigo-600/30 transition-all hover:-translate-y-1 active:scale-95 group"
                            >
                                {mutation.isPending ? (
                                    <div className="flex items-center gap-2 justify-center">
                                        <div className="h-4 w-4 sm:h-5 sm:w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Synchronizing...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 justify-center">
                                        <Save className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:rotate-12" />
                                        <span>Commit Changes</span>
                                    </div>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(79, 70, 229, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(79, 70, 229, 0.2);
                }
            `}</style>
        </Dialog>
    )
}

export default UpdateModeratorModal