"use client"

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldLabel, FieldError, FieldGroup } from '@/components/ui/field'

import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { User, Camera, Save, X, Phone, MapPin, Fingerprint, Languages, Mail, Info } from 'lucide-react'
import Image from 'next/image'

import { useRouter } from 'next/navigation'
import { UpdateFormValues, updateUserSchema } from '@/zod/userZodValidation'
import { updateUser } from '@/services/admin-srever-action/user.service'


type IUser = {
    id: string
    name: string
    email: string
    profilePhoto: string
    contactNumber?: string
}

interface UpdateUserModalProps {
    user: IUser | null
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

const UpdateUserModal = ({ user, isOpen, onOpenChange }: UpdateUserModalProps) => {

    const queryClient = useQueryClient()
    const router = useRouter()
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const form = useForm<UpdateFormValues>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            contactNumber: (user as any)?.contactNumber || '',
            profilePhoto: undefined,
        }
    })

    useEffect(() => {
        if (user) {
            form.reset({
                name: user.name || '',
                email: user.email || '',
                contactNumber: (user as any)?.contactNumber || '',
                profilePhoto: undefined,
            })
            setImagePreview(null)
        }
    }, [user, form])

    const mutation = useMutation({
        mutationFn: async (data: UpdateFormValues) => {
            if (!user) throw new Error("No user selected")
            return updateUser(user.id, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            router.refresh()
            toast.success("User profile updated successfully", {
                description: "The registry has been synchronized with your changes.",
                className: "bg-[#FF5E3A] text-white border-none shadow-2xl",
            })
            onOpenChange(false)
        },
        onError: (error: any) => {
            toast.error("Failed to update user", {
                description: error.message || "An unexpected error occurred during high-priority update.",
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

    const onSubmit = (values: UpdateFormValues) => {
        // Pass plain object - service will create FormData internally
        const payload = {
            name: values.name,
            email: values.email,
            contactNumber: values.contactNumber,
            profilePhoto: selectedFile || undefined,
        }
        mutation.mutate(payload)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent showCloseButton={false} className="lg:max-w-3xl w-[95vw] sm:w-[90vw] p-0 overflow-y-auto max-h-[95vh] sm:max-h-[90vh] custom-scrollbar border-none shadow-3xl rounded-[2rem] sm:rounded-[3rem] bg-card transition-all duration-500">
                <DialogHeader className="sr-only">
                    <DialogTitle>Update User Registry</DialogTitle>
                    <DialogDescription>Apply modifications to the high-security user dossier.</DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                    {/* Premium Header */}
                    <div className="relative min-h-[14rem] sm:h-64 bg-gradient-to-br from-primary via-primary/95 to-primary/80 flex items-center px-4 sm:px-12 py-8 sm:py-0 group overflow-hidden">
                        {/* Background Patterns */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
                        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-110" />
                        
                        <div className="relative flex flex-col sm:flex-row items-center gap-6 sm:gap-10 w-full z-10 transition-all duration-500 group-hover:translate-x-1">
                            <div className="relative h-28 w-28 sm:h-44 sm:w-44 rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden border-4 border-card shadow-2xl bg-muted group/avatar transition-transform duration-500 hover:rotate-2 shrink-0">
                                {imagePreview ? (
                                    <Image src={imagePreview} alt="Preview" fill className="object-cover transition-transform duration-700 group-hover/avatar:scale-110"
                                        sizes="(max-width: 768px) 112px, 176px" />
                                ) : user?.profilePhoto ? (
                                    <Image src={user.profilePhoto} alt={user.name} fill className="object-cover transition-transform duration-700 group-hover/avatar:scale-110"
                                        sizes="(max-width: 768px) 112px, 176px" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-muted">
                                        <User className="h-12 sm:h-20 text-muted-foreground/40" />
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
                                    <p className="text-[10px] sm:text-[11px] font-black tracking-[0.4em] uppercase">User Dossier</p>
                                </div>
                                <h2 className="text-xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase leading-tight truncate drop-shadow-lg">
                                    {user?.name || "Update Profile"}
                                </h2>
                                <div className="mt-3 flex items-center gap-3 px-3 py-1 bg-black/20 rounded-lg w-fit mx-auto sm:mx-0 backdrop-blur-md border border-white/10">
                                    <Fingerprint className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                                    <p className="text-[9px] sm:text-[10px] font-bold tracking-widest opacity-90 truncate">
                                        ID: {user?.id || "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                className="absolute top-2 right-2 sm:top-8 sm:right-8 h-8 w-8 sm:h-12 sm:w-12 p-0 rounded-xl bg-black/20 hover:bg-black/40 text-white z-50 backdrop-blur-md transition-all duration-300 border border-white/10"
                            >
                                <X className="h-4 w-4 sm:h-6 sm:w-6" />
                                <span className="sr-only">Close</span>
                            </Button>
                        </DialogClose>
                    </div>

                    {/* Form Body */}
                    <div className="px-4 sm:px-12 py-8 sm:py-12 space-y-10">
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-1.5 h-8 bg-primary rounded-full" />
                                <h3 className="text-sm sm:text-base font-black uppercase tracking-[0.3em] text-foreground">Identity Profile</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                <Field className="space-y-2">
                                    <FieldLabel className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Display Name</FieldLabel>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <Input
                                            {...form.register('name')}
                                            placeholder="Enter your name"
                                            className="rounded-2xl border-border bg-muted/30 focus:bg-background focus:ring-4 focus:ring-primary/10 h-12 sm:h-14 pl-12 font-bold transition-all text-foreground text-sm"
                                        />
                                    </div>
                                    <FieldError errors={[{ message: form.formState.errors.name?.message }]} />
                                </Field>

                                <Field className="space-y-2">
                                    <FieldLabel className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email Address</FieldLabel>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <Input
                                            {...form.register('email')}
                                            placeholder="Enter your email"
                                            className="rounded-2xl border-border bg-muted/30 focus:bg-background focus:ring-4 focus:ring-primary/10 h-12 sm:h-14 pl-12 font-bold transition-all text-foreground text-sm"
                                        />
                                    </div>
                                    <FieldError errors={[{ message: form.formState.errors.email?.message }]} />
                                    <p className="text-[10px] text-muted-foreground/60 font-bold italic ml-1 flex items-center gap-2">
                                        <Info className="w-3 h-3 text-primary" />
                                        Avoid changing your email unless absolutely necessary.
                                    </p>
                                </Field>
 
                                <Field className="space-y-2">
                                    <FieldLabel className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Contact Number</FieldLabel>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <Input
                                            {...form.register('contactNumber')}
                                            placeholder="Enter your contact number"
                                            className="rounded-2xl border-border bg-muted/30 focus:bg-background focus:ring-4 focus:ring-primary/10 h-12 sm:h-14 pl-12 font-bold transition-all text-foreground text-sm"
                                        />
                                    </div>
                                    <FieldError errors={[{ message: form.formState.errors.contactNumber?.message }]} />
                                </Field>
                            </div>
                        </div>

                        {/* Additional Info Section Placeholder */}
                        <div className="p-6 sm:p-8 bg-primary/5 rounded-[1.5rem] sm:rounded-[2rem] border border-primary/10">
                            <p className="text-[11px] sm:text-xs font-bold text-muted-foreground leading-relaxed italic text-center">
                                "Updating your profile helps us provide a more personalized experience. <br className="hidden sm:block" /> Please ensure all information is accurate."
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
                                Cancel Update
                            </Button>
                            <Button
                                type="submit"
                                className="w-full sm:flex-[2] h-12 sm:h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[11px] sm:text-[12px] shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1 active:scale-95 group"
                                disabled={mutation.isPending}
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
        </Dialog>
    )
}

export default UpdateUserModal;