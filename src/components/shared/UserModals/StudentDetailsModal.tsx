// "use client"

// import React from 'react'
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogDescription,
//     DialogClose
// } from '@/components/ui/dialog'
// import { Badge } from '@/components/ui/badge'
// import { Separator } from '@/components/ui/separator'
// import { IStudent } from '@/types/Dashboard/admin-dashboard-types/students-managements.types'
// import { formatDate } from 'date-fns'
// import {
//     User,
//     Mail,
//     Phone,
//     MapPin,
//     Calendar,
//     Droplets,
//     Fingerprint,
//     BookOpen,
//     Users,
//     ShieldCheck,
//     Briefcase,
//     Heart,
//     GraduationCap,
//     X,
//     Globe
// } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import Image from 'next/image'

// interface StudentDetailsModalProps {
//     student: IStudent | null
//     isOpen: boolean
//     onOpenChange: (open: boolean) => void
// }

// const StudentDetailsModal = ({ student, isOpen, onOpenChange }: StudentDetailsModalProps) => {
//     if (!student) return null

//     const InfoSection = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
//         <div className="space-y-6">
//             <div className="flex items-center gap-3 px-1">
//                 <div className="p-2 bg-primary/10 rounded-xl text-primary flex-shrink-0">
//                     <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
//                 </div>
//                 <h3 className="text-[11px] sm:text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">{title}</h3>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {children}
//             </div>
//         </div>
//     )

//     const InfoItem = ({ label, value, icon: Icon, fullWidth = false }: { label: string, value: string | null | undefined, icon?: any, fullWidth?: boolean }) => (
//         <div className={`p-4 rounded-3xl bg-muted/30 border border-muted/50 transition-all hover:bg-muted/50 ${fullWidth ? 'sm:col-span-2' : ''}`}>
//             <div className="flex items-start gap-3">
//                 {Icon && <Icon className="h-4 w-4 mt-0.5 text-primary/60 flex-shrink-0" />}
//                 <div className="flex flex-col min-w-0">
//                     <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{label}</span>
//                     <span className="text-sm font-semibold text-foreground/90 break-words">
//                         {value || 'Not Provided'}
//                     </span>
//                 </div>
//             </div>
//         </div>
//     )

//     return (
//         <Dialog open={isOpen} onOpenChange={onOpenChange}>
//             <DialogContent
//                 showCloseButton={false}
//                 className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-6xl p-0 border-none rounded-[2rem] sm:rounded-[3rem] shadow-2xl bg-background focus-visible:outline-none max-h-[90vh] overflow-y-auto overflow-x-hidden custom-scrollbar"
//             >
//                 {/* Accessibility: Hidden Header for Screen Readers */}
//                 <DialogHeader className="sr-only">
//                     <DialogTitle>Student Profile: {student.nameEn}</DialogTitle>
//                     <DialogDescription>
//                         Detailed academic and personal record for registration ID {student.registrationId}
//                     </DialogDescription>
//                 </DialogHeader>

//                 <div className="focus-visible:outline-none">

//                     {/* Hero Header Section */}
//                     <div className="relative">
//                         <div className="absolute inset-0 h-full bg-gradient-to-br from-primary via-primary/90 to-primary/80" />

//                         {/* Decorative Patterns */}
//                         <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
//                         <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

//                         <DialogClose asChild>
//                             <Button
//                                 variant="ghost"
//                                 className="absolute top-4 right-4 h-10 w-10 p-0 rounded-full bg-black/10 hover:bg-black/20 text-white z-50 backdrop-blur-md transition-all active:scale-90"
//                             >
//                                 <X className="h-5 w-5" />
//                                 <span className="sr-only">Close</span>
//                             </Button>
//                         </DialogClose>

//                         <div className="relative pt-12 pb-12 px-6 sm:px-12 lg:px-16 flex flex-col lg:flex-row items-center lg:items-end gap-8">
//                             {/* Profile Image */}
//                             <div className="relative flex-shrink-0 group">
//                                 <div className="absolute -inset-2 bg-white/20 rounded-[2.8rem] lg:rounded-[3.8rem] blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//                                 <div className="relative h-40 w-40 sm:h-48 sm:w-48 lg:h-52 lg:w-52 rounded-[2.5rem] lg:rounded-[3.5rem] overflow-hidden border-[6px] border-white/20 shadow-2xl bg-white/10 backdrop-blur-sm">
//                                     {student.profileImage ? (
//                                         <Image
//                                             src={student.profileImage}
//                                             alt={student.nameEn}
//                                             fill
//                                             className="object-cover transition-transform duration-700 group-hover:scale-110"
//                                         />
//                                     ) : (
//                                         <div className="h-full w-full flex items-center justify-center bg-muted/20">
//                                             <User className="h-20 w-20 text-white/30" />
//                                         </div>
//                                     )}
//                                 </div>
//                                 <div className="absolute -bottom-2 -right-2 p-3 bg-emerald-500 rounded-2xl border-4 border-background shadow-lg">
//                                     <ShieldCheck className="h-5 w-5 text-white" />
//                                 </div>
//                             </div>

//                             {/* Essential Identity */}
//                             <div className="flex-1 text-center lg:text-left space-y-4 min-w-0">
//                                 <div className="flex flex-wrap justify-center lg:justify-start gap-2">
//                                     <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors">
//                                         {student.user.role}
//                                     </Badge>
//                                     <Badge className="bg-emerald-500/90 text-white border-none px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
//                                         {student.user.status}
//                                     </Badge>
//                                 </div>

//                                 <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none uppercase break-words drop-shadow-md">
//                                     {student.nameEn}
//                                 </h1>

//                                 <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-white/80">
//                                     <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
//                                         <Mail className="h-4 w-4" />
//                                         <span className="truncate max-w-[180px] sm:max-w-xs">{student.user.email}</span>
//                                     </div>
//                                     <div className="hidden sm:block w-1 h-1 bg-white/40 rounded-full" />
//                                     <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
//                                         <GraduationCap className="h-4 w-4" />
//                                         <span>Batch {new Date(student.createdAt).getFullYear()}</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Main Content Body */}
//                     <div className="p-6 sm:p-8 lg:p-10 space-y-12 bg-background">

//                         {/* Top Stats Cards */}
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
//                             <div className="p-6 rounded-[2rem] bg-primary text-primary-foreground shadow-xl shadow-primary/20 flex flex-col justify-between overflow-hidden relative group cursor-default">
//                                 <Fingerprint className="absolute -right-4 -top-4 h-24 w-24 opacity-10 group-hover:scale-110 transition-transform duration-500" />
//                                 <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Reg ID</span>
//                                 <p className="text-xl font-mono font-bold mt-2 relative z-10">{student.registrationId}</p>
//                             </div>
//                             <div className="p-6 rounded-[2rem] bg-muted/40 border border-muted flex flex-col justify-between hover:bg-muted/60 transition-colors">
//                                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Class</span>
//                                 <p className="text-xl font-bold mt-2 text-foreground/80">{student.class?.name || 'N/A'}</p>
//                             </div>
//                             <div className="p-6 rounded-[2rem] bg-muted/40 border border-muted flex flex-col justify-between hover:bg-muted/60 transition-colors">
//                                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Roll No.</span>
//                                 <p className="text-4xl font-black mt-1 text-primary">#{student.classRoll}</p>
//                             </div>
//                         </div>

//                         <Separator className="opacity-50" />

//                         {/* Details Grid */}
//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

//                             {/* Left Column: Personal & Family */}
//                             <div className="space-y-12">
//                                 <InfoSection title="Student Profile" icon={User}>
//                                     <InfoItem label="Full Name (BN)" value={student.nameBn} />
//                                     <InfoItem label="Date of Birth" value={student.dob ? formatDate(new Date(student.dob), "PPP") : 'N/A'} icon={Calendar} />
//                                     <InfoItem label="Gender" value={student.gender} icon={Users} />
//                                     <InfoItem label="Blood Group" value={student.bloodGroup} icon={Droplets} />
//                                     <InfoItem label="Nationality" value={student.nationality || 'Bangladeshi'} icon={Globe} />
//                                 </InfoSection>

//                                 <InfoSection title="Guardians" icon={Heart}>
//                                     <InfoItem label="Father's Name" value={student.fatherName} icon={Briefcase} />
//                                     <InfoItem label="Mother's Name" value={student.motherName} icon={Heart} />
//                                 </InfoSection>
//                             </div>

//                             {/* Right Column: Contact & Academic */}
//                             <div className="space-y-12">
//                                 <InfoSection title="Contact Information" icon={Phone}>
//                                     <InfoItem label="Guardian Mobile" value={student.guardianMobile} icon={Phone} />
//                                     <InfoItem label="Personal Mobile" value={student.studentMobile || 'N/A'} icon={Phone} />
//                                     <InfoItem label="Present Address" value={student.presentAddress} icon={MapPin} fullWidth />
//                                     <InfoItem label="Permanent Address" value={student.permanentAddress} icon={MapPin} fullWidth />
//                                 </InfoSection>

//                                 <InfoSection title="Academic Registry" icon={GraduationCap}>
//                                     <InfoItem label="Application ID" value={student.applicationId} icon={Fingerprint} />

//                                 </InfoSection>
//                             </div>
//                         </div>

//                         {/* Verification Footer */}
//                         <div className="mt-8 p-6 sm:p-8 rounded-[2.5rem] bg-emerald-50/80 border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-emerald-50 transition-colors">
//                             <div className="flex items-center gap-5 text-center md:text-left">
//                                 <div className="p-4 bg-white rounded-2xl shadow-sm">
//                                     <ShieldCheck className="h-8 w-8 text-emerald-600" />
//                                 </div>
//                                 <div>
//                                     <p className="text-lg font-black text-emerald-900 tracking-tight uppercase">Verified Entry</p>
//                                     <p className="text-xs font-bold text-emerald-600/70 uppercase tracking-widest">
//                                         Joined: {formatDate(new Date(student.createdAt), "MMMM yyyy")}
//                                     </p>
//                                 </div>
//                             </div>
//                             <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-200 border-none transition-all active:scale-95">
//                                 Official Record
//                             </Badge>
//                         </div>
//                     </div>
//                 </div>
//             </DialogContent>
//         </Dialog>
//     )
// }

// export default StudentDetailsModal