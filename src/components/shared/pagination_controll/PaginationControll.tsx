"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationControlsProps {
  meta: {
    limit: number;
    current_page: number;
    total_page: number;
    total: number;
  };
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export default function PaginationControls({ meta, onPageChange, onLimitChange }: PaginationControlsProps) {

  const {
    limit: pageSize,
    current_page: currentPage,
    total_page: totalPages,
    total
  } = meta;


  const searchParams = useSearchParams();

  const router = useRouter();

  const navigateToPage = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleLimitChange = (value: string) => {
    if (onLimitChange) {
      onLimitChange(Number(value));
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", value);
    params.set("page", "1"); // Reset to page 1 when limit changes
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);

  return (
    <div className="flex items-center justify-between px-2 py-4 border-t mt-4 flex-wrap gap-4">
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">Rows per page</p>
        <Select
          value={pageSize.toString()}
          onValueChange={handleLimitChange}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={pageSize.toString()} />
          </SelectTrigger>
          <SelectContent side="top">
            {[1, 5, 10, 20, 30, 40, 50].map((pageSizeOption) => (
              <SelectItem key={pageSizeOption} value={pageSizeOption.toString()}>
                {pageSizeOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="text-sm text-muted-foreground flex-1 flex justify-center sm:justify-start sm:flex-none">
        Showing {start} to {end} of {total} results
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigateToPage(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => navigateToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => navigateToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => navigateToPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
