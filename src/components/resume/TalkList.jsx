import { AnimatePresence, motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { talks } from "@/data/talks"
import { DateText } from "./DateText"

const rowTransition = {
  duration: 0.45,
  ease: [0.16, 1, 0.3, 1],
}

function TalkRow({ item }) {
  const trigger = (
    <button
      type="button"
      className="group flex w-full cursor-pointer appearance-none items-center h-16 gap-4 border-0 bg-transparent px-1 text-left outline-none transition-colors hover:bg-accent/30 focus-visible:bg-accent/30 disabled:cursor-default"
      disabled={!item.description}
    >
      <h3 className="flex-1 min-w-0 truncate text-base font-medium md:flex-[4]">{item.title}</h3>
      <p className="hidden text-right text-sm text-muted-foreground md:block md:flex-[4] md:min-w-0 md:truncate">
        {item.organization}
      </p>
      <span className="w-40 shrink-0 text-right font-mono text-sm leading-tight tabular-nums text-muted-foreground md:w-auto md:shrink md:flex-[2]">
        <DateText value={item.date} />
      </span>
    </button>
  )

  if (!item.description) return trigger

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="aspect-video sm:max-w-2xl">
        <DialogHeader className="gap-4">
          <div className="space-y-1">
            <DialogTitle className="text-xl">{item.title}</DialogTitle>
            <DialogDescription>{item.organization}</DialogDescription>
            {item.date && (
              <p className="font-mono text-sm tabular-nums text-muted-foreground">
                {item.date}
              </p>
            )}
          </div>
        </DialogHeader>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>
      </DialogContent>
    </Dialog>
  )
}

export function TalkList() {
  return (
    <ul className="divide-y border-y">
      <AnimatePresence initial={false} mode="popLayout">
        {talks.items.map((it, i) => (
          <motion.li
            key={`${it.title}-${i}`}
            layout
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
            transition={rowTransition}
          >
            <TalkRow item={it} />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  )
}
