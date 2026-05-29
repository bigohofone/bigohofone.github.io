import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DateText } from "./DateText"

function isOngoing(date) {
  return /now|present/i.test(String(date ?? ""))
}

export function EducationRow({ item }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-16 w-full justify-start gap-4 rounded-none px-1 text-left hover:bg-accent/30 focus-visible:bg-accent/30"
        >
          <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted p-1">
            {item.logo && <img src={item.logo} alt="" className="size-full object-contain" loading="lazy" />}
          </div>
          <h3 className="flex-1 min-w-0 truncate text-base font-medium md:flex-[4]">{item.organization}</h3>
          <p className="hidden text-right text-sm text-muted-foreground md:block md:flex-[4] md:min-w-0 md:truncate">{item.major}</p>
          <span className="w-40 shrink-0 text-right text-sm tabular-nums text-muted-foreground md:w-auto md:shrink md:flex-[2]">
            <DateText value={item.date} />
          </span>
          <span className={cn("inline-block size-2 shrink-0 rounded-full", isOngoing(item.date) ? "bg-emerald-500" : "bg-muted-foreground/40")} aria-hidden />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader className="gap-5">
          {item.logo && (
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted p-1.5">
              <img src={item.logo} alt="" className="size-full object-contain" />
            </div>
          )}
          <div className="space-y-1">
            <DialogTitle>{item.organization}</DialogTitle>
            <DialogDescription>
              {item.major}{item.location && <span> · {item.location}</span>}
            </DialogDescription>
            {item.date && <p className="text-sm tabular-nums text-muted-foreground">{item.date}</p>}
          </div>
        </DialogHeader>
        {item.description && <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>}
      </DialogContent>
    </Dialog>
  )
}
