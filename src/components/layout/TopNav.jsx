import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ThemeToggle } from "./ThemeToggle"
import { cn } from "@/lib/utils"

export function TopNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "sticky top-0 z-40 w-full transition-colors",
        scrolled
          ? "border-b bg-background/80 backdrop-blur"
          : "border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-8">
        <a
          href="/"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Wonjun
        </a>
        <nav className="flex items-center gap-2">
          <ThemeToggle />
        </nav>
      </div>
    </motion.header>
  )
}
