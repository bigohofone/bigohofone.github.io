import { motion } from "framer-motion"
import { ThemeToggle } from "./ThemeToggle"

export function TopNav() {
  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed left-1/2 top-[calc(1.5rem+env(safe-area-inset-top))] z-40 -translate-x-1/2"
    >
      <div className="flex h-12 items-center gap-6 rounded-full border bg-background/80 px-5 shadow-xs backdrop-blur">
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
