import { cn } from "@/lib/utils"
import { Overstrike } from "@/components/ui/overstrike"
import { interactiveRowClass, rowTitleHoverClass } from "@/components/ui/row-styles"

// 제목, 부제목, 기간을 한 줄씩 친다
export function ListRow({ title, subtitle, period, onClick }) {
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      className={cn("outline-none", onClick && interactiveRowClass)}
    >
      <Overstrike as="h3" className={cn("text-fg-strong", rowTitleHoverClass)}>
        {title}
      </Overstrike>
      {subtitle && <p className="text-fg-strong">{subtitle}</p>}
      {period && <p className="text-fg-strong">{period}</p>}
    </div>
  )
}
