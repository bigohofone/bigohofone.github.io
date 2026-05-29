import { Fragment } from "react"
import { ArrowUpRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { contact } from "@/data/contact"

export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer id="contact" className="snap-start h-dvh flex flex-col border-t">
      <div className="mx-auto flex h-full w-full max-w-4xl flex-col px-4 pt-20 pb-6">
        <div className="flex flex-col gap-8">
          <header className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">{contact.title}</h2>
            <p className="text-sm text-muted-foreground">
              Open to research collaborations, internship offers, or thoughtful conversations.
            </p>
          </header>
          <Card className="gap-0 overflow-hidden p-0">
            {contact.items.map((c, i) => (
              <Fragment key={c.label}>
                {i > 0 && <Separator />}
                <Button
                  asChild
                  variant="ghost"
                  className="group h-16 w-full justify-between rounded-none px-4 hover:bg-accent/30"
                >
                  <a href={c.link} target="_blank" rel="noreferrer">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      {c.label}
                    </span>
                    <span className="flex items-center gap-2 text-sm group-hover:text-primary">
                      {c.value}
                      <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary" />
                    </span>
                  </a>
                </Button>
              </Fragment>
            ))}
          </Card>
        </div>
        <div className="mt-auto flex flex-col gap-1 pt-6 text-xs text-muted-foreground md:flex-row md:justify-between">
          <p>© {year} Wonjun Oh · wonjunoh.com</p>
          <p>Last updated {year}</p>
        </div>
      </div>
    </footer>
  )
}
