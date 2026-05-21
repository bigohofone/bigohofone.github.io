import { useEffect, useMemo, useState } from "react"
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

const PAGE_SIZE = 7

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
          <h3 className="flex-1 truncate text-base font-medium">{aw.title}</h3>
          <p className="hidden w-56 shrink-0 text-right text-sm text-muted-foreground md:block">
            {aw.organization}
          </p>
          <span className="w-40 shrink-0 text-right text-sm tabular-nums text-muted-foreground">
            {aw.date}
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="gap-4">
          <Badge variant="outline" className="w-fit rounded-md">
            {aw.type}
          </Badge>
          <div className="space-y-1">
            <DialogTitle className="text-xl">{aw.title}</DialogTitle>
            <DialogDescription>{aw.organization}</DialogDescription>
            {aw.date && (
              <p className="text-sm tabular-nums text-muted-foreground">
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

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1)
  }, [yearFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const start = (page - 1) * PAGE_SIZE
  const visible = filtered.slice(start, start + PAGE_SIZE)
  const goTo = (p) => setPage(Math.min(Math.max(1, p), totalPages))
  const onLink = (p) => (e) => {
    e.preventDefault()
    goTo(p)
  }

  return (
    <Section title={awards.title}>
      <div className="flex flex-1 flex-col gap-6">
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
                  className="px-2 [&>span:first-child]:hidden"
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

        <ul className="divide-y border-y">
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((aw) => (
              <motion.li
                key={`${aw.title}-${aw.date}`}
                layout
                initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
                transition={itemTransition}
              >
                <AwardRow aw={aw} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <Pagination className="mt-auto pt-4">
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
