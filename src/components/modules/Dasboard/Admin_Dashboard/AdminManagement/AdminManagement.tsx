"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Search,
  ShieldCheck,
  User as UserIcon,
  Loader2,
  MoreVertical,
  Lock,
  Unlock,
  Shield,
  ArrowUpDown,
  Mail,
  Calendar,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Trash2,
  Plus
} from "lucide-react";
import CreateAdminModal from "./CreateAdminModal";
import { toast } from "sonner";
import {
  getAllAdmins,
  updateUserStatus,
  updateUserRole,
  deleteUser
} from "@/services/admin-server-action";
import { IAdmin } from "@/types/Dashboard/admin-dashboard-types/admins-managements.types";

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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

const AdminManagement = () => {
  const [admins, setAdmins] = useState<IAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState<any>(null);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [adminToDelete, setAdminToDelete] = useState<IAdmin | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const res = await getAllAdmins(page, limit, searchTerm, sortBy, sortOrder, statusFilter, roleFilter);
      if (res.success) {
        setAdmins(res.data.data);
        setMeta(res.data.meta);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Failed to load admins");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAdmins();
    }, 500);
    return () => clearTimeout(timer);
  }, [page, limit, searchTerm, sortBy, sortOrder, statusFilter, roleFilter]);

  const handleStatusChange = async (userId: string, status: "ACTIVE" | "INACTIVE" | "SUSPENDED") => {
    try {
      const res = await updateUserStatus(userId, { status });
      if (res.success) {
        toast.success(`Admin status updated to ${status}`);
        fetchAdmins();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  const handleRoleChange = async (userId: string, role: "ADMIN" | "MODERATOR" | "USER") => {
    try {
      const res = await updateUserRole(userId, { role });
      if (res.success) {
        toast.success(`Admin role updated to ${role}`);
        fetchAdmins();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Role update failed");
    }
  };

  const handleDeleteAdmin = async () => {
    if (!adminToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteUser(adminToDelete.id, "ADMIN"); // Passing admin.id instead of user.id
      if (res.success) {
        toast.success("Admin deleted successfully");
        setAdminToDelete(null);
        fetchAdmins();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Deletion failed");
    } finally {
      setIsDeleting(false);
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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN": return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      case "ADMIN": return <ShieldCheck className="w-4 h-4 text-blue-500" />;
      default: return <Shield className="w-4 h-4 text-emerald-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE": return <Badge className="bg-emerald-500/10 text-emerald-600 border-none px-2 py-0 h-5 uppercase text-[9px] font-black tracking-widest">Active</Badge>;
      case "INACTIVE": return <Badge className="bg-zinc-500/10 text-zinc-500 border-none px-2 py-0 h-5 uppercase text-[9px] font-black tracking-widest">Inactive</Badge>;
      case "SUSPENDED": return <Badge className="bg-rose-500/10 text-rose-600 border-none px-2 py-0 h-5 uppercase text-[9px] font-black tracking-widest">Suspended</Badge>;
      default: return null;
    }
  };

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, meta?.total || 0);

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-zinc-950 p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-900 shadow-xl shadow-zinc-200/20 dark:shadow-none relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <ShieldAlert className="w-40 h-40 text-zinc-900 dark:text-white" />
        </div>
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 text-rose-600 w-fit rounded-lg text-[10px] font-black uppercase tracking-widest border border-rose-500/20">
            <ShieldCheck className="w-3 h-3" />
            Executive Control
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 italic">Admin <span className="text-zinc-400 font-serif">Registry</span></h1>
          <p className="text-zinc-500 text-sm font-medium">Managing high-level executive privileges and platform administrators.</p>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 h-12 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black text-[10px] uppercase tracking-widest px-6 hover:opacity-90 transition-all flex items-center gap-2 shadow-xl shadow-zinc-900/10 dark:shadow-none"
          >
            <Plus className="w-4 h-4" /> Create Admin
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto relative z-10">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              placeholder="Search admins..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="pl-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-rose-500/20 transition-all font-medium"
            />
          </div>

          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-32 h-12 rounded-2xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-black uppercase tracking-widest">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest">All Status</SelectItem>
              <SelectItem value="ACTIVE" className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Active</SelectItem>
              <SelectItem value="INACTIVE" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Inactive</SelectItem>
              <SelectItem value="SUSPENDED" className="text-[10px] font-black uppercase tracking-widest text-rose-600">Suspended</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-32 h-12 rounded-2xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-black uppercase tracking-widest">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest">All Roles</SelectItem>
              <SelectItem value="ADMIN" className="text-[10px] font-black uppercase tracking-widest">Admin</SelectItem>
              <SelectItem value="SUPER_ADMIN" className="text-[10px] font-black uppercase tracking-widest">Super Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-zinc-200/20 dark:shadow-none">
        <Table>
          <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50">
            <TableRow className="border-zinc-100 dark:border-zinc-900 hover:bg-transparent h-16">
              <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <button onClick={() => toggleSort("name")} className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  Identity <ArrowUpDown size={12} />
                </button>
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Classification</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center">Lifecycle</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <button onClick={() => toggleSort("createdAt")} className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  Joined <ArrowUpDown size={12} />
                </button>
              </TableHead>
              <TableHead className="px-8 text-right text-[10px] font-black uppercase tracking-widest text-zinc-400">Operations</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i} className="animate-pulse border-zinc-100 dark:border-zinc-900 h-24">
                  <TableCell className="px-8"><div className="h-10 w-48 bg-zinc-100 dark:bg-zinc-900 rounded-xl" /></TableCell>
                  <TableCell><div className="h-6 w-24 bg-zinc-100 dark:bg-zinc-900 rounded-lg" /></TableCell>
                  <TableCell><div className="h-6 w-16 bg-zinc-100 dark:bg-zinc-900 rounded-lg mx-auto" /></TableCell>
                  <TableCell><div className="h-6 w-32 bg-zinc-100 dark:bg-zinc-900 rounded-lg" /></TableCell>
                  <TableCell className="px-8"><div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-900 rounded-xl ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : admins.length > 0 ? (
              admins.map((admin) => (
                <TableRow key={admin.id} className="border-zinc-100 dark:border-zinc-900 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 group transition-all duration-300 h-24">
                  <TableCell className="px-8">
                    <div className="flex items-center gap-4">
                      {admin.profilePhoto ? (
                        <Image src={admin.profilePhoto} alt={admin.name} width={48} height={48} className="w-12 h-12 rounded-2xl object-cover border border-zinc-200 dark:border-zinc-800" />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center font-black text-zinc-400 group-hover:scale-105 transition-transform overflow-hidden uppercase">
                          {admin.name.substring(0, 2)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{admin.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5 opacity-60">
                          <Mail size={10} className="text-zinc-400" />
                          <p className="text-[10px] font-medium truncate tracking-tight">{admin.email}</p>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30">
                        {getRoleIcon(admin.user.role)}
                      </div>
                      <span className="text-xs font-black tracking-tighter uppercase">{admin.user.role}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(admin.user.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-zinc-500">
                      <Calendar size={12} />
                      <span className="text-[11px] font-bold uppercase tracking-tighter">
                        {new Date(admin.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-zinc-200 dark:border-zinc-800 shadow-2xl">
                        <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">Admin Operations</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <div className="px-3 py-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Modify Status</p>
                          <div className="grid grid-cols-1 gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={admin.user.status === "ACTIVE" || admin.user.role === "SUPER_ADMIN"}
                              onClick={() => handleStatusChange(admin.user.id, "ACTIVE")}
                              className="justify-start h-8 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg"
                            >
                              <Unlock className="w-3 h-3 mr-2" /> Activate User
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={admin.user.status === "INACTIVE" || admin.user.role === "SUPER_ADMIN"}
                              onClick={() => handleStatusChange(admin.user.id, "INACTIVE")}
                              className="justify-start h-8 text-xs font-bold text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                            >
                              <Lock className="w-3 h-3 mr-2" /> Set Inactive
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={admin.user.status === "SUSPENDED" || admin.user.role === "SUPER_ADMIN"}
                              onClick={() => handleStatusChange(admin.user.id, "SUSPENDED")}
                              className="justify-start h-8 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg"
                            >
                              <Lock className="w-3 h-3 mr-2" /> Suspend Access
                            </Button>
                          </div>
                        </div>

                        <DropdownMenuSeparator />

                        <div className="px-3 py-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Override Role</p>
                          <Select
                            defaultValue={admin.user.role}
                            onValueChange={(val: any) => handleRoleChange(admin.user.id, val)}
                            disabled={admin.user.role === "SUPER_ADMIN"}
                          >
                            <SelectTrigger className="h-8 rounded-lg text-[10px] font-black uppercase">
                              <SelectValue placeholder="Role Selection" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="USER" className="text-xs font-bold uppercase tracking-tighter">User</SelectItem>
                              <SelectItem value="MODERATOR" className="text-xs font-bold uppercase tracking-tighter">Moderator</SelectItem>
                              <SelectItem value="ADMIN" className="text-xs font-bold uppercase tracking-tighter">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          disabled={admin.user.role === "SUPER_ADMIN"}
                          onClick={() => setAdminToDelete(admin)}
                          className="px-3 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          <span className="text-xs font-bold uppercase tracking-tighter">Delete Admin</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-96 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4 opacity-50">
                    <AlertCircle className="w-16 h-16 text-zinc-400" />
                    <div>
                      <p className="font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest text-sm italic">Zero Admins Detected</p>
                      <p className="text-zinc-500 text-[10px] font-bold uppercase mt-1 tracking-tighter">No admin records matched your current filtering criteria.</p>
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
              <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => setPage(1)} className="rounded-xl h-9 w-9 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-500">
                <ChevronsLeft size={16} />
              </Button>
              <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="rounded-xl h-9 w-9 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-500">
                <ChevronLeft size={16} />
              </Button>
              <div className="px-4 text-xs font-bold text-zinc-600 dark:text-zinc-400 min-w-[100px] text-center">
                Page <span className="text-zinc-900 dark:text-zinc-100">{page}</span> of <span className="text-zinc-900 dark:text-zinc-100">{meta.total_page}</span>
              </div>
              <Button variant="outline" size="icon" disabled={page >= meta.total_page} onClick={() => setPage(p => p + 1)} className="rounded-xl h-9 w-9 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-500">
                <ChevronRight size={16} />
              </Button>
              <Button variant="outline" size="icon" disabled={page >= meta.total_page} onClick={() => setPage(meta.total_page)} className="rounded-xl h-9 w-9 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-500">
                <ChevronsRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={!!adminToDelete} onOpenChange={(open) => !open && setAdminToDelete(null)}>
        <AlertDialogContent className="rounded-[2rem] border-rose-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-rose-600 font-black tracking-tight text-2xl italic">
              <Trash2 className="w-6 h-6" /> Delete Admin?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-500 font-medium py-2">
              This will permanently remove <span className="font-bold text-zinc-900 dark:text-zinc-100">{adminToDelete?.name}</span> from the administrator list. This action cannot be reversed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-4">
            <AlertDialogCancel className="rounded-2xl border-zinc-200 dark:border-zinc-800 font-bold text-xs uppercase tracking-widest h-12">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAdmin}
              disabled={isDeleting}
              className="rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs uppercase tracking-widest h-12 px-8"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Deletion"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CreateAdminModal 
        isOpen={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen}
        onSuccess={fetchAdmins}
      />
    </div>
  );
};

export default AdminManagement;
