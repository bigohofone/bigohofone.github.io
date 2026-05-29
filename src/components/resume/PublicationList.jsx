import { useMemo, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { SnapSection } from "@/components/layout/SnapSection"
import { PaginatedList } from "./PaginatedList"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { publications } from "@/data/publications"

function renderAuthors(authors) {
  const parts = authors.split(/({[^}]+}[*†]?)/g).filter(Boolean)
  return parts.map((part, i) => {
    const match = part.match(/^{([^}]+)}([*†]?)$/)
    if (!match) return <span key={i}>{part}</span>
    const names = match[1]
    const marker = match[2]
    if (!marker) return <span key={i} className="text-foreground">{names}</span>
    const splitAt = names.lastIndexOf(", ")
    const head = splitAt >= 0 ? names.slice(0, splitAt + 2) : ""
    const tail = splitAt >= 0 ? names.slice(splitAt + 2) : names
    return (
      <span key={i} className="text-foreground">
        {head}<span className="whitespace-nowrap">{tail}<sup className="ml-0.5 leading-none">{marker}</sup></span>
      </span>
    )
  })
}

function PublicationCard({ item: pub }) {
  return (
    <Card className="h-full">
      <CardContent className="flex flex-col gap-3 text-left">
        <div className="flex flex-wrap gap-2">
          {pub.venue && <Badge variant="outline">{pub.venue}</Badge>}
          {pub.tags?.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
        </div>
        <div className="space-y-1">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug">{pub.title}</h3>
          <p className="line-clamp-2 text-xs text-muted-foreground">{renderAuthors(pub.authors)}</p>
        </div>
        <div className="mt-auto flex flex-wrap gap-4">
          {pub.links?.map((link) => (
            <a key={link.url} href={link.url} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary underline underline-offset-4 hover:opacity-80"
            >
              {link.label}<ArrowUpRight className="size-3" />
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
    publications.items.forEach((p) => String(p.venue ?? "").match(/\d{4}/g)?.forEach((y) => set.add(y)))
    return Array.from(set).sort((a, b) => Number(b) - Number(a))
  }, [])

  const filtered = useMemo(
    () => publications.items.filter((p) => yearFilter === "all" || String(p.venue ?? "").includes(yearFilter)),
    [yearFilter]
  )

  return (
    <SnapSection
      id="publications"
      title={publications.title}
      filter={
        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="h-8 w-28">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All years</SelectItem>
            {years.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
          </SelectContent>
        </Select>
      }
    >
      <PaginatedList
        items={filtered}
        renderRow={(pub) => <PublicationCard item={pub} />}
        getKey={(pub, i) => `${pub.title}-${i}`}
        cols={2}
      />
    </SnapSection>
  )
}
