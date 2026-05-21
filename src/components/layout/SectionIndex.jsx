import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

/** Sticky left-side index of sections; click to snap-scroll, current section highlights. */
export function SectionIndex({ items }) {
  const [activeId, setActiveId] = useState(items[0]?.id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveId(visible.target.id)
      },
      { threshold: [0.25, 0.5, 0.75] }
    )
    items.forEach((it) => {
      const el = document.getElementById(it.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [items])

  const handleClick = (id) => (e) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <motion.aside
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 2xl:block"
      aria-label="Section navigation"
    >
      <ol className="flex flex-col gap-4">
        {items.map((it) => {
          const active = activeId === it.id
          return (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                onClick={handleClick(it.id)}
                className={cn(
                  "group flex items-center gap-3 text-sm transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground/50 hover:text-foreground"
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "size-1.5 rounded-full transition-colors",
                    active
                      ? "bg-foreground"
                      : "bg-muted-foreground/40 group-hover:bg-foreground"
                  )}
                />
                {it.label}
              </a>
            </li>
          )
        })}
      </ol>
    </motion.aside>
  )
}
