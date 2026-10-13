import { cn } from "@/lib/utils"
import { PixelBitmap } from "@/components/ui/pixel-bitmap"
import { interactiveRowClass, rowTitleHoverClass } from "@/components/ui/row-styles"

// Vitae — 좌·우·좌·우로 꺾여 내려가는 픽셀 길(bg-light) 위에 기간마다 점과 깃발을 꽂는다. 크기는 모두 격자 칸 단위.
// 행마다 제 쪽(짝수 행은 왼쪽, 홀수 행은 오른쪽)에 세로 길을 그리고, 행 바닥에 반대쪽까지 가로 길을 그린다.
// 다음 행은 그 반대쪽에서 세로 길을 이어 가므로, 행을 쌓으면 길이 한 줄로 구불구불 이어진다.
// 깃발은 점에 꽂혀 서고, 글은 깃발 반대편 남는 자리에 제목·부제목·기간 순으로 쓴다. 제목은 깃발 천과 높이를 맞춘다
const PATH = 3 // 길 폭 — 홀수여야 깃대·점이 길 한가운데 칸에 선다
const POLE = 9 // 점 위끝
const DOT = 5
const FLAG_DROP = 2

// 깃발 천 (깃대 오른쪽, 7칸 중 첫 열은 깃대 자리라 비운다). 오른쪽 행에서는 좌우를 뒤집는다
const FLAG_CLOTH = [".111111", ".11111.", ".1111..", ".11111.", ".111111"]
const FLAG_WIDTH = FLAG_CLOTH[0].length

const cells = (n) => `calc(var(--cell) * ${n})`

export function TimelineRow({ title, subtitle, start, end, onClick, index, isLast }) {
  const right = index % 2 === 1
  // 길 가운데 칸에서 깃대가 서고, 깃발 천은 글 쪽으로 펼쳐진다
  const side = right ? "right" : "left"
  const poleOffset = (PATH - 1) / 2

  return (
    <li
      className="relative"
      style={{ minHeight: cells(POLE + DOT + 4), paddingBottom: isLast ? 0 : cells(PATH + 4) }}
    >
      {/* 세로 길 — 첫 행은 점에서 시작하고, 마지막 행은 점에서 끝난다 */}
      <span
        aria-hidden
        className="absolute bg-bg-light"
        style={{
          [side]: 0,
          width: cells(PATH),
          top: index === 0 ? cells(POLE) : 0,
          bottom: isLast ? `calc(100% - ${cells(POLE + DOT)})` : 0,
        }}
      />
      {/* 가로 길 — 행 바닥에서 반대쪽까지 */}
      {!isLast && (
        <span aria-hidden className="absolute inset-x-0 bottom-0 bg-bg-light" style={{ height: cells(PATH) }} />
      )}

      {/* 점 (네 꼭짓점을 깎은 정사각형) — 색은 길(bg-light)과 깃대(fg-muted)의 가운데 */}
      <span
        aria-hidden
        className="absolute pixel-corners bg-[color-mix(in_oklch,var(--bg-light),var(--fg-muted))]"
        style={{ [side]: cells(poleOffset - (DOT - 1) / 2), top: cells(POLE), width: cells(DOT), height: cells(DOT) }}
      />

      {/* 깃대와 깃발 천 — FLAG_DROP 만큼 내려 깃대 끝이 점 안으로 들어가, 점에 꽂힌 것처럼 보인다 (깃발은 점 위에 그린다) */}
      <span
        aria-hidden
        className="absolute bg-fg-muted"
        style={{ [side]: cells(poleOffset), top: cells(FLAG_DROP), width: cells(1), height: cells(POLE) }}
      />
      <PixelBitmap
        rows={FLAG_CLOTH}
        className={cn("absolute text-primary", right && "-scale-x-100")}
        style={{ [side]: cells(poleOffset), top: cells(FLAG_DROP) }}
      />
      {/* 글 — 깃발 반대편 남는 자리. 오른쪽 행은 깃발 쪽(오른쪽)에 맞춰 쓴다 */}
      <div
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        className={cn("flex flex-col gap-cell-1 outline-none", right ? "items-end text-right" : "items-start", onClick && interactiveRowClass)}
        style={{
          // 제목 첫 줄의 가운데를 깃발 천의 가운데 높이에 맞춘다 (제목 줄 높이는 --text-base--line-height)
          marginTop: `calc(${cells(FLAG_DROP + FLAG_CLOTH.length / 2)} - var(--text-base--line-height) / 2)`,
          [right ? "marginRight" : "marginLeft"]: cells(poleOffset + FLAG_WIDTH + 3),
          [right ? "marginLeft" : "marginRight"]: cells(PATH + 3),
        }}
      >
        <h3 className={cn("text-base/normal font-normal text-fg-strong", rowTitleHoverClass)}>{title}</h3>
        {subtitle && <small className="text-xs/normal font-normal text-fg-muted">{subtitle}</small>}
        {start && <small className="text-xs/normal font-normal text-fg-muted">{end ? `${start} – ${end}` : start}</small>}
      </div>
    </li>
  )
}
