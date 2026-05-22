import { AnimatePresence, motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { experience } from "@/data/experience"
import { cn } from "@/lib/utils"
import { DateText } from "./DateText"

const rowTransition = {
  duration: 0.45,
  ease: [0.16, 1, 0.3, 1],
}

function isOngoing(date) {
  return /now|present/i.test(String(date ?? ""))
}

function ExperienceRow({ item }) {
  const ongoing = isOngoing(item.date)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group flex w-full cursor-pointer appearance-none items-center h-16 gap-4 border-0 bg-transparent px-1 text-left outline-none transition-colors hover:bg-accent/30 focus-visible:bg-accent/30"
        >
          <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted p-1">
            {item.logo ? (
              <img
                src={item.logo}
                alt=""
                className="size-full object-contain"
                loading="lazy"
              />
            ) : null}
          </div>
          <h3 className="flex-1 min-w-0 truncate text-base font-medium md:flex-[4]">
            {item.organization}
          </h3>
          <p className="hidden text-right text-sm text-muted-foreground md:block md:flex-[4] md:min-w-0 md:truncate">
            {item.role}
          </p>
          <span className="w-40 shrink-0 text-right font-mono text-sm leading-tight tabular-nums text-muted-foreground md:w-auto md:shrink md:flex-[2]">
            <DateText value={item.date} />
          </span>
          <span
            className={cn(
              "inline-block size-2 shrink-0 rounded-full",
              ongoing ? "bg-emerald-500" : "bg-muted-foreground/40"
            )}
            aria-hidden
          />
        </button>
      </DialogTrigger>
      <DialogContent className="aspect-video sm:max-w-2xl">
        <DialogHeader className="gap-4">
          {item.logo && (
            <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted p-0.5">
              <img
                src={item.logo}
                alt=""
                className="size-full object-contain"
              />
            </div>
          )}
          <div className="space-y-1">
            <DialogTitle className="text-xl">{item.role}</DialogTitle>
            <DialogDescription>
              {item.organization}
              {item.location && <span> · {item.location}</span>}
            </DialogDescription>
            {item.date && (
              <p className="font-mono text-sm tabular-nums text-muted-foreground">
                {item.date}
              </p>
            )}
          </div>
        </DialogHeader>
        {item.description && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {item.description}
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}

export function ExperienceList() {
  return (
    <ul className="divide-y border-y">
      <AnimatePresence initial={false} mode="popLayout">
        {experience.items.map((it, i) => (
          <motion.li
            key={`${it.role}-${it.organization}-${i}`}
            layout
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
            transition={rowTransition}
          >
            <ExperienceRow item={it} />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  )
}
