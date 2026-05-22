import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Section } from "./Section"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { awards } from "@/data/awards"
import { cn } from "@/lib/utils"
import { DateText } from "./DateText"

const FALLBACK_PAGE_SIZE = 7

const itemTransition = {
  duration: 0.45,
  ease: [0.16, 1, 0.3, 1],
}

function AwardRow({ aw }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group flex w-full cursor-pointer appearance-none items-center h-16 gap-4 border-0 bg-transparent px-1 text-left outline-none transition-colors hover:bg-accent/30 focus-visible:bg-accent/30"
        >
          <h3 className="flex-1 min-w-0 truncate text-base font-medium md:flex-[4]">{aw.title}</h3>
          <p className="hidden text-right text-sm text-muted-foreground md:block md:flex-[4] md:min-w-0 md:truncate">
            {aw.organization}
          </p>
          <span className="w-40 shrink-0 text-right font-mono text-sm leading-tight tabular-nums text-muted-foreground md:w-auto md:shrink md:flex-[2]">
            <DateText value={aw.date} />
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="aspect-video sm:max-w-2xl">
        <DialogHeader className="gap-4">
          <Badge variant="outline" className="w-fit rounded-md">
            {aw.type}
          </Badge>
          <div className="space-y-1">
            <DialogTitle className="text-xl">{aw.title}</DialogTitle>
            <DialogDescription>{aw.organization}</DialogDescription>
            {aw.date && (
              <p className="font-mono text-sm tabular-nums text-muted-foreground">
                {aw.date}
              </p>
            )}
          </div>
        </DialogHeader>
        {aw.description && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {aw.description}
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}

export function AwardList() {
  const [yearFilter, setYearFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(FALLBACK_PAGE_SIZE)
  const [rowHeight, setRowHeight] = useState(64)

  const listRef = useRef(null)
  const rowRef = useRef(null)

  // The wrapper uses CSS grid (auto / 1fr / auto), so the ul always gets
  // exactly the leftover height — pagination naturally fits without overflow.
  // We just measure the ul's actual height and a row's height to derive
  // how many rows can show.
  useLayoutEffect(() => {
    function compute() {
      const listEl = listRef.current
      const rowEl = rowRef.current
      if (!listEl || !rowEl) return

      const listHeight = listEl.getBoundingClientRect().height
      const rowH = rowEl.offsetHeight || 64
      const rows = Math.max(1, Math.floor(listHeight / rowH))
      setPageSize((prev) => (prev === rows ? prev : rows))
      setRowHeight((prev) => (prev === rowH ? prev : rowH))
    }
    compute()
    window.addEventListener("resize", compute)
    const ro =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(compute) : null
    if (ro && listRef.current) ro.observe(listRef.current)
    return () => {
      window.removeEventListener("resize", compute)
      ro?.disconnect()
    }
  }, [])

  const years = useMemo(() => {
    const set = new Set()
    awards.items.forEach((a) => {
      const matches = String(a.date ?? "").match(/\d{4}/g)
      matches?.forEach((y) => set.add(y))
    })
    return Array.from(set).sort((a, b) => Number(b) - Number(a))
  }, [])

  const filtered = useMemo(() => {
    return awards.items.filter((a) => {
      if (yearFilter !== "all" && !String(a.date ?? "").includes(yearFilter))
        return false
      return true
    })
  }, [yearFilter])

  // Reset to page 1 whenever filters or page size change
  useEffect(() => {
    setPage(1)
  }, [yearFilter, pageSize])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const start = (page - 1) * pageSize
  const visible = filtered.slice(start, start + pageSize)
  const goTo = (p) => setPage(Math.min(Math.max(1, p), totalPages))
  const onLink = (p) => (e) => {
    e.preventDefault()
    goTo(p)
  }

  return (
    <Section title={awards.title}>
      <div className="grid flex-1 grid-rows-[auto_minmax(0,1fr)_auto] gap-6">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger
              className="h-8 gap-2 border-0 bg-transparent p-0 shadow-none hover:bg-transparent focus-visible:ring-0 dark:bg-transparent dark:hover:bg-transparent"
              size="sm"
            >
              <span className="text-muted-foreground">Year</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              position="popper"
              align="start"
              sideOffset={6}
              className="w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] border-border/60 bg-popover/95 shadow-sm backdrop-blur"
            >
              <SelectItem
                value="all"
                className="px-2 [&>span:first-child]:hidden"
              >
                All
              </SelectItem>
              {years.map((y) => (
                <SelectItem
                  key={y}
                  value={y}
                  className="px-2 font-mono [&>span:first-child]:hidden"
                >
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="ml-auto text-sm text-muted-foreground tabular-nums">
            {filtered.length} {filtered.length === 1 ? "item" : "items"}
          </span>
        </div>

        <ul
          ref={listRef}
          className="min-h-0 overflow-hidden border-t"
        >
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((aw, i) => (
              <motion.li
                key={`${aw.title}-${aw.date}`}
                ref={i === 0 ? rowRef : null}
                layout
                initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
                transition={itemTransition}
                className="border-b"
              >
                <AwardRow aw={aw} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <Pagination className="pt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={onLink(page - 1)}
                className={cn(
                  "cursor-pointer",
                  page <= 1 && "pointer-events-none opacity-50"
                )}
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
                className={cn(
                  "cursor-pointer",
                  page >= totalPages && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </Section>
  )
}
