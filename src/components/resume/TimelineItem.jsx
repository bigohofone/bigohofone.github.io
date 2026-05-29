import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DateText } from "./DateText"

export function TimelineItem({
  logo,
  title,
  subtitle,
  date,
  location,
  description,
  className,
}) {
  const body = (
    <Card className={cn("h-full transition-colors hover:bg-accent/30", className)}>
      <CardContent className="flex flex-col gap-4 text-left">
        {logo && (
          <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted p-2">
            <img src={logo} alt="" className="size-full object-contain" loading="lazy" />
          </div>
        )}
        <div className="space-y-1">
          <h3 className="text-lg font-medium leading-tight">{title}</h3>
          {(subtitle || location) && (
            <p className="text-sm text-muted-foreground">
              {subtitle}
              {subtitle && location && <span> · </span>}
              {location && <span>{location}</span>}
            </p>
          )}
          {date && (
            <p className="text-sm tabular-nums text-muted-foreground">
              <DateText value={date} />
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto w-full rounded-xl p-0 hover:bg-transparent focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {body}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader className="gap-5">
          {logo && (
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted p-1.5">
              <img src={logo} alt="" className="size-full object-contain" />
            </div>
          )}
          <div className="space-y-1">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {subtitle}
              {subtitle && location && <span> · </span>}
              {location && <span>{location}</span>}
            </DialogDescription>
            {date && (
              <p className="text-sm tabular-nums text-muted-foreground">{date}</p>
            )}
          </div>
        </DialogHeader>
        {description && (
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
