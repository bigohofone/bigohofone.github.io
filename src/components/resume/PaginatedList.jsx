import { useEffect, useLayoutEffect, useRef, useState } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"

export function PaginatedList({ label, items, renderRow, getKey, cols = 1 }) {
  const containerRef = useRef(null)
  const rowRef = useRef(null)
  const [pageSize, setPageSize] = useState(4)
  const [page, setPage] = useState(1)

  useLayoutEffect(() => {
    function compute() {
      const container = containerRef.current
      const row = rowRef.current
      if (!container || !row) return
      const containerH = container.getBoundingClientRect().height
      const rowH = row.getBoundingClientRect().height
      if (!rowH) return
      const gap = cols > 1 ? 16 : 0
      const rows = Math.max(1, Math.floor((containerH + gap) / (rowH + gap)))
      setPageSize(Math.max(1, rows * cols))
    }
    compute()
    const ro = new ResizeObserver(compute)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [cols])

  useEffect(() => { setPage(1) }, [items])

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const start = (page - 1) * pageSize
  const visible = items.slice(start, start + pageSize)
  const goTo = (p) => setPage(Math.min(Math.max(1, p), totalPages))
  const onLink = (p) => (e) => { e.preventDefault(); goTo(p) }
  const keyOf = (it, i) => getKey ? getKey(it, i) : i

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      {label && (
        <p className="shrink-0 text-base font-medium text-muted-foreground">{label}</p>
      )}
      <div ref={containerRef} className="min-h-0 flex-1 overflow-hidden">
        {cols === 1 ? (
          <ul className="divide-y border-y">
            {visible.map((it, i) => (
              <li key={keyOf(it, start + i)} ref={i === 0 ? rowRef : null}>
                {renderRow(it, start + i)}
              </li>
            ))}
          </ul>
        ) : (
          <div className={cn("grid gap-4", `grid-cols-${cols}`)}>
            {visible.map((it, i) => (
              <div key={keyOf(it, start + i)} ref={i === 0 ? rowRef : null}>
                {renderRow(it, start + i)}
              </div>
            ))}
          </div>
        )}
      </div>
      <Pagination className={cn("shrink-0", totalPages <= 1 && "invisible")}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={onLink(page - 1)}
              className={cn("cursor-pointer", page <= 1 && "pointer-events-none opacity-50")}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                onClick={onLink(i + 1)}
                isActive={page === i + 1}
                className="cursor-pointer"
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={onLink(page + 1)}
              className={cn("cursor-pointer", page >= totalPages && "pointer-events-none opacity-50")}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
