import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

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
    <Card
      className={cn(
        "h-full transition-colors hover:bg-accent/30",
        className
      )}
    >
      <CardContent className="flex flex-col gap-4 text-left">
        {logo && (
          <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted p-2">
            <img
              src={logo}
              alt=""
              className="size-full object-contain"
              loading="lazy"
            />
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
            <p className="text-sm tabular-nums text-muted-foreground">{date}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <motion.div>
      <Dialog>
        <DialogTrigger asChild>
          <button
            type="button"
            className="block w-full cursor-pointer appearance-none rounded-xl border-0 bg-transparent p-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {body}
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader className="gap-4">
            {logo && (
              <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted p-2">
                <img
                  src={logo}
                  alt=""
                  className="size-full object-contain"
                />
              </div>
            )}
            <div className="space-y-1">
              <DialogTitle className="text-xl">{title}</DialogTitle>
              <DialogDescription>
                {subtitle}
                {subtitle && location && <span> · </span>}
                {location && <span>{location}</span>}
              </DialogDescription>
              {date && (
                <p className="text-sm tabular-nums text-muted-foreground">
                  {date}
                </p>
              )}
            </div>
          </DialogHeader>
          {description && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
