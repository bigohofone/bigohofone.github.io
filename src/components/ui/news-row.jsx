import { cn } from "@/lib/utils"
import { interactiveRowClass, rowTitleHoverClass } from "@/components/ui/row-styles"

export function NewsRow({ title, leading, onClick }) {
  return (
    <li
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      // 언제나 한 열 — 내용 아래에 날짜를 둔다. 구분선 대신 홀수 줄에 밝은 배경을 깔아 줄을 나눈다
      className={cn(
        "flex flex-col-reverse gap-cell-1 p-cell-2 outline-none odd:bg-bg-light",
        onClick && interactiveRowClass
      )}
    >
      {leading && (
        <small className="text-xs/normal font-normal text-fg-muted">{leading}</small>
      )}

      {/* 한글은 단어 단위로 끊어 자연스럽게 줄바꿈한다 */}
      <h3 className={cn("min-w-0 flex-1 break-keep text-base/normal font-normal text-fg-strong", rowTitleHoverClass)}>
        {title}
      </h3>
    </li>
  )
}
