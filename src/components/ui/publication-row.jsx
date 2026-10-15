import { cn } from "@/lib/utils"
import { Overstrike } from "@/components/ui/overstrike"
import { interactiveRowClass, rowTitleHoverClass } from "@/components/ui/row-styles"

const titleClass = cn("text-fg-strong", rowTitleHoverClass)

export function PublicationRow({ title, venue, authors, onClick }) {
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      className={cn("outline-none", onClick && interactiveRowClass)}
    >
      <Overstrike as="h3" className={titleClass}>
        {title}
      </Overstrike>
      <p className="text-fg-strong">{venue ? `${venue} · ${authors}` : authors}</p>
    </div>
  )
}
