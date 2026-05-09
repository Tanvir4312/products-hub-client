import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"

import { User, Mail, Phone, Calendar, Shield, BadgeCheck } from "lucide-react"
import { IAdminsData } from '@/types/Dashboard/admin-dashboard-types/admins-management.type'

interface AdminDetailsModalProps {
    admin: IAdminsData | null
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

const AdminDetailsModal = ({ admin, isOpen, onOpenChange }: AdminDetailsModalProps) => {
    if (!admin) return null

    const formatDate = (dateValue: string | Date | undefined) => {
        if (!dateValue) return "N/A"
        return new Date(dateValue).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto border-t-4 border-t-primary p-4 md:p-6 custom-scrollbar">
                <DialogHeader>
                    <div className="flex items-center gap-4 mb-4">
                        {admin.profilePhoto ? (
                            <img
                                src={admin.profilePhoto}
                                alt={admin.name}
                                className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary">
                                <User className="h-8 w-8 text-primary" />
                            </div>
                        )}
                        <div>
                            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                {admin.name}
                                {admin.user?.status === "ACTIVE" ? (
                                    <BadgeCheck className="h-5 w-5 text-green-500" />
                                ) : (
                                    <BadgeCheck className="h-5 w-5 text-red-500" />
                                )}
                            </DialogTitle>
                            <DialogDescription className="mt-1">
                                Admin Profile Details
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid gap-6 mt-6">
                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                        <h3 className="font-semibold text-lg text-gray-800 border-b pb-2 mb-4">Contact Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Mail className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Email</p>
                                    <p className="font-medium text-sm truncate">{admin.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Phone className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Contact Number</p>
                                    <p className="font-medium text-sm">{admin.contactNumber || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                        <h3 className="font-semibold text-lg text-gray-800 border-b pb-2 mb-4">System Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Shield className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Role</p>
                                    <p className="font-medium text-sm">
                                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-md capitalize font-semibold">
                                            {admin.user?.role?.replace('_', ' ')?.toLowerCase()}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Calendar className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Joined Date</p>
                                    <p className="font-medium text-sm">{formatDate(admin.createdAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AdminDetailsModal
