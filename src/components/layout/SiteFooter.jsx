import { Fragment } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { contact } from "@/data/contact"

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
}

export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer id="contact" className="snap-start">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-12 pt-24 md:px-8">
        <div className="flex flex-col gap-8 rounded-2xl bg-[oklch(0.97_0_0)] p-6 dark:bg-[oklch(0.17_0_0)] md:p-10">
          <header className="space-y-3">
            <h2 className="text-2xl font-medium tracking-[-0.03em] md:text-4xl">
              {contact.title}
            </h2>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Open to research collaborations, internship offers, or thoughtful
              conversations.
            </p>
          </header>
          <Card asChild className="gap-0 overflow-hidden p-0 dark:bg-[oklch(0.17_0_0)]">
            <motion.ul
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
            >
              {contact.items.map((c, i) => (
                <Fragment key={c.label}>
                  {i > 0 && <Separator />}
                  <motion.li variants={item}>
                    <a
                      href={c.link}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex h-16 items-center justify-between gap-4 px-4 transition-colors hover:bg-accent/30"
                    >
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">
                        {c.label}
                      </span>
                      <span className="flex items-center gap-2 text-sm transition-colors group-hover:text-primary">
                        {c.value}
                        <ArrowUpRight className="size-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                      </span>
                    </a>
                  </motion.li>
                </Fragment>
              ))}
            </motion.ul>
          </Card>
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-12 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {year} Wonjun Oh · wonjunoh.com</p>
          <p className="tabular-nums">Last updated {year}</p>
        </div>
      </div>
    </footer>
  )
}
