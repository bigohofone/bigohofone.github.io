import { useMemo, useState } from "react"
import { SnapSection } from "@/components/layout/SnapSection"
import { PaginatedList } from "./PaginatedList"
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { awards } from "@/data/awards"
import { DateText } from "./DateText"

function AwardRow({ item: aw }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-16 w-full justify-start gap-4 rounded-none px-1 text-left hover:bg-accent/30 focus-visible:bg-accent/30"
        >
          <h3 className="flex-1 min-w-0 truncate text-base font-medium md:flex-[4]">{aw.title}</h3>
          <p className="hidden text-right text-sm text-muted-foreground md:block md:flex-[4] md:min-w-0 md:truncate">{aw.organization}</p>
          <span className="w-40 shrink-0 text-right text-sm tabular-nums text-muted-foreground md:w-auto md:shrink md:flex-[2]">
            <DateText value={aw.date} />
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader className="gap-5">
          <Badge variant="outline" className="h-8 w-fit rounded-md px-3">{aw.type}</Badge>
          <div className="space-y-1">
            <DialogTitle>{aw.title}</DialogTitle>
            <DialogDescription>{aw.organization}</DialogDescription>
            {aw.date && <p className="text-sm tabular-nums text-muted-foreground">{aw.date}</p>}
          </div>
        </DialogHeader>
        {aw.description && <p className="text-sm leading-relaxed text-muted-foreground">{aw.description}</p>}
      </DialogContent>
    </Dialog>
  )
}

export function AwardList() {
  const [yearFilter, setYearFilter] = useState("all")

  const years = useMemo(() => {
    const set = new Set()
    awards.items.forEach((a) => String(a.date ?? "").match(/\d{4}/g)?.forEach((y) => set.add(y)))
    return Array.from(set).sort((a, b) => Number(b) - Number(a))
  }, [])

  const filtered = useMemo(
    () => awards.items.filter((a) => yearFilter === "all" || String(a.date ?? "").includes(yearFilter)),
    [yearFilter]
  )

  return (
    <SnapSection
      id="awards"
      title={awards.title}
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
        renderRow={(aw) => <AwardRow item={aw} />}
        getKey={(aw) => `${aw.title}-${aw.date}`}
      />
    </SnapSection>
  )
}
