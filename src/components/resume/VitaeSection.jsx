import { Fragment, useEffect, useMemo, useRef, useState } from "react"

import { cn } from "@/lib/utils"
import { cellPx } from "@/lib/cell"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import { Modal } from "@/components/ui/modal"
import { PixelBitmap } from "@/components/ui/pixel-bitmap"
import { PixelTitle } from "@/components/ui/pixel-title"
import { interactiveRowClass, rowTitleHoverClass } from "@/components/ui/row-styles"
import { compareItemsByDateThenAlphabetical } from "@/utils/date"

// 경력·학력 길 — 화면 위에 붙어 있는 동안, 스크롤하면 캐릭터가 곧은 길을 따라 가장 오래된 지점에서 최신 지점으로 걸어 내려간다.
// 길은 가로로 누운 원통(드럼) 겉면에 그려져 있어, 화면 가운데가 원통의 정면이고 위아래 끝으로 갈수록 길이 눌려 보이다 넘어간다.
// 캐릭터는 첫 지점에서 화면 가운데에 선 채로 있고, 원통이 위로 돌아 길이 올라온다. 크기는 모두 격자 칸 단위
const GAP = 36 // 이웃한 지점 사이 길 길이
const SCROLL_PER_CELL = 2 // 길 한 칸을 걷는 데 드는 스크롤
const PATH = 3
// 지점 표시 — FRAME 칸 정사각형의 네 꼭짓점을 한 칸씩 깎고, 제목 글자색 한 칸 테두리 안에 한 칸 흰 여백을 두고
// 기관 로고를 넣는다. 아랫줄이 길에 닿는다
const FRAME = 11
const PATH_X = (FRAME - 1) / 2 // 길 가운데 열 — 지점 액자가 왼쪽 끝에 딱 붙는다
const STEP = 3 // 걸음 하나에 걷는 길 — 걸음마다 캐릭터를 좌우로 뒤집어 걷는 것처럼 보이게 한다
const GROUND_GAP = 4 // 길 양옆 풀포기 사이 — 원통이 도는 게 보이게 한다

// 캐릭터는 앞(내려갈 때)·뒤(올라갈 때) 두 모습. 한쪽 발을 든 모습이라 좌우로 뒤집으면 다른 발을 든다
const CHARACTER_COLORS = {
  h: "fill-amber-700",
  s: "fill-orange-200",
  e: "fill-gray-950",
  b: "fill-rose-400",
  p: "fill-blue-600",
  f: "fill-gray-950",
}
const CHARACTER = {
  front: [
    ".hhhhh.",
    "hhhhhhh",
    "hsssssh",
    "hsesesh",
    ".sssss.",
    ".bbbbb.",
    "sbbbbbs",
    ".bbbbb.",
    ".pp.pp.",
    ".pp.ff.",
    ".ff....",
  ],
  back: [
    ".hhhhh.",
    "hhhhhhh",
    "hhhhhhh",
    "hhhhhhh",
    ".hhhhh.",
    ".bbbbb.",
    "sbbbbbs",
    ".bbbbb.",
    ".pp.pp.",
    ".pp.ff.",
    ".ff....",
  ],
}

// 마지막 지점이 진행 중(Present)이 아니면 그 다음 칸에 침대를 둔다. 캐릭터가 거기 닿은 뒤 SLEEP 칸만큼 더 스크롤하는 동안
// 이불을 걷고, 눕고, 이불을 덮어 잠들고(BED_STEPS 차례), 머리 위로 Z 가 떠오른다. 거꾸로 스크롤하면 거꾸로 일어난다.
// 누운 모습은 오른쪽을 보는 옆모습을 머리가 왼쪽, 얼굴이 위로 가게 반듯이 눕힌 것이다
const SLEEP = 15
const BED_COLORS = {
  ...CHARACTER_COLORS,
  w: "fill-amber-800",
  P: "fill-white",
  m: "fill-gray-100",
  q: "fill-sky-500",
}
const BED_STEPS = [
  // 정리된 침대
  [
    "w............",
    "w............",
    "w............",
    "w...........w",
    "w...........w",
    "wPPP........w",
    "wPPPqqqqqqqqw",
    "wmmmmmmmmmmmw",
    "wwwwwwwwwwwww",
    "w...........w",
  ],
  // 이불을 발치로 걷음
  [
    "w............",
    "w............",
    "w............",
    "w...........w",
    "w...........w",
    "wPPP.....qqqw",
    "wPPP.....qqqw",
    "wmmmmmmmmmmmw",
    "wwwwwwwwwwwww",
    "w...........w",
  ],
  // 누움 — 이불은 발치에
  [
    "w............",
    "w.hss......f.",
    "whhses.....f.",
    "whhsssbbsqqqw",
    "whhhssbbbqqqw",
    "whhhhsbbbqqqw",
    "w.hhh.bbbqqqw",
    "wmmmmmmmmmmmw",
    "wwwwwwwwwwwww",
    "w...........w",
  ],
  // 이불을 반쯤 덮음
  [
    "w............",
    "w.hss......q.",
    "whhses.....q.",
    "whhsssbbqqqqw",
    "whhhssbbqqqqw",
    "whhhhsbbqqqqw",
    "w.hhh.bbqqqqw",
    "wmmmmmmmmmmmw",
    "wwwwwwwwwwwww",
    "w...........w",
  ],
  // 이불을 다 덮고 잠
  [
    "w............",
    "w.hss......q.",
    "whhses.....q.",
    "whhsssqqqqqqw",
    "whhhssqqqqqqw",
    "whhhhsqqqqqqw",
    "w.hhh.qqqqqqw",
    "wmmmmmmmmmmmw",
    "wwwwwwwwwwwww",
    "w...........w",
  ],
]
// 처음 두 차례는 아직 서 있다 (침대가 캐릭터 앞에 그려져 침대 너머에서 이불을 걷는다)
const LIE_DOWN_STEP = 2
// 침대는 액자보다 넓어 가운데를 길에 맞추면 왼쪽이 잘리므로, 왼쪽 끝을 액자 왼쪽 끝(0 열)에 맞춘다
const BED_WIDTH = BED_STEPS[0][0].length
const Z = ["1111", "..1.", ".1..", "1111"]
const Z_DELAY_MS = 800

const TEXT_X = PATH_X + (FRAME + 1) / 2 + 3 // 지점 글이 시작하는 열 — 액자 오른쪽에서 세 칸 띄운다

const cells = (n) => `calc(var(--cell) * ${n})`

// 원근 — 원통 정면에서 원통 반지름의 DEPTH 배만큼 떨어진 눈으로 본다. 정면에서 멀어질수록(원통 위아래로 돌아갈수록)
// 작아지고, 화면 가운데 열 쪽으로 모이며, 원통 윤곽(horizon)을 넘으면 뒤로 넘어가 안 보인다.
// 원통 반지름은 윤곽이 원통 칸의 위아래 끝에 오도록 정한다
const DEPTH = 0.8

function drum(rows, cols) {
  const horizon = Math.acos(1 / (1 + DEPTH)) // 윤곽이 되는 각도 — 여기서 화면 높이가 가장 크다
  const edge = (DEPTH * Math.sin(horizon)) / (1 + DEPTH - Math.cos(horizon))
  const radius = rows / 2 / edge
  const shape = (angle) => {
    const scale = DEPTH / (DEPTH + 1 - Math.cos(angle))
    return { y: radius * Math.sin(angle) * scale, scale }
  }
  // 원통 정면에서 길 따라 distance 칸 떨어진 곳 — 화면 가운데에서 몇 칸 위아래인지, 얼마나 작고 흐린지 (넘어가면 null)
  const project = (distance) => {
    const angle = distance / radius
    if (Math.abs(angle) >= horizon) return null
    const fade = (Math.cos(angle) - Math.cos(horizon)) / (1 - Math.cos(horizon))
    return { ...shape(angle), fade }
  }
  // 화면 가운데에서 y 칸 위아래에 보이는 원통 각도 (윤곽 안에서는 y 가 각도를 따라 늘기만 하므로 반씩 좁혀 찾는다)
  const angleAt = (y) => {
    let [low, high] = [-horizon, horizon]
    for (let i = 0; i < 24; i++) {
      const mid = (low + high) / 2
      if (shape(mid).y < y) low = mid
      else high = mid
    }
    return (low + high) / 2
  }
  // 정면에서 x 열에 있는 것이 scale 만큼 작아졌을 때 서는 열 — 가운데 열 쪽으로 모인다
  const columnAt = (x, scale) => cols / 2 + (x - cols / 2) * scale
  return { radius, horizon, project, angleAt, columnAt }
}

// 섹션 안으로 스크롤한 만큼 걸은 길(칸)과, 마지막으로 움직인 방향의 캐릭터 모습.
// 섹션의 실제 스크롤 범위에 비례해 재므로 스크롤 끝에서 꼭 length 에 닿는다.
// 섹션 밖에서는 값이 그대로라 다시 그리지 않는다
function useWalk(sectionRef, length) {
  const [walk, setWalk] = useState({ walked: 0, facing: "front" })
  useEffect(() => {
    const update = () => {
      const section = sectionRef.current
      const range = section.offsetHeight - window.innerHeight
      const walked = Math.min(Math.max(-section.getBoundingClientRect().top / range, 0), 1) * length
      setWalk((prev) =>
        walked === prev.walked ? prev : { walked, facing: walked > prev.walked ? "front" : "back" },
      )
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [sectionRef, length])
  return walk
}

// 원통이 보이는 칸 수 (화면 높이에서 제목을 뺀 만큼, 본문 폭)
function useDrumSize(ref) {
  const [size, setSize] = useState({ rows: 0, cols: 0 })
  useEffect(() => {
    const observer = new ResizeObserver(() =>
      setSize({
        rows: Math.floor(ref.current.clientHeight / cellPx()),
        cols: Math.round(ref.current.clientWidth / cellPx()),
      }),
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref])
  return size
}

export function VitaeSection({ id, title, items }) {
  const stops = useMemo(
    () =>
      items
        .filter((item) => item.selected !== false)
        .sort(compareItemsByDateThenAlphabetical)
        .reverse(),
    [items],
  )
  // 마지막 지점이 진행 중이면 거기서 길이 끝나고, 아니면 그 다음 칸 침대까지 간다
  const resting = stops.at(-1)?.end !== "Present"
  const pathEnd = (resting ? stops.length : stops.length - 1) * GAP
  const sectionRef = useRef(null)
  const drumRef = useRef(null)
  const walkEnd = pathEnd + (resting ? SLEEP : 0)
  const { walked, facing } = useWalk(sectionRef, walkEnd)
  const { rows, cols } = useDrumSize(drumRef)
  const [openMd, setOpenMd] = useState(null)

  // 원통 모양과 화면 줄마다 보이는 길 위 거리는 크기에만 달려 있어, 스크롤마다 다시 구하지 않는다
  const { radius, horizon, project, columnAt, rowDistances } = useMemo(() => {
    const shape = drum(rows, cols)
    const rowDistances = Array.from({ length: rows }, (_, row) => shape.angleAt(row + 0.5 - rows / 2) * shape.radius)
    return { ...shape, rowDistances }
  }, [rows, cols])
  const center = rows / 2
  // 원통 위 한 점이 서 있는 화면 줄 (원통 칸 기준)
  const rowAt = (y) => Math.round(center + y)
  // 원근으로 작아진 그림을 놓는 자리 — 정면에서 x 열에 서는 그림의 아래 가운데가 원통 위 그 점에 오도록 하고,
  // 그 점을 기준으로 줄인다. width 는 그림 폭 (칸)
  const placeAt = (x, seen, width, height) => ({
    left: cells(columnAt(x, seen.scale) - width / 2),
    top: cells(rowAt(seen.y) - height),
    transformOrigin: "50% 100%",
    transform: `scale(${seen.scale})`,
  })

  // 원통 정면은 언제나 캐릭터가 선 곳이다
  const camera = Math.min(walked, pathEnd)
  const heroLeft = PATH_X - (CHARACTER.front[0].length - 1) / 2
  const heroTop = rowAt(0) - CHARACTER.front.length
  const bed = resting && project(pathEnd - camera)
  // 침대에 닿으면 잘 채비를 시작한다
  const arrived = walked >= pathEnd
  const bedStep = resting && arrived ? Math.min(Math.floor(((walked - pathEnd) / SLEEP) * BED_STEPS.length), BED_STEPS.length - 1) : 0
  const lying = bedStep >= LIE_DOWN_STEP
  const asleep = bedStep === BED_STEPS.length - 1
  // 진행 중인 마지막 지점에 닿으면 그 액자 안으로 들어가 사라진다
  const inside = !resting && arrived

  // 화면 줄마다 원통 위 어느 지점이 보이는지 거꾸로 따져, 길이 있는 줄만 칠한다. 멀수록 좁고 가운데로 모이며 흐리다
  const ground = []
  rowDistances.forEach((distance, row) => {
    const along = camera + distance
    if (along < 0 || along > pathEnd) return
    const seen = project(distance)
    const middle = columnAt(PATH_X + 0.5, seen.scale)
    const left = Math.round(middle - (PATH * seen.scale) / 2)
    const right = Math.max(Math.round(middle + (PATH * seen.scale) / 2), left + 1)
    ground.push({ row, left, width: right - left, fade: seen.fade })
  })

  // 풀포기는 길 양옆에 번갈아 GROUND_GAP 칸마다, 길 끝 너머까지 원통 겉면 전체에 심는다
  const reach = horizon * radius
  for (let k = Math.ceil((camera - reach) / GROUND_GAP); k * GROUND_GAP < camera + reach; k++) {
    const seen = project(k * GROUND_GAP - camera)
    if (!seen) continue
    const left = Math.floor(columnAt((k % 2 ? PATH_X + 4 : PATH_X - 4) + 0.5, seen.scale))
    ground.push({ row: rowAt(seen.y) - 1, left, width: 1, fade: seen.fade })
  }

  return (
    <section
      id={id}
      ref={sectionRef}
      className="px-cell-1"
      style={{ height: `calc(100dvh + ${cells(walkEnd * SCROLL_PER_CELL)})` }}
    >
      <div className="sticky top-0 flex h-dvh flex-col">
        {/* 위에 붙은 연락처 배지 아래에서 제목을 시작한다 */}
        <div className="h-cell-14 shrink-0" />
        <PixelTitle className="text-fg-strong">{title}</PixelTitle>
        <div className="h-cell-4" />

        <div ref={drumRef} className="relative min-h-0 flex-1 overflow-hidden">
          {rows > 0 && (
            <>
              <svg
                aria-hidden
                viewBox={`0 0 ${cols} ${rows}`}
                shapeRendering="crispEdges"
                className="absolute top-0 left-0"
                style={{ width: cells(cols), height: cells(rows) }}
              >
                {ground.map(({ row, left, width, fade }, i) => (
                  <rect
                    key={i}
                    x={left}
                    y={row}
                    width={width}
                    height="1"
                    className="fill-bg-light"
                    opacity={Math.ceil(fade * 4) / 4}
                  />
                ))}
              </svg>

              {stops.map((stop, i) => {
                const seen = project(i * GAP - camera)
                if (!seen) return null
                // 아직 닿지 않은 액자는 캐릭터 앞에 그려 캐릭터가 그 뒤로 들어가고, 닿거나 지나친 액자에서는 앞으로 나온다.
                // 진행 중인 마지막 지점은 닿아도 앞으로 나오지 않는다
                const ahead = walked < i * GAP || (!resting && i === stops.length - 1)
                return (
                  <Fragment key={stop.id ?? stop.title}>
                    <div
                      className={cn("absolute pixel-corners bg-fg-strong p-cell-1", ahead ? "z-20" : "z-0")}
                      style={{
                        ...placeAt(PATH_X + 0.5, seen, FRAME, FRAME),
                        width: cells(FRAME),
                        height: cells(FRAME),
                        opacity: seen.fade,
                      }}
                    >
                      {/* 안쪽 흰 판도 꼭짓점을 깎아, 바깥 테두리 색이 비쳐 모서리가 얇아 보이지 않게 한다 */}
                      <div className="size-full bg-white p-cell-1 pixel-corners">
                        <img src={stop.logo} alt="" className="size-full object-contain" />
                      </div>
                    </div>
                    <div
                      role={stop.md ? "button" : undefined}
                      tabIndex={stop.md ? 0 : undefined}
                      onClick={stop.md ? () => setOpenMd(stop.md) : undefined}
                      className={cn(
                        "absolute flex -translate-y-full flex-col gap-cell-1 outline-none",
                        stop.md && interactiveRowClass,
                      )}
                      // 글 아래끝을 액자 아래끝(길에 닿은 줄)에 맞추고, 그 점을 기준으로 액자와 같은 비율로 줄어든다.
                      // 폭은 정면에서 본문 오른쪽 끝까지
                      style={{
                        left: cells(columnAt(TEXT_X, seen.scale)),
                        top: cells(rowAt(seen.y)),
                        width: cells(cols - TEXT_X),
                        transformOrigin: "0 100%",
                        transform: `scale(${seen.scale})`,
                        opacity: seen.fade,
                      }}
                    >
                      <h3 className={cn("text-base/normal font-normal text-fg-strong", rowTitleHoverClass)}>
                        {stop.title}
                      </h3>
                      {stop.subtitle && (
                        <small className="text-xs/normal font-normal text-fg-muted">{stop.subtitle}</small>
                      )}
                      {stop.start && (
                        <small className="text-xs/normal font-normal text-fg-muted">
                          {stop.end ? `${stop.start} – ${stop.end}` : stop.start}
                        </small>
                      )}
                    </div>
                  </Fragment>
                )
              })}

              {!lying && !inside && (
                <PixelBitmap
                  rows={CHARACTER[facing]}
                  colors={CHARACTER_COLORS}
                  className={cn("pointer-events-none absolute z-10", Math.floor(camera / STEP) % 2 && "-scale-x-100")}
                  style={{ left: cells(heroLeft), top: cells(heroTop) }}
                />
              )}

              {/* 침대도 액자처럼, 닿기 전에는 캐릭터 앞에 그린다 */}
              {bed && (
                <PixelBitmap
                  rows={BED_STEPS[bedStep]}
                  colors={BED_COLORS}
                  className="pointer-events-none absolute z-20"
                  style={{ ...placeAt(BED_WIDTH / 2, bed, BED_WIDTH, BED_STEPS[0].length), opacity: bed.fade }}
                />
              )}
              {/* 자는 머리 위로 Z 셋이 차례로 떠오르며 사라진다 */}
              {asleep &&
                [0, 1, 2].map((i) => (
                  <PixelBitmap
                    key={i}
                    rows={Z}
                    className="pointer-events-none absolute z-20 animate-zzz text-fg-strong opacity-0"
                    style={{
                      left: cells(2), // 베개 위 머리 위
                      top: cells(rowAt(0) - BED_STEPS[0].length - Z.length),
                      animationDelay: `${i * Z_DELAY_MS}ms`,
                    }}
                  />
                ))}
            </>
          )}
        </div>
      </div>

      <Modal open={Boolean(openMd)} onClose={() => setOpenMd(null)}>
        <MarkdownRenderer content={openMd ?? ""} />
      </Modal>
    </section>
  )
}
