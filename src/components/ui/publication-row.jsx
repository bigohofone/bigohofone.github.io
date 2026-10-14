import { cn } from "@/lib/utils"
import { interactiveRowClass, rowTitleHoverClass } from "@/components/ui/row-styles"

export function PublicationRow({ title, venue, authors, onClick }) {
  return (
    <li
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      className={cn(
        "flex flex-col gap-cell-1 p-cell-2 outline-none bg-bg-mid odd:bg-bg-light",
        onClick && interactiveRowClass
      )}
    >
      <h3 className={cn("line-clamp-2 text-base/normal font-normal text-fg-strong", rowTitleHoverClass)}>{title}</h3>
      <p className="line-clamp-2 text-xs/normal font-normal text-fg-muted">{authors}</p>
      {/* 학회명은 세 칸 높이, 네 꼭짓점을 깎은 표지 안에 쓴다. 대문자 높이가 가운데 한 칸에 꼭 맞고 좌우로 두 칸 띄운다.
          학회에 실린 논문은 흰 표지에 배경색 글씨로, arXiv 는 줄무늬(bg-light)와 회색의 가운데 바탕으로 덜 눈에 띄게 한다 */}
      {venue && (
        <p
          className={cn(
            "flex h-cell-3 items-center self-start px-cell-2 font-normal leading-none pixel-corners [text-box:trim-both_cap_alphabetic]",
            /arxiv/i.test(venue)
              ? "bg-[color-mix(in_oklch,var(--bg-light),var(--fg-muted))] text-fg-strong"
              : "bg-white text-bg"
          )}
          // 본문 글꼴(Open Sauce Sans)의 대문자 높이는 0.763em 이라, 이 크기면 대문자가 정확히 한 칸 높이가 된다
          style={{ fontSize: "calc(var(--cell) / 0.763)" }}
        >
          {venue}
        </p>
      )}
    </li>
  )
}
