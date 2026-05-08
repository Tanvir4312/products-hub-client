"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

interface DataTableActions<TData> {
    onView?: (data: TData) => void;
    onEdit?: (data: TData) => void;
    onDelete?: (data: TData) => void;
    showView?: (data: TData) => boolean;
    showEdit?: (data: TData) => boolean;
    showDelete?: (data: TData) => boolean;
}

interface DataTableProps<TData> {
    data: TData[];
    columns: ColumnDef<TData>[];
    actions?: DataTableActions<TData>;
    toolbarAction?: React.ReactNode;
    emptyMessage?: string;
    isLoading?: boolean;
    sorting?: {
        state: SortingState,
        onSortingChange: (state: SortingState) => void
    };
    searching?: {
        searchTerm: string;
        onSearchChange: (value: string) => void;
    };
}

const DataTable = <TData,>({ data, columns, actions, toolbarAction, emptyMessage, isLoading, sorting, searching }: DataTableProps<TData>) => {
    const [localSearchTerm, setLocalSearchTerm] = useState(searching?.searchTerm || "");

    useEffect(() => {
        setLocalSearchTerm(searching?.searchTerm || "");
    }, [searching?.searchTerm]);

    useEffect(() => {
        if (!searching) return;
        const handler = setTimeout(() => {
            if (localSearchTerm !== searching.searchTerm) {
                searching.onSearchChange(localSearchTerm);
            }
        }, 500); // 500ms debounce
        return () => clearTimeout(handler);
    }, [localSearchTerm, searching]);

    const tableCoulmns: ColumnDef<TData>[] = actions ? [
        ...columns,

        // Action column
        {
            id: "actions",
            header: "Actions",
            enableSorting: false,
            cell: ({ row }) => {
                const rowData = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={"ghost"} className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align={"end"}>
                            {
                                actions.onView && (!actions.showView || actions.showView(rowData)) && (
                                    <DropdownMenuItem onClick={() => actions.onView?.(rowData)}>
                                        View
                                    </DropdownMenuItem>
                                )
                            }
                            {
                                actions.onEdit && (!actions.showEdit || actions.showEdit(rowData)) && (
                                    <DropdownMenuItem onClick={() => actions.onEdit?.(rowData)}>
                                        Edit
                                    </DropdownMenuItem>
                                )
                            }
                            {
                                actions.onDelete && (!actions.showDelete || actions.showDelete(rowData)) && (
                                    <DropdownMenuItem onClick={() => actions.onDelete?.(rowData)}>
                                        Delete
                                    </DropdownMenuItem>
                                )
                            }

                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ] : columns;

    const { getHeaderGroups, getRowModel } = useReactTable({
        data,
        columns: tableCoulmns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualSorting: !!sorting,
        state: {
            ...sorting ? { sorting: sorting.state } : {}
        },
        onSortingChange: sorting ?
            (updater) => {
                const currentSortingState = sorting.state;

                const nextSortingState = typeof updater === "function" ? updater(currentSortingState) : updater;

                sorting.onSortingChange(nextSortingState);
            }
            : undefined,
    });


    return (
        <div className="relative">
            {
                isLoading && (
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                            <span className="text-sm text-muted-foreground">Loading...</span>
                        </div>
                    </div>
                )
            }

            {/* Table Actions / Search Toolbar */}
            {(searching || toolbarAction) && (
                <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 pb-6", !searching && "justify-end")}>
                    {searching && (
                        <div className="relative w-full max-w-sm group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                                {isLoading ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                ) : (
                                    <Search className="h-4 w-4" />
                                )}
                            </div>
                            <Input
                                placeholder="Fine-grained search..."
                                value={localSearchTerm}
                                onChange={(e) => setLocalSearchTerm(e.target.value)}
                                className="pl-10 pr-10 h-11 bg-gray-50/50 border-gray-100 focus:bg-white transition-all rounded-2xl shadow-sm focus:shadow-md"
                            />
                            {localSearchTerm && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent text-muted-foreground hover:text-rose-500"
                                    onClick={() => {
                                        setLocalSearchTerm("");
                                        searching.onSearchChange("");
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    )}

                    {toolbarAction && (
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            {toolbarAction}
                        </div>
                    )}
                </div>
            )}


            {/* Table */}
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        {getHeaderGroups()?.map((hg) => (
                            <TableRow key={hg.id}>
                                {hg.headers?.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : header.column.getCanSort() ? (
                                            <Button
                                                variant={"ghost"}
                                                className="h-auto cursor-pointer p-0 font-semibold hover:bg-transparent hover:text-inherit focus-visible:ring-0"
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext(),
                                                )}

                                                {
                                                    header.column.getIsSorted() === "asc" ? (
                                                        <ArrowUp className="ml-1 h-4 w-4" />
                                                    ) : header.column.getIsSorted() === "desc" ? (
                                                        <ArrowDown className="ml-1 h-4 w-4" />
                                                    ) : <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
                                                }

                                            </Button>
                                        ) : (
                                            flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {
                            getRowModel().rows?.length ? (
                                getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            )
                                :
                                (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="text-center py-4">
                                            {emptyMessage || "No data available."}
                                        </TableCell>
                                    </TableRow>
                                )

                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default DataTable;