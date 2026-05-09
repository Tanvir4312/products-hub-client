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
// import { ITeacher } from '@/types/Dashboard/admin-dashboard-types/teachers-managements.types'
// import { formatDate } from 'date-fns'
// import {
//     User,
//     Mail,
//     Phone,
//     MapPin,
//     Calendar,
//     Fingerprint,
//     BookOpen,
//     ShieldCheck,
//     Briefcase,
//     GraduationCap,
//     X,
//     Award,
//     Hash
// } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import Image from 'next/image'

// interface TeacherDetailsModalProps {
//     teacher: ITeacher | null
//     isOpen: boolean
//     onOpenChange: (open: boolean) => void
// }

// const TeacherDetailsModal = ({ teacher, isOpen, onOpenChange }: TeacherDetailsModalProps) => {

//     if (!teacher) return null
//     return (
//         <Dialog open={isOpen} onOpenChange={onOpenChange}>
//             <DialogContent
//                 showCloseButton={false}
//                 className="max-w-[95vw] md:max-w-5xl p-0 border-none shadow-3xl rounded-[2rem] md:rounded-[3rem] bg-background overflow-y-auto max-h-[95vh] custom-scrollbar focus-visible:ring-0"
//             >
//                 {/* --- Accessibility Fix: Screen Reader Header --- */}
//                 <DialogHeader className="sr-only">
//                     <DialogTitle>Teacher Profile: {teacher.name}</DialogTitle>
//                     <DialogDescription>
//                         Detailed professional dossier and contact information for {teacher.name}.
//                     </DialogDescription>
//                 </DialogHeader>

//                 {/* 1. Dynamic Hero Header */}
//                 <div className="relative overflow-hidden group">
//                     <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-800 -z-10" />
//                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] opacity-[0.05] -z-10" />
//                     <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

//                     <DialogClose asChild>
//                         <Button variant="ghost" className="absolute top-5 right-5 h-10 w-10 rounded-full bg-black/10 hover:bg-black/20 text-white z-50 backdrop-blur-md">
//                             <X className="h-5 w-5" />
//                         </Button>
//                     </DialogClose>

//                     <div className="pt-12 pb-12 px-6 md:px-16 flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-12 text-white">
//                         <div className="relative shrink-0">
//                             <div className="absolute -inset-2 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-[2.5rem] blur opacity-40 group-hover:opacity-70 transition duration-500" />
//                             <div className="h-40 w-40 md:h-52 md:w-52 rounded-[2.2rem] overflow-hidden border-4 border-white shadow-2xl relative bg-indigo-50">
//                                 {teacher.profilePhoto ? (
//                                     <Image src={teacher.profilePhoto} alt={teacher.name} fill className="object-cover" priority />
//                                 ) : (
//                                     <div className="h-full w-full flex items-center justify-center bg-muted">
//                                         <User className="h-24 w-24 text-muted-foreground/30" />
//                                     </div>
//                                 )}
//                             </div>
//                             <div className="absolute -bottom-2 -right-2 p-3 bg-emerald-500 rounded-2xl border-4 border-white shadow-lg shadow-emerald-500/30">
//                                 <ShieldCheck className="h-6 w-6 text-white" />
//                             </div>
//                         </div>

//                         <div className="flex-1 text-center md:text-left space-y-4">
//                             <div className="flex flex-wrap justify-center md:justify-start gap-3 uppercase font-black tracking-widest text-[10px]">
//                                 <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md px-4 py-1.5 rounded-full">
//                                     {teacher.designation}
//                                 </Badge>
//                                 <Badge className="bg-emerald-500 text-white border-none px-4 py-1.5 rounded-full shadow-lg shadow-emerald-500/20">
//                                     {teacher.user.status}
//                                 </Badge>
//                             </div>
//                             <h2 className="text-3xl md:text-6xl font-black tracking-tighter leading-none drop-shadow-md">
//                                 {teacher.name}
//                             </h2>
//                             <div className="flex flex-col md:flex-row items-center gap-4 text-white/80 font-medium">
//                                 <div className="flex items-center gap-2 text-sm">
//                                     <Mail className="h-4 w-4" />
//                                     {teacher.email}
//                                 </div>
//                                 <div className="hidden md:block w-1.5 h-1.5 bg-white/30 rounded-full" />
//                                 <div className="flex items-center gap-2 text-sm">
//                                     <GraduationCap className="h-4 w-4" />
//                                     {teacher.qualification}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* 2. Professional Stats Panel */}
//                 <div className="px-6 md:px-16 -mt-8 relative z-20">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <StatCard icon={Hash} label="Teacher ID" value="" theme="dark" />
//                         <StatCard icon={BookOpen} label="Core Subject" value={teacher.teacherSubjects?.find(s => s.isPrimary)?.subject?.name || 'N/A'} theme="indigo" />
//                     </div>
//                 </div>

//                 {/* 3. Detailed Information Grid */}
//                 <div className="px-6 md:px-16 py-12 space-y-16">
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
//                         <div className="space-y-12">
//                             <InfoSection title="Academic Expertise" icon={Award}>
//                                 <div className="col-span-full space-y-4">
//                                     <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Certified Disciplines</p>
//                                     <div className="flex flex-wrap gap-2.5">
//                                         {teacher.teacherSubjects.map((s, idx) => (
//                                             <div key={idx} className={`px-5 py-3 rounded-2xl border text-sm font-bold flex items-center gap-2 transition-all hover:translate-y-[-2px] ${s.isPrimary ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20' : 'bg-muted/30 text-muted-foreground'}`}>
//                                                 {s.isPrimary && <ShieldCheck className="h-4 w-4" />}
//                                                 {s.subject?.name}
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                                 <DetailItem label="Full Legal Name" value={teacher.name} icon={User} />
//                                 <DetailItem label="Gender Identity" value={teacher.gender} icon={Fingerprint} />
//                             </InfoSection>

//                             <InfoSection title="Service History" icon={Calendar}>
//                                 <DetailItem label="Date of Appointment" value={teacher.createdat ? formatDate(new Date(teacher.createdat), "MMMM dd, yyyy") : 'N/A'} icon={Calendar} full />
//                                 <DetailItem label="Professional Designation" value={teacher.designation} icon={Briefcase} full />
//                             </InfoSection>
//                         </div>

//                         <div className="space-y-12">
//                             <InfoSection title="Communication" icon={Phone}>
//                                 <DetailItem label="Official Email" value={teacher.email} icon={Mail} full />
//                                 <DetailItem label="Contact Number" value={teacher.contactNumber} icon={Phone} full />
//                                 <DetailItem label="Mailing Address" value={teacher.address} icon={MapPin} full />
//                             </InfoSection>

//                             <InfoSection title="Verification Status" icon={ShieldCheck}>
//                                 <div className="col-span-full p-8 rounded-[2.5rem] bg-indigo-50/50 border-2 border-dashed border-indigo-200 flex flex-col items-center text-center gap-4">
//                                     <div className="p-4 bg-white rounded-2xl shadow-sm">
//                                         <ShieldCheck className="h-8 w-8 text-indigo-600" />
//                                     </div>
//                                     <div className="space-y-1">
//                                         <p className="text-sm font-black text-indigo-950 uppercase tracking-widest">Profile Authenticated</p>
//                                         <p className="text-xs text-indigo-600/60 font-medium">This profile is managed by the institutional registry.</p>
//                                     </div>
//                                     <Badge className="bg-indigo-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">Active Faculty</Badge>
//                                 </div>
//                             </InfoSection>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="h-12" />
//             </DialogContent>
//         </Dialog>
//     )
// }

// const StatCard = ({ icon: Icon, label, value, theme }: any) => {
//     const themes: any = {
//         dark: "bg-zinc-900 text-white shadow-xl shadow-zinc-900/20",
//         indigo: "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20"
//     }
//     return (
//         <div className={`p-7 md:p-9 rounded-[2.5rem] relative overflow-hidden group transition-all hover:scale-[1.02] ${themes[theme]}`}>
//             <Icon className="absolute -right-4 -top-4 h-24 w-24 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
//             <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-white/60">{label}</p>
//             <p className="text-xl md:text-2xl font-black truncate">{value || '---'}</p>
//         </div>
//     )
// }

// const InfoSection = ({ title, icon: Icon, children }: any) => (
//     <div className="space-y-8">
//         <div className="flex items-center gap-4">
//             <div className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
//                 <Icon className="h-5 w-5 md:h-6 md:w-6" />
//             </div>
//             <h3 className="text-sm md:text-base font-black uppercase tracking-[0.3em] text-indigo-950/80">{title}</h3>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
//             {children}
//         </div>
//     </div>
// )

// const DetailItem = ({ label, value, icon: Icon, full }: any) => (
//     <div className={`p-5 md:p-6 rounded-[1.8rem] bg-muted/30 border border-muted/50 transition-all hover:bg-white hover:shadow-md group ${full ? 'md:col-span-2' : ''}`}>
//         <div className="flex items-start gap-4">
//             <div className="p-3 bg-background rounded-xl border group-hover:text-indigo-600 transition-colors">
//                 <Icon className="h-4 w-4" />
//             </div>
//             <div className="space-y-1 overflow-hidden">
//                 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">{label}</p>
//                 <p className="text-sm font-bold text-foreground/90 break-words">{value || 'N/A'}</p>
//             </div>
//         </div>
//     </div>
// )

// export default TeacherDetailsModal