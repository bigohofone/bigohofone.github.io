import { cn } from "@/lib/utils"
import { interactiveRowClass, rowTitleHoverClass } from "@/components/ui/row-styles"

// 제목 + 부제목 한 줄짜리 기본 행
export function ListRow({ title, subtitle, onClick }) {
  return (
    <li
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      className={cn("flex flex-col gap-1 py-5 outline-none", onClick && interactiveRowClass)}
    >
      {/* Publication 행과 같은 타이포 규칙 — 모바일에서 한 단계 작게 */}
      <h3
        className={cn(
          "text-base/normal font-medium text-fg-strong sm:text-[20px]/normal",
          rowTitleHoverClass
        )}
      >
        {title}
      </h3>
      {subtitle && (
        <small className="text-sm/normal font-normal text-fg-strong sm:text-[16px]/normal">
          {subtitle}
        </small>
      )}
    </li>
  )
}
