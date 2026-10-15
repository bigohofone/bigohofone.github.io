import { cn } from "@/lib/utils"
import { Overstrike } from "@/components/ui/overstrike"
import { interactiveRowClass, rowTitleHoverClass } from "@/components/ui/row-styles"

const titleClass = cn("text-fg-strong", rowTitleHoverClass)

export function PublicationRow({ number, title, venue, authors, onClick }) {
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      className={cn("flex gap-[1ch] outline-none", onClick && interactiveRowClass)}
    >
      {/* 원으로 두른 번호 — 첫 줄 가운데에 놓고, 제목·저자는 번호 오른쪽에 맞춰 내려 쓴다 */}
      <div className="flex h-line shrink-0 items-center">
        {/* 원은 글꼴 크기(1em) 그대로, 그 안에 들어가도록 숫자만 줄인다 */}
        <span className="inline-flex size-[1em] items-center justify-center rounded-full border border-fg-strong text-fg-strong">
          <span className="translate-y-[0.06em] text-[0.7em] leading-none [-webkit-text-stroke:0.3px_currentColor]">{number}</span>
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <Overstrike as="h3" className={titleClass}>
          {title}
        </Overstrike>
        <p className="text-fg-strong">{venue ? `${venue} · ${authors}` : authors}</p>
      </div>
    </div>
  )
}
