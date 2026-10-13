import { cn } from "@/lib/utils"
import { interactiveRowClass, rowTitleHoverClass } from "@/components/ui/row-styles"

// 제목 + 부제목 한 줄짜리 기본 행
export function ListRow({ title, subtitle, onClick }) {
  return (
    <li
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      className={cn("flex flex-col gap-cell-1 p-cell-2 outline-none bg-bg-mid odd:bg-bg-light", onClick && interactiveRowClass)}
    >
      {/* Publication 행과 같은 타이포 규칙 — 모바일에서 한 단계 작게 */}
      <h3
        className={cn(
          "text-base/normal font-normal text-fg-strong",
          rowTitleHoverClass
        )}
      >
        {title}
      </h3>
      {subtitle && (
        <small className="text-xs/normal font-normal text-fg-muted">
          {subtitle}
        </small>
      )}
    </li>
  )
}
