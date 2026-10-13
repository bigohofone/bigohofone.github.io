import { useEffect, useMemo, useState } from "react"

import { cn } from "@/lib/utils"
import { PixelBitmap } from "@/components/ui/pixel-bitmap"
import { interactiveRowClass, rowTitleHoverClass } from "@/components/ui/row-styles"

// Vitae — 좌·우·좌·우로 꺾여 내려가는 픽셀 길(bg-light) 위에 기간마다 점과 깃발을 꽂는다. 크기는 모두 격자 칸 단위.
// 행마다 제 쪽(짝수 행은 왼쪽, 홀수 행은 오른쪽)에 세로 길을 그리고, 행 바닥에 반대쪽까지 물결치는 가로 길을 그린다.
// 다음 행은 그 반대쪽에서 세로 길을 이어 가므로, 행을 쌓으면 길이 한 줄로 구불구불 이어진다.
// 깃발은 점에 꽂혀 서고, 글은 깃발 반대편 남는 자리에 제목·부제목·기간 순으로 쓴다. 제목은 깃발 천과 높이를 맞춘다
const PATH = 3 // 길 폭 — 홀수여야 깃대·점이 길 한가운데 칸에 선다
const POLE = 9 // 점 위끝
const DOT = 5
const FLAG_DROP = 2
// 점은 길보다 넓어 양옆으로 (DOT - PATH) / 2 칸 삐져나온다. 그만큼 길을 본문 가장자리에서 안쪽으로 들여 점이 잘리지 않게 한다
const INSET = (DOT - PATH) / 2

// 깃발 천 (깃대 오른쪽, 7칸 중 첫 열은 깃대 자리라 비운다). 오른쪽 행에서는 좌우를 뒤집는다
const FLAG_CLOTH = [".111111", ".11111.", ".1111..", ".11111.", ".111111"]
const FLAG_WIDTH = FLAG_CLOTH[0].length

const cells = (n) => `calc(var(--cell) * ${n})`

// 가로 길은 위아래로 WAVE_AMP 칸 출렁이며 한 행에 WAVE_PERIODS 번 물결친다. 양 끝은 물결 한가운데 높이에서 세로 길과 만난다
const WAVE_AMP = 2
const WAVE_PERIODS = 2
const BAND = PATH + 2 * WAVE_AMP // 가로 길이 차지하는 띠 높이
const WAVE_MID = WAVE_AMP + (PATH - 1) / 2 // 띠 안에서 물결 가운데 줄

// 본문 폭의 칸 수 (index.css 의 --frame-cells 와 같은 구간). 창 크기가 바뀌면 물결을 다시 그린다
function useFrameCells() {
  const read = () => (window.innerWidth >= 720 ? 90 : 60)
  const [frameCells, setFrameCells] = useState(read)
  useEffect(() => {
    const update = () => setFrameCells(read())
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])
  return frameCells
}

// 행 바닥의 물결 길. 길의 가운데 선을 이어 그린 뒤(제 쪽 세로 → 반지름 TURN 의 사분원 → 물결 → 사분원 → 반대쪽 세로),
// 그 선에서 길 폭의 절반 안에 드는 칸을 칠해 꺾이는 곳까지 둥근 픽셀 길로 만든다.
// 안쪽 모서리도 둥글게 보이도록 꺾는 반지름(TURN)을 길 폭보다 크게 잡는다. 그만큼 사분원이 띠 위아래로 넘치므로
// 물결 그림을 위아래로 TURN 칸씩 늘려 세로 길 끝까지 함께 그린다
const TURN = 5

function wavyPathCells(width, right) {
  const dir = right ? -1 : 1
  const own = right ? width - INSET - PATH / 2 : INSET + PATH / 2
  const other = right ? INSET + PATH / 2 : width - INSET - PATH / 2
  const mid = WAVE_MID + 0.5
  const waveFrom = own + dir * TURN
  const waveTo = other - dir * TURN
  const step = 0.25
  const points = []
  for (let y = -TURN; y <= mid - TURN; y += step) points.push([own, y])
  for (let a = 0; a <= Math.PI / 2; a += step / TURN) {
    points.push([own + dir * TURN * (1 - Math.cos(a)), mid - TURN + TURN * Math.sin(a)])
  }
  for (let d = 0; d <= Math.abs(waveTo - waveFrom); d += step) {
    const t = d / Math.abs(waveTo - waveFrom)
    points.push([waveFrom + dir * d, mid + WAVE_AMP * Math.sin(2 * Math.PI * WAVE_PERIODS * t)])
  }
  for (let a = 0; a <= Math.PI / 2; a += step / TURN) {
    points.push([waveTo + dir * TURN * Math.sin(a), mid + TURN * (1 - Math.cos(a))])
  }
  for (let y = mid + TURN; y <= BAND + TURN; y += step) points.push([other, y])

  const filled = []
  for (let row = -TURN; row < BAND + TURN; row++) {
    for (let col = 0; col < width; col++) {
      const near = points.some(([x, y]) => Math.hypot(x - col - 0.5, y - row - 0.5) <= PATH / 2)
      if (near) filled.push([col, row])
    }
  }
  return filled
}

function WavyPath({ width, right }) {
  const filled = useMemo(() => wavyPathCells(width, right), [width, right])
  return (
    <svg
      aria-hidden
      viewBox={`0 ${-TURN} ${width} ${BAND + 2 * TURN}`}
      shapeRendering="crispEdges"
      className="absolute left-0 fill-bg-light"
      style={{ bottom: cells(-TURN), width: cells(width), height: cells(BAND + 2 * TURN) }}
    >
      {filled.map(([col, row]) => (
        <rect key={`${col}-${row}`} x={col} y={row} width="1" height="1" />
      ))}
    </svg>
  )
}

export function TimelineRow({ title, subtitle, start, end, onClick, index, isLast }) {
  const frameCells = useFrameCells()
  const right = index % 2 === 1
  // 길 가운데 칸에서 깃대가 서고, 깃발 천은 글 쪽으로 펼쳐진다
  const side = right ? "right" : "left"
  const poleOffset = INSET + (PATH - 1) / 2

  return (
    <li
      className="relative"
      style={{ minHeight: cells(POLE + DOT + 4), paddingBottom: isLast ? 0 : cells(BAND + 4) }}
    >
      {/* 세로 길 — 첫 행은 점에서 시작하고, 마지막 행은 점에서 끝난다 */}
      <span
        aria-hidden
        className="absolute bg-bg-light"
        style={{
          [side]: cells(INSET),
          width: cells(PATH),
          // 둥글게 꺾이는 부분 가까이는 물결 길이 그리므로, 그 그림이 끝나는 곳까지만 잇는다
          top: index === 0 ? cells(POLE) : cells(TURN),
          bottom: isLast ? `calc(100% - ${cells(POLE + DOT)})` : cells(BAND + TURN),
        }}
      />
      {/* 가로 길 — 행 바닥에서 반대쪽까지 물결친다 */}
      {/* 섹션 좌우 여백(px-cell-1) 두 칸을 뺀 폭 */}
      {!isLast && <WavyPath width={frameCells - 2} right={right} />}

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
      {/* 깃대 아래 한 칸은 어둡게 칠해 점에 박힌 듯 보이게 한다 */}
      <span
        aria-hidden
        className="absolute bg-[color-mix(in_oklch,var(--fg-muted)_40%,var(--bg))]"
        style={{ [side]: cells(poleOffset), top: cells(FLAG_DROP + POLE), width: cells(1), height: cells(1) }}
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
          [right ? "marginLeft" : "marginRight"]: cells(INSET + PATH + 3),
        }}
      >
        <h3 className={cn("text-base/normal font-normal text-fg-strong", rowTitleHoverClass)}>{title}</h3>
        {subtitle && <small className="text-xs/normal font-normal text-fg-muted">{subtitle}</small>}
        {start && <small className="text-xs/normal font-normal text-fg-muted">{end ? `${start} – ${end}` : start}</small>}
      </div>
    </li>
  )
}
