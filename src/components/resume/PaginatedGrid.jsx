import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: 60, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
  },
}

// Per-viewport vertical reservations: snapSection padding (pt-24 96 + pb-10 40),
// section header (~88), Section gap-8 (32), trailing pagination/show-all chrome,
// and a small safety margin. Mobile reserves less since the "Show all" button
// is shorter than desktop pagination and there's no extra collapsible gap.
const RESERVED_DESKTOP = 96 + 40 + 88 + 32 + 56 + 24
const RESERVED_MOBILE = 96 + 40 + 88 + 24

/**
 * Responsive paginated grid.
 *
 * - Desktop (≥ md): pageSize-paginated grid + shadcn Pagination pinned to bottom.
 * - Mobile (< md):  pageSize cards always visible, the rest hidden inside a
 *                   Collapsible expanded with a "Show all" Button.
 *
 * pageSize is computed automatically from the viewport height and the measured
 * first-card height, so as many cards fit on one screen as possible.
 */
export function PaginatedGrid({
  items,
  cols = 1,
  fallbackPageSize = 4,
  renderItem,
  getKey,
  gridClassName,
  className,
}) {
  const desktopCardRef = useRef(null)
  const mobileCardRef = useRef(null)

  const [pageSize, setPageSize] = useState(fallbackPageSize)

  // Measure first card + viewport, derive rows that fit, and set pageSize.
  useLayoutEffect(() => {
    function compute() {
      const isMd =
        typeof window !== "undefined" &&
        window.matchMedia("(min-width: 768px)").matches
      const cardEl = isMd ? desktopCardRef.current : mobileCardRef.current
      const cardH = cardEl?.offsetHeight ?? 140
      const gap = 12 // grid gap-3
      const vh = window.innerHeight
      const reserved = isMd ? RESERVED_DESKTOP : RESERVED_MOBILE
      const available = vh - reserved
      const rows = Math.max(1, Math.floor((available + gap) / (cardH + gap)))
      const effectiveCols = isMd ? cols : 1
      const next = Math.max(1, rows * effectiveCols)
      setPageSize((prev) => (prev === next ? prev : next))
    }
    compute()
    window.addEventListener("resize", compute)
    return () => window.removeEventListener("resize", compute)
  }, [cols, items.length])

  // Reset to page 1 whenever the computed pageSize changes.
  const [page, setPage] = useState(1)
  useEffect(() => {
    setPage(1)
  }, [pageSize])

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const start = (page - 1) * pageSize
  const visibleDesktop = items.slice(start, start + pageSize)
  const goTo = (p) => setPage(Math.min(Math.max(1, p), totalPages))
  const onLink = (p) => (e) => {
    e.preventDefault()
    goTo(p)
  }

  // Mobile collapsible state
  const [mobileOpen, setMobileOpen] = useState(false)
  const mobilePreview = items.slice(0, pageSize)
  const mobileRest = items.slice(pageSize)
  const hasMobileRest = mobileRest.length > 0

  const keyOf = (it, i) => (getKey ? getKey(it, i) : i)

  return (
    <div className={cn("flex flex-1 flex-col gap-5", className)}>
      {/* Mobile: collapsible expand */}
      <div className="flex flex-col gap-4 md:hidden">
        <Collapsible open={mobileOpen} onOpenChange={setMobileOpen}>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, margin: "-100px" }}
            className={cn("grid gap-3", gridClassName)}
          >
            {mobilePreview.map((it, i) => (
              <motion.div
                key={`m-${keyOf(it, i)}`}
                ref={i === 0 ? mobileCardRef : null}
                variants={item}
              >
                {renderItem(it, i)}
              </motion.div>
            ))}
          </motion.div>
          {hasMobileRest && (
            <>
              <CollapsibleContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                <div className={cn("grid gap-3 pt-4", gridClassName)}>
                  {mobileRest.map((it, i) => (
                    <div key={`m-rest-${keyOf(it, pageSize + i)}`}>
                      {renderItem(it, pageSize + i)}
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
              <CollapsibleTrigger asChild>
                <Button size="lg" variant="secondary" className="mt-3 w-full">
                  {mobileOpen ? "Show less" : `Show all (${items.length})`}
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform duration-300",
                      mobileOpen && "rotate-180"
                    )}
                  />
                </Button>
              </CollapsibleTrigger>
            </>
          )}
        </Collapsible>
      </div>

      {/* Desktop: paginated */}
      <div className="hidden md:flex md:flex-1 md:flex-col md:gap-5">
        <motion.div
          key={page}
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, margin: "-100px" }}
          className={cn("grid gap-3", gridClassName)}
        >
          {visibleDesktop.map((it, i) => (
            <motion.div
              key={`d-${keyOf(it, start + i)}`}
              ref={i === 0 ? desktopCardRef : null}
              variants={item}
            >
              {renderItem(it, start + i)}
            </motion.div>
          ))}
        </motion.div>

        {totalPages > 1 && (
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
        )}
      </div>
    </div>
  )
}
