import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  ChevronFirst,
  ChevronLast,
} from "lucide-react"

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  showPageSize?: boolean
  pageSize?: number
  onPageSizeChange?: (size: number) => void
  pageSizeOptions?: number[]
}

function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
  showPageSize = false,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20],
}: PaginationProps) {
  const pages = React.useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    if (page <= 3) {
      return [1, 2, 3, 4, 5, "...", totalPages]
    }
    if (page >= totalPages - 2) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    }
    return [1, "...", page - 1, page, page + 1, "...", totalPages]
  }, [page, totalPages])

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn("flex flex-wrap items-center gap-2", className)}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(1)}
        disabled={page === 1}
        aria-label="First page"
      >
        <ChevronFirst className="h-4 w-4" />
        <span className="sr-only">First</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous</span>
      </Button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="flex items-center px-2 text-muted-foreground">
            ...
          </span>
        ) : (
          <Button
            key={p}
            variant={page === p ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(p as number)}
            className="h-9 w-9"
            aria-label={`Page ${p}`}
            aria-current={page === p ? "page" : undefined}
          >
            {p}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(totalPages)}
        disabled={page === totalPages}
        aria-label="Last page"
      >
        <ChevronLast className="h-4 w-4" />
        <span className="sr-only">Last</span>
      </Button>

      {showPageSize && onPageSizeChange && (
        <div className="flex items-center gap-2 ml-4 text-sm text-muted-foreground">
          <span>Filas por página:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-8 px-2 border border-border/50 rounded-md bg-background focus-visible:ring-1 focus-visible:ring-foreground/20"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}
    </nav>
  )
}

export { Pagination }