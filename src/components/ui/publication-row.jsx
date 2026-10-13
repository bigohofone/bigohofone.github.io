import { cn } from "@/lib/utils"
import { interactiveRowClass, rowTitleHoverClass } from "@/components/ui/row-styles"

export function PublicationRow({ title, venue, authors, onClick }) {
  return (
    <li
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      className={cn(
        "flex flex-col gap-cell-1 p-cell-2 outline-none odd:bg-bg-light",
        onClick && interactiveRowClass
      )}
    >
      <h3 className={cn("line-clamp-2 text-base/normal font-normal text-fg-strong", rowTitleHoverClass)}>{title}</h3>
      <p className="line-clamp-2 text-xs/normal font-normal text-fg-muted">{authors}</p>
      {/* 학회명은 사각형 표지 안에 쓴다 — 바탕은 줄무늬(bg-light)와 회색의 가운데라 어느 줄에서나 보인다 */}
      {venue && (
        <p className="self-start bg-[color-mix(in_oklch,var(--bg-light),var(--fg-muted))] px-cell-1 text-xs/normal font-normal text-fg-strong">
          {venue}
        </p>
      )}
    </li>
  )
}
