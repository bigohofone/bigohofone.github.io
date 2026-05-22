import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function Section({ title, description, children, className }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 60, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: false, margin: "-80px" }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      className={cn("flex flex-1 flex-col gap-12", className)}
    >
      <header className="space-y-3">
        <h2 className="text-2xl font-medium tracking-[-0.03em] md:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="max-w-2xl text-lg text-muted-foreground">
            {description}
          </p>
        )}
      </header>
      <div className="flex flex-1 flex-col">{children}</div>
    </motion.section>
  )
}
