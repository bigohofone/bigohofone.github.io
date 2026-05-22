import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { Section } from "./Section"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { publications } from "@/data/publications"

const rowTransition = {
  duration: 0.45,
  ease: [0.16, 1, 0.3, 1],
}

function renderAuthors(authors) {
  const parts = authors.split(/({[^}]+}[*†]?)/g).filter(Boolean)
  return parts.map((part, i) => {
    const match = part.match(/^{([^}]+)}([*†]?)$/)
    if (!match) return <span key={i}>{part}</span>

    const names = match[1]
    const marker = match[2]
    if (!marker) {
      return (
        <span key={i} className="text-foreground">
          {names}
        </span>
      )
    }
    // Keep only the last name (between the final ", " and the marker) on the
    // same line as the marker, so the rest can wrap naturally.
    const splitAt = names.lastIndexOf(", ")
    const head = splitAt >= 0 ? names.slice(0, splitAt + 2) : ""
    const tail = splitAt >= 0 ? names.slice(splitAt + 2) : names
    return (
      <span key={i} className="text-foreground">
        {head}
        <span className="whitespace-nowrap">
          {tail}
          <sup className="ml-0.5 leading-none">{marker}</sup>
        </span>
      </span>
    )
  })
}

function PublicationCard({ pub }) {
  return (
    <Card className="h-full bg-muted py-3 transition-colors hover:bg-muted/80 dark:bg-[oklch(0.17_0_0)] dark:hover:bg-[oklch(0.22_0_0)]">
      <CardContent className="flex flex-col gap-4 px-3 text-left">
        <div className="flex min-h-[1.5rem] flex-wrap gap-2">
          {pub.venue && (
            <Badge
              variant="outline"
              className="rounded-md bg-background/60 text-foreground"
            >
              {pub.venue}
            </Badge>
          )}
          {pub.tags?.map((tag) => (
            <Badge key={tag} variant="outline" className="rounded-md">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="space-y-1">
          <h3 className="line-clamp-2 min-h-[2.5em] text-base font-medium leading-tight">
            {pub.title}
          </h3>
          <p className="line-clamp-2 h-[2.5em] text-sm leading-tight text-muted-foreground">
            {renderAuthors(pub.authors)}
          </p>
        </div>
        <div className="mt-8 flex min-h-[1.25rem] flex-wrap gap-4">
          {pub.links?.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary underline underline-offset-4 hover:opacity-80"
            >
              {link.label}
              <ArrowUpRight className="size-3.5" />
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function PublicationList() {
  const [yearFilter, setYearFilter] = useState("all")

  const years = useMemo(() => {
    const set = new Set()
    publications.items.forEach((p) => {
      const matches = String(p.venue ?? "").match(/\d{4}/g)
      matches?.forEach((y) => set.add(y))
    })
    return Array.from(set).sort((a, b) => Number(b) - Number(a))
  }, [])

  const filtered = useMemo(() => {
    return publications.items.filter((p) => {
      if (yearFilter !== "all" && !String(p.venue ?? "").includes(yearFilter))
        return false
      return true
    })
  }, [yearFilter])

  return (
    <Section title={publications.title}>
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

        <div className="grid gap-3 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence initial={false} mode="popLayout">
            {filtered.map((pub, i) => (
              <motion.div
                key={`${pub.title}-${i}`}
                layout
                initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
                transition={rowTransition}
              >
                <PublicationCard pub={pub} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </Section>
  )
}
