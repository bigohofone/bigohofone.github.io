import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DateText } from "./DateText"

export function TalkRow({ item }) {
  const row = (
    <Button
      variant="ghost"
      className="h-16 w-full justify-start gap-4 rounded-none px-1 text-left hover:bg-accent/30 focus-visible:bg-accent/30"
    >
      <h3 className="flex-1 min-w-0 truncate text-base font-medium md:flex-[4]">{item.title}</h3>
      <p className="hidden text-right text-sm text-muted-foreground md:block md:flex-[4] md:min-w-0 md:truncate">{item.organization}</p>
      <span className="w-40 shrink-0 text-right text-sm tabular-nums text-muted-foreground md:w-auto md:shrink md:flex-[2]">
        <DateText value={item.date} />
      </span>
    </Button>
  )

  if (!item.description) return row

  return (
    <Dialog>
      <DialogTrigger asChild>{row}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="space-y-1">
            <DialogTitle>{item.title}</DialogTitle>
            <DialogDescription>{item.organization}</DialogDescription>
            {item.date && <p className="text-sm tabular-nums text-muted-foreground">{item.date}</p>}
          </div>
        </DialogHeader>
        <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
      </DialogContent>
    </Dialog>
  )
}
