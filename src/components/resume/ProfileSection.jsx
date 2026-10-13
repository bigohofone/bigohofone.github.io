import { Fragment, useEffect, useRef, useState } from "react"
import { Check } from "lucide-react"
import { ArrowDown, Contact } from "pixelarticons/react"
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi"

import { toolbarButtonClass } from "@/components/ui/chip"
import { PixelTitle } from "@/components/ui/pixel-title"
import { GoogleScholarIcon, MailIcon } from "@/components/ui/icons"
import { cn } from "@/lib/utils"
import { contact } from "@/data/contact"
import { profile } from "@/data/profile"

// 둘레를 따라 petals 개의 볼록한 물결이 도는 원의, 각도별 반지름 (원 반지름에 대한 비율).
// 물결은 depth(%) 만큼 안으로 파인다. 기본은 골까지 둥글게 이어지는 물결이고, pinched 면 골이 안으로 꼬집힌 꽃잎 모양이 된다
function wavyRadius(petals, depth, pinched = false) {
  return (angle) => {
    const wave = pinched ? Math.abs(Math.cos((petals / 2) * angle)) : (1 + Math.cos(petals * angle)) / 2
    return (50 - depth + depth * wave) / 50
  }
}

// 사진 배지는 뾰족한 데 없이 잔물결이 도는 가리비(scallop) 원, 이니셜 배지는 꽃잎이 깊게 파인 꽃 모양
// notched 는 원이 아니라 네 꼭짓점 칸만 깎은 사각형이다 (pixelMask 에서 따로 그린다).
// morph-t 는 사진 배지(scallop)에서 연락 메뉴 배지(사각형)로 바뀌는 중간 모양 — 각도마다 두 반지름을 t 만큼 섞는다
const squareRadius = (angle) => 1 / Math.max(Math.abs(Math.cos(angle)), Math.abs(Math.sin(angle)))
const SHAPES = {
  circle: () => 1,
  scallop: wavyRadius(12, 5),
  flower: wavyRadius(8, 16, true),
}

// 모든 원은 격자(한 칸 = UNIT) 위에 픽셀처럼 그린다. cells × cells 칸 중 모양 안에 드는 칸만 남기는 마스크를
// 줄마다 이어진 칸을 사각형 하나로 묶은 SVG 로 만든다. 같은 모양·크기는 다시 만들지 않는다
const maskCache = new Map()

function pixelMask(shape, cells) {
  const key = `${shape}-${cells}`
  if (!maskCache.has(key)) {
    const rects = []
    for (let row = 0; row < cells; row++) {
      let start = null
      for (let col = 0; col <= cells; col++) {
        const dx = ((col + 0.5) / cells) * 2 - 1
        const dy = ((row + 0.5) / cells) * 2 - 1
        const corner = (col === 0 || col === cells - 1) && (row === 0 || row === cells - 1)
        const angle = Math.atan2(dy, dx)
        const radius = shape.startsWith("morph-")
          ? lerp(SHAPES.scallop(angle), squareRadius(angle), Number(shape.slice(6)))
          : shape !== "notched" && SHAPES[shape](angle)
        const inside = col < cells && (shape === "notched" ? !corner : Math.hypot(dx, dy) <= radius)
        if (inside && start === null) start = col
        if (!inside && start !== null) {
          rects.push(`<rect x="${start}" y="${row}" width="${col - start}" height="1"/>`)
          start = null
        }
      }
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cells} ${cells}" shape-rendering="crispEdges">${rects.join("")}</svg>`
    maskCache.set(key, `url("data:image/svg+xml,${encodeURIComponent(svg)}")`)
  }
  return maskCache.get(key)
}

// 이니셜 배지 글자. 한 칸 = 격자 한 칸인 5×7 도트 글꼴로, 배지와 같은 격자 위에 찍는다
const PIXEL_WJ = [
  ".1...1." + "..111",
  ".1...1." + "...1.",
  ".1...1." + "...1.",
  ".1.1.1." + "...1.",
  ".1.1.1." + "1..1.",
  ".11.11." + "1..1.",
  ".1...1." + ".11..",
]

function PixelWJ({ cells }) {
  const left = Math.floor((cells - PIXEL_WJ[0].length) / 2)
  const top = Math.floor((cells - PIXEL_WJ.length) / 2)
  return (
    <svg
      viewBox={`0 0 ${cells} ${cells}`}
      shapeRendering="crispEdges"
      className="absolute inset-0 size-full fill-current"
      aria-label="WJ"
    >
      {PIXEL_WJ.flatMap((row, y) =>
        [...row].map(
          (dot, x) => dot === "1" && <rect key={`${x}-${y}`} x={left + x} y={top + y} width="1" height="1" />,
        ),
      )}
    </svg>
  )
}

// 로딩 숫자용 3×5 도트 글꼴
const PIXEL_DIGITS = {
  0: ["111", "101", "101", "101", "111"],
  1: ["010", "110", "010", "010", "111"],
  2: ["111", "001", "111", "100", "111"],
  3: ["111", "001", "111", "001", "111"],
  4: ["101", "101", "111", "001", "001"],
  5: ["111", "100", "111", "001", "111"],
  6: ["111", "100", "111", "101", "111"],
  7: ["111", "001", "001", "001", "001"],
  8: ["111", "101", "111", "101", "111"],
  9: ["111", "101", "111", "001", "111"],
  "%": ["101", "001", "010", "100", "101"],
}
const textWidth = (text) => text.length * 4 - 1

// 배지 안을 왼쪽부터 한 칸 열씩 라임색으로 채우는 게이지와 가운데 퍼센트 숫자.
// 숫자는 "100%" 가 놓일 자리에 오른쪽을 맞춰 두어, 자리수가 늘어도 % 는 움직이지 않는다.
// 글자 칸은 라임 게이지 위에서는 어둡게, 회색 바탕에서는 밝게 찍는다
function LoadingGauge({ cells, progress }) {
  const filled = Math.floor(progress * cells)
  const text = `${Math.round(progress * 100)}%`
  const left = Math.floor((cells - textWidth("100%")) / 2) + textWidth("100%") - textWidth(text)
  const top = Math.floor((cells - 5) / 2)
  return (
    <svg
      viewBox={`0 0 ${cells} ${cells}`}
      shapeRendering="crispEdges"
      className="absolute inset-0 size-full"
      aria-hidden="true"
    >
      <rect width={filled} height={cells} className="fill-primary" />
      {[...text].flatMap((char, i) =>
        PIXEL_DIGITS[char].flatMap((row, y) =>
          [...row].map((dot, x) => {
            const col = left + i * 4 + x
            return (
              dot === "1" && (
                <rect
                  key={`${i}-${x}-${y}`}
                  x={col}
                  y={top + y}
                  width="1"
                  height="1"
                  className={col < filled ? "fill-lime-950" : "fill-fg-strong"}
                />
              )
            )
          }),
        ),
      )}
    </svg>
  )
}

// 스크롤을 권하는 아래 화살표. 다른 픽셀 아이콘처럼 pixelarticons 아이콘 픽셀 하나를 글자 픽셀 하나로 그린다 —
// 24 격자에 2단위 픽셀로 가로 5~19 · 세로 4~20 사이에 7×8 픽셀이 그려져 있어 그 부분만 잘라 쓴다.
// 화면 아래쪽 가운데, 아래에서 네 칸 위에 격자에 맞춰 띄운다. 화면 가운데가 칸 경계라 7픽셀 폭은 왼쪽으로 4픽셀부터 놓는다
function ScrollArrow() {
  const bottomCells = Math.floor(window.innerHeight / 2 / cellPx()) - 4 - 4
  return (
    <ArrowDown
      viewBox="5 4 14 16"
      shapeRendering="crispEdges"
      aria-hidden="true"
      className="absolute animate-bob text-white"
      style={{
        left: "calc(50% - 4 * var(--font-px))",
        top: `calc(50% + ${bottomCells} * ${UNIT})`,
        width: "calc(7 * var(--font-px))",
        height: "calc(8 * var(--font-px))",
      }}
    />
  )
}

function maskStyle(shape, cells) {
  const mask = pixelMask(shape, Math.max(cells, 1))
  return {
    maskImage: mask,
    WebkitMaskImage: mask,
    maskSize: "100% 100%",
    WebkitMaskSize: "100% 100%",
  }
}

const ICON_MAP = {
  Email: MailIcon,
  GitHub: FiGithub,
  "Google Scholar": GoogleScholarIcon,
  LinkedIn: FiLinkedin,
  "X (Twitter)": FiTwitter,
}

// 연락처 아이콘 원의 색. 서비스마다 대표 색을 쓰고, 메일만 밝은 회색이다
const ICON_COLORS = {
  Email: "bg-gray-200 text-gray-900",
  GitHub: "bg-[#24292f] text-white",
  "Google Scholar": "bg-[#ea4335] text-white",
  LinkedIn: "bg-[#0a66c2] text-white",
  "X (Twitter)": "bg-[#1da1f2] text-white",
}

const LINKS = contact.items.filter((item) => ICON_MAP[item.label])

// 원 묶음은 화면 가운데의 경계 원(지름 = 본문 폭) 안에 원을 채운다. 배치는 경계 원을 감싸는 100×100 판 좌표로 하고
// ((50, 50) 이 화면 가운데), 그릴 때 판 1 을 본문 폭/100 칸으로 바꿔 격자(한 칸 = UNIT, index.css 의 --cell)에 맞춘다.
// 화면 폭 구간마다 한 칸 크기와 본문 칸 수가 정해져 있다 (index.css 와 같은 값):
// 720px 이상은 8px × 90칸, 그 아래는 6px × 60칸.
// 창 크기가 바뀌어도 다시 배치할 필요 없이 같은 배치를 새 칸 수로 바꿔 그린다. 화면이 경계 원보다 낮으면 원 위아래가 잘린다
const UNIT = "var(--cell)"

function cellPx() {
  return window.innerWidth >= 720 ? 8 : 6
}

function frameCells() {
  return window.innerWidth >= 720 ? 90 : 60
}

// 배치 판 1 이 몇 칸인지
function boardScale() {
  return frameCells() / 100
}

// 원마다 GAP 의 절반씩 여백을 두르고 여백끼리 맞닿게 붙여서, 보이는 원 사이에는 GAP 만큼 틈이 남는다.
// 판 2 는 60칸 화면에서도 1칸 넘게 남아, 칸에 맞추며 생기는 어긋남이 있어도 원끼리 겹치지 않는다
const GAP = 2

// 반지름 r 인 원이 경계 원 안에 들도록 경계를 r 만큼 줄여서 잰, 가운데로부터 경계까지의 비율 (1 이하면 안쪽)
function boundaryReach(x, y, r) {
  return distanceFromCenter(x, y) / (50 - r)
}

// 아래 원 지름들에 곱하는 배율
const SIZE_SCALE = 1.25

// 원의 지름. 배지를 뺀 사진과 단색 원은 CIRCLE_SIZES, 연락처 아이콘은 ICON_SIZES 중에서 무작위로 고른다
const BADGE_SIZE = 28
const CIRCLE_SIZES = [20, 16, 12, 8]
const ICON_SIZES = [12, 8]
const MONOGRAM_SIZE = 20

// 사진 7 개 뒤에 연락처 아이콘 5 개, 이니셜 배지가 이어지고, 그 뒤로 단색 원이 붙는다
const ICON_START = profile.images.length
const MONOGRAM_INDEX = ICON_START + LINKS.length
const MAIN_COUNT = MONOGRAM_INDEX + 1

// 두 원에 동시에 맞닿는 반지름 r 인 원의 중심 (두 원 둘레를 r 만큼 키운 원의 교점)
function touchingBoth(a, b, r) {
  const d = Math.hypot(b.x - a.x, b.y - a.y)
  const ra = a.r + r
  const rb = b.r + r
  if (d > ra + rb || d < Math.abs(ra - rb)) return []

  const along = (ra * ra - rb * rb + d * d) / (2 * d)
  const across = Math.sqrt(ra * ra - along * along)
  const ux = (b.x - a.x) / d
  const uy = (b.y - a.y) / d
  const mx = a.x + along * ux
  const my = a.y + along * uy
  return [
    { x: mx - across * uy, y: my + across * ux },
    { x: mx + across * uy, y: my - across * ux },
  ]
}

function distanceFromCenter(x, y) {
  return Math.hypot(x - 50, y - 50)
}

// 원들을 넓이로 가중한 무게중심이 화면 가운데에서 벗어난 정도
function imbalance(circles) {
  const weight = circles.reduce((sum, c) => sum + c.r * c.r, 0)
  const x = circles.reduce((sum, c) => sum + c.x * c.r * c.r, 0) / weight
  const y = circles.reduce((sum, c) => sum + c.y * c.r * c.r, 0) / weight
  return distanceFromCenter(x, y)
}

// anchors 중 하나에 맞닿으면서 경계 안에 들고 다른 원과 겹치지 않는, 반지름 r 인 원의 자리들
function freeSpots(placed, anchors, r) {
  const candidates = anchors.flatMap((a) => [
    ...Array.from({ length: 36 }, (_, k) => ({
      x: a.x + (a.r + r) * Math.cos((k * Math.PI) / 18),
      y: a.y + (a.r + r) * Math.sin((k * Math.PI) / 18),
    })),
    ...placed.filter((b) => b !== a).flatMap((b) => touchingBoth(a, b, r)),
  ])
  return candidates.filter(
    (c) => boundaryReach(c.x, c.y, r) <= 1 && placed.every((p) => Math.hypot(p.x - c.x, p.y - c.y) >= p.r + r - 1e-6),
  )
}

// 사진과 섞는 단색 원은 몇 개뿐이다. 단색 원이 가운데 자리를 먼저 다 차지하면 뒤에 오는 사진이 들어갈 곳이 없기 때문이다
const MIXED_FILLERS = 6

// 놓을 순서: 큰 사진(배지), 연락처 아이콘, 이니셜 배지, 나머지 사진과 단색 원 몇 개를 무작위로 섞은 것.
// 그다음 남는 자리를 단색 원으로 채운다. 원 수를 줄이려고 가장 큰 원부터 들어갈 수 있는 만큼 넣고 더 작은 원으로 넘어간다.
// 배지는 가운데 두고, 나머지는 순서대로 이미 놓인 원에 맞닿으면서 경계 안에 드는 자리 중 가운데에 가장 가까운 곳에 놓는다.
// 아이콘은 배지에 맞닿게 하고, 무게중심이 가운데에 머무는 자리를 골라 배지 둘레에 고르게 펼친다.
// 아이콘이나 이니셜 배지가 들어갈 자리가 없으면 모든 원을 조금씩 줄여 다시 놓고, 자리가 없는 사진·단색 원은 빼 버린다
function packCircles(scale = 1) {
  const shuffle = (list) => list.sort(() => Math.random() - 0.5)
  const pick = (sizes) => sizes[Math.floor(Math.random() * sizes.length)] * SIZE_SCALE
  const photos = profile.images.slice(1).map((_, i) => ({ index: i + 1, size: pick(CIRCLE_SIZES) }))
  const icons = LINKS.map((_, i) => ({
    index: ICON_START + i,
    size: pick(ICON_SIZES),
  }))
  const fillers = Array.from({ length: MIXED_FILLERS }, (_, i) => ({
    index: MAIN_COUNT + i,
    size: pick(CIRCLE_SIZES),
  }))
  const queue = [
    ...icons,
    { index: MONOGRAM_INDEX, size: MONOGRAM_SIZE * SIZE_SCALE },
    ...shuffle([...photos, ...fillers]),
  ]

  const badgeSize = BADGE_SIZE * SIZE_SCALE * scale
  const badge = {
    x: 50,
    y: 50,
    r: (badgeSize + GAP) / 2,
    size: badgeSize,
    index: 0,
  }
  const placed = [badge]

  for (const { index, size: baseSize } of queue) {
    const isIcon = index >= ICON_START && index < MONOGRAM_INDEX
    const size = baseSize * scale
    const r = (size + GAP) / 2
    // 같은 점수인 자리가 여럿이면 매번 다른 자리가 뽑히도록 작은 무작위 값을 더한다
    const score = (c) =>
      (isIcon ? 2 * imbalance([...placed, { ...c, r }]) : distanceFromCenter(c.x, c.y)) + Math.random() * 0.5
    const scored = freeSpots(placed, isIcon ? [badge] : placed, r).map((c) => ({
      ...c,
      score: score(c),
    }))
    const best = scored.sort((c1, c2) => c1.score - c2.score)[0]

    if (!best && (isIcon || index === MONOGRAM_INDEX)) return packCircles(scale * 0.95)
    if (!best) continue
    placed.push({ x: best.x, y: best.y, r, size, index })
  }

  let fillerIndex = MAIN_COUNT + MIXED_FILLERS
  for (const baseSize of CIRCLE_SIZES) {
    const size = baseSize * SIZE_SCALE * scale
    const r = (size + GAP) / 2
    for (;;) {
      const spots = freeSpots(placed, placed, r)
      if (spots.length === 0) break
      const best = spots.sort((c1, c2) => distanceFromCenter(c1.x, c1.y) - distanceFromCenter(c2.x, c2.y))[0]
      placed.push({ x: best.x, y: best.y, r, size, index: fillerIndex++ })
    }
  }

  // 사진·아이콘은 제 번호 자리에 두고(자리가 없어 빠진 사진은 null), 단색 원은 그 뒤에 잇는다
  const circles = Array(MAIN_COUNT).fill(null)
  for (const { x, y, size, index } of placed) {
    const circle = { x, y, size }
    if (index < MAIN_COUNT) circles[index] = circle
    else circles.push(circle)
  }
  return circles
}

const HOVER_SCALE = 1.3

// 커진 원에 닿는 원을 밀어내고, 밀려난 원이 또 다른 원에 닿으면 그 원도 밀어낸다.
// 경계가 꽉 차 있으면 가장자리 원은 경계 밖으로 밀려날 수 있다 (화면 밖은 잘려 보인다)
function makeRoom(circles, grown) {
  const out = circles.map((c) => c && { ...c })
  out[grown].size *= HOVER_SCALE

  for (let step = 0; step < 30; step++) {
    out.forEach((a, i) =>
      out.forEach((b, j) => {
        if (j <= i || !a || !b) return
        const dx = b.x - a.x
        const dy = b.y - a.y
        const d = Math.hypot(dx, dy)
        const overlap = (a.size + b.size) / 2 + GAP - d
        if (overlap <= 0) return

        // 커진 원은 제자리에 두고, 나머지 둘이 부딪히면 반씩 물러난다
        const shareA = i === grown ? 0 : j === grown ? 1 : 0.5
        a.x -= (dx / d) * overlap * shareA
        a.y -= (dy / d) * overlap * shareA
        b.x += (dx / d) * overlap * (1 - shareA)
        b.y += (dy / d) * overlap * (1 - shareA)
      }),
    )
  }
  return out
}

const clamp01 = (value) => Math.min(Math.max(value, 0), 1)
const lerp = (from, to, t) => from + (to - from) * t

// 스크롤을 내리면 두 단계로 움직인다. 화면 높이만큼은 원 묶음이 제자리에 머물고, 그 뒤로 페이지가 올라간다.
// 1. 배지에 가까운 원부터 차례로 배지 쪽으로 빨려 들며 작아져 사라진다. 배지를 맨 위에 그려 원이 배지 뒤로 들어가 보이게 한다.
// 2. 배지만 남으면 페이지와 함께 위로 올라가며 작아지고, 화면 위에 닿으면 9칸 크기로 그 자리에 머문다.
// 위에 붙은 배지와 메뉴도 크기·간격을 모두 칸으로 정해, 화면 크기가 바뀌어도 픽셀 모양이 늘 같다
const BADGE_TOP_MARGIN = 2
const BADGE_FINAL_SIZE = 9

// finalSize: 위에 붙었을 때 배지 지름 (칸)
// spread: 첫 화면에서 원들이 배지 밖으로 퍼져 나온 정도 (0 이면 모두 배지 안, 1 이면 제자리). 가까운 원부터 나온다
function scrollCircles(circles, scrollY, finalSize, spread) {
  // 아래 계산은 배치 판 좌표로 한다. 칸으로 정한 크기·여백은 판 단위로 바꿔 쓴다
  const scale = boardScale()
  const unit = cellPx() * scale
  const absorbPx = window.innerHeight
  const absorb = clamp01(scrollY / absorbPx)
  const badge = circles[0]
  const out = [...circles]

  const others = circles
    .map((circle, index) => ({ circle, index }))
    .filter(({ circle, index }) => circle && index !== 0)
    .sort(
      (a, b) =>
        Math.hypot(a.circle.x - badge.x, a.circle.y - badge.y) - Math.hypot(b.circle.x - badge.x, b.circle.y - badge.y),
    )
  others.forEach(({ circle, index }, rank) => {
    const emerge = 1 - (1 - clamp01((spread - (rank / others.length) * 0.6) / 0.4)) ** 3
    const t = Math.max(clamp01((absorb - (rank / others.length) * 0.7) / 0.3), 1 - emerge)
    out[index] = {
      ...circle,
      x: lerp(circle.x, badge.x, t),
      y: lerp(circle.y, badge.y, t),
      size: circle.size * (1 - t),
      gone: t === 1,
    }
  })

  const travel = window.innerHeight / 2 / unit - (BADGE_TOP_MARGIN + finalSize / 2) / scale
  const rise = clamp01((scrollY - absorbPx) / unit / travel)
  out[0] = {
    ...badge,
    y: badge.y - rise * travel,
    size: lerp(badge.size, finalSize / scale, rise),
    morph: rise,
  }
  return out
}

// 판 좌표의 원을 격자에 맞춘다. 지름은 칸 수로 반올림하고, 화면 가운데를 원점으로 왼쪽·위 모서리를 칸 경계에 둔다
function snapCircle({ x, y, size }) {
  const scale = boardScale()
  const cells = Math.round(size * scale)
  return {
    cells,
    left: Math.round((x - 50) * scale - cells / 2),
    top: Math.round((y - 50) * scale - cells / 2),
  }
}

// 위로 올라가는 동안(morph 0 → 1) 사진 배지가 연락 메뉴 배지로 서서히 바뀐다. 마스크를 매번 새로 만들지 않게 20단계로 끊는다
function badgeShape(morph) {
  if (morph >= 1) return "notched"
  if (morph <= 0) return "scallop"
  return `morph-${Math.round(morph * 20) / 20}`
}

// 화면 가운데에서 UNIT 단위로 잰다. 창 크기가 바뀌어도 원끼리 겹치지 않고 묶음은 화면 가운데에 머문다
function circleStyle(circle, shape = "circle") {
  const { cells, left, top } = snapCircle(circle)
  return {
    left: `calc(50% + ${left} * ${UNIT})`,
    top: `calc(50% + ${top} * ${UNIT})`,
    width: `calc(${cells} * ${UNIT})`,
    visibility: circle.gone || cells === 0 ? "hidden" : undefined,
    ...maskStyle(shape, cells),
  }
}

// 호버로 커지고 줄어드는 움직임만 부드럽게 넘기고, 스크롤을 따라가는 동안에는 바로바로 움직인다
const circleClass =
  "pointer-events-auto absolute aspect-square rounded-none object-cover object-center transition-[left,top,width] duration-300 ease-out"

// 첫 화면 순서: 배지가 커진다(animate-grow) → 배지 안을 왼쪽부터 게이지가 칸 단위로 채우며 0~100% 를 보인다
// → 다 차면 100% 를 잠깐(SPREAD_PAUSE_MS) 보인 뒤 프로필 사진이 곧바로 배지를 덮고, 다른 원들이 SPREAD_MS 동안 배지 밖으로 퍼져 나온다.
// 게이지는 페이지(사진 등)가 다 불러와질 때까지 90% 에서 기다리고, 빨리 불러와져도 LOAD_MIN_MS 동안은 차오른다
const GROW_MS = 700
const LOAD_MIN_MS = 1500
const SPREAD_PAUSE_MS = 200
const SPREAD_MS = 1200

function useIntro() {
  const [intro, setIntro] = useState({ progress: 0, spread: 0 })
  useEffect(() => {
    let loaded = document.readyState === "complete"
    const onLoad = () => (loaded = true)
    window.addEventListener("load", onLoad)

    let frame
    let filledAt = null
    const start = performance.now() + GROW_MS
    const tick = (now) => {
      const progress = Math.min(clamp01((now - start) / LOAD_MIN_MS), loaded ? 1 : 0.9)
      if (progress === 1 && filledAt === null) filledAt = now
      const spread = filledAt === null ? 0 : clamp01((now - filledAt - SPREAD_PAUSE_MS) / SPREAD_MS)
      setIntro({ progress, spread })
      if (spread < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("load", onLoad)
    }
  }, [])
  return intro
}

// 원이 퍼질 때 배경에서 함께 번지는 파동. 원과 같은 격자(한 칸 = UNIT) 위에 픽셀로 그리고,
// 칸은 배경색 아니면 조금 더 어두운 색 두 가지뿐이다. 동심원이 가운데에서 밖으로 출렁이며 퍼지고 맨 앞 물마루가
// 한 번 짙어졌다 사그라드는데, 이 밝기를 어두운 칸의 밀도(4×4 순서 디더링)로 나타낸다
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
].map((row) => row.map((v) => (v + 0.5) / 16))

// 동심원 한 겹의 폭 (화면 긴 변에 대한 비율)
const WAVE_LENGTH = 0.3

// 칸마다 정해진 0~1 사이 값. 매 프레임 같은 칸은 같은 값이라 노이즈가 깜빡이지 않는다
function cellNoise(col, row) {
  const value = Math.sin(col * 127.1 + row * 311.7) * 43758.5453
  return value - Math.floor(value)
}

// 동심원이 1초에 이만큼(물결 한 겹에 대한 비율) 밖으로 흘러간다 — 원이 다 퍼진 뒤에도 사라질 때까지 계속 출렁인다
const WAVE_SPEED = 0.25

function PixelWave({ spread, opacity }) {
  const ref = useRef(null)
  const spreadRef = useRef(spread)
  spreadRef.current = spread
  const visible = opacity > 0

  // 보이는 동안 매 프레임 다시 그린다. 칸 수가 적어 매번 그려도 가볍고, 다 사라지면 멈춘다
  useEffect(() => {
    if (!visible) return
    let frame
    const draw = (now) => {
      const spread = spreadRef.current
      const cell = cellPx()
      // 짝수 칸으로 잡고 화면 가운데에 두어, 원들처럼 화면 가운데가 칸 경계가 되게 한다
      const cols = 2 * Math.ceil(window.innerWidth / cell / 2) + 2
      const rows = 2 * Math.ceil(window.innerHeight / cell / 2) + 2
      const canvas = ref.current
      canvas.width = cols
      canvas.height = rows
      canvas.style.width = `${cols * cell}px`
      canvas.style.height = `${rows * cell}px`

      const ctx = canvas.getContext("2d")
      ctx.fillStyle = "rgb(0 0 0 / 0.4)"
      const eased = 1 - (1 - spread) ** 3
      const waveLength = WAVE_LENGTH * Math.max(cols, rows)
      const reach = eased * Math.hypot(cols, rows) * 0.6
      const phase = (eased + (now / 1000) * WAVE_SPEED) * waveLength
      const crest = Math.sin(spread * Math.PI)

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const distance = Math.hypot(col + 0.5 - cols / 2, row + 0.5 - rows / 2)
          if (distance > reach) continue
          const ring = 0.5 + 0.5 * Math.cos((2 * Math.PI * (distance - phase)) / waveLength)
          const front = Math.max(0, 1 - (reach - distance) / 10) * crest
          const value = 0.75 * ring ** 0.7 + 0.35 * front + 0.2 * (cellNoise(col, row) - 0.5)
          if (value > BAYER[row % 4][col % 4]) ctx.fillRect(col, row, 1, 1)
        }
      }
      frame = requestAnimationFrame(draw)
    }
    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [visible])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 [image-rendering:pixelated]"
      style={{ opacity }}
    />
  )
}

// 첫 화면 연출(로딩 게이지 → 원이 퍼짐)이 끝날 때까지 페이지를 맨 위에 붙잡아 스크롤을 막는다.
// 새로고침하면 브라우저가 예전 스크롤 위치로 되돌리려 하므로, 그 복원을 끄고 맨 위에서 시작한다
function useLockScrollUntil(done) {
  useEffect(() => {
    if (done) return
    history.scrollRestoration = "manual"
    window.scrollTo(0, 0)
    const targets = [document.documentElement, document.body]
    targets.forEach((el) => (el.style.overflow = "hidden"))
    return () => targets.forEach((el) => (el.style.overflow = ""))
  }, [done])
}

// 소개 부분(이름·소개 글·CV 버튼)에서는 배경이 라임으로 바뀐다. 둘 다 화면 높이의 LIME_SPAN 만큼 스크롤하는 동안 일어난다.
// - 들어올 때: 소개 위끝이 화면 아래에 나타나면 화면 아래 가운데에서 라임 원이 자라 화면을 다 덮는다 (grow 0 → 1)
// - 나갈 때: 다음 섹션(News) 위끝이 화면 아래에 나타나면 라임이 화면 위 가운데로 모여드는 원이 되어 줄어 사라진다 (shrink 0 → 1)
// 스크롤할 때마다 다시 그려지므로 그때 잰다
const LIME_SPAN = 0.6

function introLime(el) {
  const next = document.getElementById("news")
  if (!el || !next) return { grow: 0, shrink: 0, nextTop: Infinity }
  const progress = (top) => clamp01((window.innerHeight - top) / (window.innerHeight * LIME_SPAN))
  const nextTop = next.getBoundingClientRect().top
  return { grow: progress(el.getBoundingClientRect().top), shrink: progress(nextTop), nextTop }
}

// 색은 라임 원과 따로, 소개 부분이 화면에 나타나는 순간 뒤집고 다음 섹션(News) 위끝이 화면 가운데를 넘어서면 되돌린다
// 뒤집는 곳은 소개 부분(이름·소개 글)과 CV 버튼 줄(#contact)뿐이다 (index.css 의 lime-section)
function limeColorsOn({ grow, nextTop }) {
  return grow > 0 && nextTop > window.innerHeight / 2
}

// CV 버튼 줄은 다른 컴포넌트(ContactSection)라 id 로 찾아 붙인다
function useLimeContact(on) {
  useEffect(() => {
    document.getElementById("contact")?.classList.toggle("lime-section", on)
  }, [on])
}

// 원 묶음과 같은 격자(한 칸 = UNIT)에 라임 칸을 찍는다. 라임은 아래 가운데에서 자라는 원과 위 가운데로 줄어드는 원이
// 겹치는 곳이고, 원 가장자리는 4×4 순서 디더링으로 픽셀이 흩어지며 번진다
const LIME_EDGE = 0.15 // 원 가장자리 번짐 폭 (화면을 다 덮는 반지름에 대한 비율)

function LimeFill({ grow, shrink }) {
  const ref = useRef(null)

  useEffect(() => {
    const cell = cellPx()
    const cols = 2 * Math.ceil(window.innerWidth / cell / 2) + 2
    const rows = 2 * Math.ceil(window.innerHeight / cell / 2) + 2
    const canvas = ref.current
    canvas.width = cols
    canvas.height = rows
    canvas.style.width = `${cols * cell}px`
    canvas.style.height = `${rows * cell}px`
    if (grow === 0 || shrink === 1) return

    const ctx = canvas.getContext("2d")
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--color-lime-300")
    // 캔버스는 화면 가운데에 놓여 위아래로 조금 넘친다. 두 원의 중심은 화면 아래 가운데와 화면 위 가운데
    const canvasTop = (window.innerHeight - rows * cell) / 2
    const bottomRow = (window.innerHeight - canvasTop) / cell
    const topRow = -canvasTop / cell
    const farthest = Math.hypot(cols / 2, bottomRow - topRow)
    // 반지름 radius(0~1) 원 안쪽이면 1 이상, 바깥이면 0 이하. 그 사이가 번지는 가장자리
    const inside = (col, row, centerRow, radius) =>
      (radius * (1 + LIME_EDGE) - Math.hypot(col + 0.5 - cols / 2, row + 0.5 - centerRow) / farthest) / LIME_EDGE
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const value = Math.min(inside(col, row, bottomRow, grow), inside(col, row, topRow, 1 - shrink))
        if (value > BAYER[row % 4][col % 4]) ctx.fillRect(col, row, 1, 1)
      }
    }
  })

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 [image-rendering:pixelated]"
    />
  )
}

// 스크롤 위치를 돌려준다. 창 크기가 바뀔 때도 다시 그리게 해 칸 수(frameCells)가 바뀐 배치를 새로 그린다
function useScrollY() {
  const [view, setView] = useState({ scrollY: 0, width: 0, height: 0 })
  useEffect(() => {
    const update = () => setView({ scrollY: window.scrollY, width: window.innerWidth, height: window.innerHeight })
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])
  return view.scrollY
}

// Email 은 메일 앱을 여는 대신 주소를 복사한다. 아이콘은 원 폭의 30% 로 잡아 원 크기를 따라간다
function ContactLink({ item, copied, onCopy, ...props }) {
  const Icon = item.label === "Email" && copied ? Check : ICON_MAP[item.label]
  const icon = <Icon className="h-auto w-[30%] stroke-2" aria-hidden="true" />

  return item.label === "Email" ? (
    <button type="button" onClick={() => onCopy(item.value)} aria-label="Copy email" {...props}>
      {icon}
    </button>
  ) : (
    <a href={item.link} target="_blank" rel="noopener noreferrer" aria-label={item.label} {...props}>
      {icon}
    </a>
  )
}

// 다 흡수된 배지를 누르면 연락처 아이콘이 배지 아래쪽 반원을 따라 펼쳐진다. 크기·간격은 칸 단위이고 자리도 칸에 맞춘다.
// 양 끝 아이콘은 배지 가운데와 같은 높이에 둔다
const MENU_ICON_SIZE = 8

// 메뉴 아이콘이 퍼지며 커지는 움직임이 같은 시간·같은 곡선으로 함께 끝나게 하고, 끝에서 살짝 튕긴다
const MENU_MOTION = "duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)]"
// 배지 가장자리에서 아이콘 가장자리까지. 반원 위 이웃한 아이콘(8칸)끼리 겹치지 않는 거리(가운데에서 약 11.8칸)보다
// 조금 넉넉하게 잡아, 펼쳐도 지나치게 퍼지지 않게 한다
const MENU_GAP = 5

function menuOffset(i, badgeRadius) {
  const distance = badgeRadius + MENU_GAP + MENU_ICON_SIZE / 2
  const angle = (Math.PI * i) / (LINKS.length - 1)
  return { dx: Math.cos(angle) * distance, dy: Math.sin(angle) * distance }
}

export function ProfileSection() {
  const [copied, setCopied] = useState(false)
  const [circles] = useState(packCircles)
  const [hovered, setHovered] = useState(null)
  const scrollY = useScrollY()
  const absorbed = scrollY >= window.innerHeight
  const [menuOpen, setMenuOpen] = useState(false)
  const { progress, spread } = useIntro()
  const introRef = useRef(null)
  const lime = introLime(introRef.current)
  const limeColors = limeColorsOn(lime)
  useLimeContact(limeColors)
  useLockScrollUntil(spread === 1)
  const shown = scrollCircles(
    hovered === null || absorbed ? circles : makeRoom(circles, hovered),
    scrollY,
    BADGE_FINAL_SIZE,
    spread,
  )
  const motion = (scrollY > 0 || spread < 1) && "transition-none"
  // 스크롤하면 메뉴를 닫는다
  useEffect(() => setMenuOpen(false), [scrollY])

  // 마우스를 올려도 메뉴를 펼친다. 배지에서 아이콘으로 옮겨 가는 사이 닫히지 않게 조금 늦게 닫는다.
  // 터치는 누르면 pointerenter 뒤에 click 이 바로 와서 열자마자 닫히므로, 마우스일 때만 다룬다
  const closeTimer = useRef(null)
  const openMenuOnHover = (event) => {
    if (event.pointerType !== "mouse" || !absorbed) return
    clearTimeout(closeTimer.current)
    setMenuOpen(true)
  }
  const closeMenuOnLeave = (event) => {
    if (event.pointerType !== "mouse") return
    closeTimer.current = setTimeout(() => setMenuOpen(false), 200)
  }

  const badge = shown[0]
  // 배지 가운데에서 (dx, dy) 칸 떨어진 자리에 지름 size 칸 원을 칸 경계에 맞춰 둔다 (화면 가운데 기준)
  const snappedBadge = snapCircle(badge)
  const aroundBadge = (dx, dy, size) => ({
    left: `calc(50% + ${Math.round(snappedBadge.left + snappedBadge.cells / 2 + dx - size / 2)} * ${UNIT})`,
    top: `calc(50% + ${Math.round(snappedBadge.top + snappedBadge.cells / 2 + dy - size / 2)} * ${UNIT})`,
    width: `calc(${size} * ${UNIT})`,
    ...maskStyle("circle", size),
  })

  const copyEmail = async (email) => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (error) {
      console.error("Failed to copy email:", error)
    }
  }

  return (
    <header id="bio" className="flex flex-col pb-cell-10">
      {/* 원 묶음은 화면에 고정해 두고, 이 빈 공간(첫 화면 + 흡수에 쓰는 화면 하나)만큼 스크롤한다 */}
      <div className="h-[200dvh]" />
      {/* 배경 파동은 본문 뒤에 두고, 스크롤해 원이 흡수되는 동안 서서히 사라진다 */}
      <PixelWave spread={spread} opacity={1 - clamp01(scrollY / window.innerHeight)} />
      <LimeFill grow={lime.grow} shrink={lime.shrink} />
      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
        {/* 다 흡수되면 배지가 라임색으로 바뀌고 링크 아이콘이 뜬다. 그 뒤로는 눌러서 연락처를 펼친다 */}
        <button
          type="button"
          aria-label="Show contact links"
          aria-expanded={menuOpen}
          onClick={() => absorbed && setMenuOpen((open) => !open)}
          className={cn(
            circleClass,
            motion,
            // 전역 버튼 누름 효과(filter·scale)가 걸리면 Chrome 이 모양을 무시하고 둥근 원으로 그려서 끈다
            // 칸 단위 크기를 지키도록 전역 버튼 최소 크기(44px)도 끈다
            "animate-grow min-h-0 min-w-0 overflow-hidden bg-bg-light active:scale-100 active:filter-none active:backdrop-filter-none",
            !absorbed && "cursor-default",
          )}
          style={{ ...circleStyle(badge, badgeShape(badge.morph)), zIndex: 1 }}
          onMouseEnter={() => setHovered(0)}
          onMouseLeave={() => setHovered(null)}
          onPointerEnter={openMenuOnHover}
          onPointerLeave={closeMenuOnLeave}
        >
          <img
            src={profile.images[0]}
            alt=""
            className={cn("size-full object-cover object-center", spread === 0 && "opacity-0")}
          />
          {spread === 0 && <LoadingGauge cells={snapCircle(badge).cells} progress={progress} />}
          <span
            className={cn("absolute inset-0 flex items-center justify-center bg-primary text-lime-950")}
            style={{ opacity: badge.morph }}
          >
            {/* pixelarticons 아이콘은 24 격자에 2단위 픽셀로 12×12 픽셀이 그려져 있다. 아이콘 픽셀 하나를 글자 픽셀 하나로
                그려 격자에 맞추고, 메뉴를 펼쳐 배지가 커져도 아이콘은 그 크기를 지킨다 */}
            <Contact
              shapeRendering="crispEdges"
              aria-hidden="true"
              style={{
                width: "calc(var(--font-px) * 12)",
                height: "calc(var(--font-px) * 12)",
              }}
            />
          </span>
        </button>

        {profile.images.map(
          (src, i) =>
            i > 0 &&
            shown[i] && (
              <img
                key={i}
                src={src}
                alt=""
                className={cn(circleClass, motion)}
                style={circleStyle(shown[i])}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            ),
        )}

        {LINKS.map((item, i) => {
          const index = profile.images.length + i
          return (
            <ContactLink
              key={item.label}
              item={item}
              copied={copied}
              onCopy={copyEmail}
              className={cn(toolbarButtonClass, circleClass, motion, "h-auto min-h-0 min-w-0", ICON_COLORS[item.label])}
              style={circleStyle(shown[index])}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            />
          )
        })}

        {LINKS.map((item, i) => {
          const { dx, dy } = menuOffset(i, snappedBadge.cells / 2)
          return (
            <ContactLink
              key={`menu-${item.label}`}
              item={item}
              copied={copied}
              onCopy={copyEmail}
              tabIndex={menuOpen ? 0 : -1}
              onPointerEnter={openMenuOnHover}
              onPointerLeave={closeMenuOnLeave}
              className={cn(
                toolbarButtonClass,
                circleClass,
                "h-auto min-h-0 min-w-0 transition-[left,top,opacity,scale]",
                MENU_MOTION,
                ICON_COLORS[item.label],
                !menuOpen && "pointer-events-none scale-0 opacity-0",
              )}
              style={menuOpen ? aroundBadge(dx, dy, MENU_ICON_SIZE) : aroundBadge(0, 0, MENU_ICON_SIZE)}
            />
          )
        })}

        <div
          className={cn(circleClass, motion, "bg-primary text-lime-950")}
          style={circleStyle(shown[MONOGRAM_INDEX], "flower")}
          onMouseEnter={() => setHovered(MONOGRAM_INDEX)}
          onMouseLeave={() => setHovered(null)}
        >
          {/* 글자 판은 배지의 원래 크기로 잡아, 배지가 커지고 줄어드는 대로 글자도 같은 비율로 따라간다 */}
          <PixelWJ cells={snapCircle(circles[MONOGRAM_INDEX]).cells} />
        </div>

        {shown.slice(MAIN_COUNT).map((circle, i) => (
          <div key={i} className={cn(circleClass, motion, "bg-bg-light")} style={circleStyle(circle)} />
        ))}

        {/* 원이 다 퍼진 뒤부터 다 흡수될 때까지만 보인다 */}
        {spread === 1 && !absorbed && <ScrollArrow />}

        {/* 첫 화면 인사말 — 원 묶음 바깥 빈자리에 쓴다. 원이 퍼지며 나타나고, 스크롤해 흡수되는 동안 사라진다.
            데스크톱(1080px 이상)은 원 왼쪽·오른쪽, 폰(720px 미만)은 원 위·아래에 두고,
            그 사이 화면은 원 옆자리가 글자보다 좁아 쓰지 않는다 */}
        <div
          style={{
            opacity: spread * (1 - clamp01(scrollY / window.innerHeight)),
          }}
        >
          {[
            [
              "Hello",
              "left-0 inset-y-0 w-[calc(50%-var(--cell)*var(--frame-cells)/2)] min-[1080px]:flex",
              "top-0 inset-x-0 h-[calc(50%-var(--cell)*var(--frame-cells)/2)] max-[719px]:flex",
            ],
            [
              "World!",
              "right-0 inset-y-0 w-[calc(50%-var(--cell)*var(--frame-cells)/2)] min-[1080px]:flex",
              "bottom-0 inset-x-0 h-[calc(50%-var(--cell)*var(--frame-cells)/2)] max-[719px]:flex",
            ],
          ].map(([word, desktop, mobile]) => (
            <Fragment key={word}>
              <span className={cn("absolute hidden items-center justify-center", desktop)}>
                <span className="pixel-title text-fg-strong">{word}</span>
              </span>
              <span className={cn("absolute hidden items-center justify-center", mobile)}>
                <span className="pixel-title text-fg-strong">{word}</span>
              </span>
            </Fragment>
          ))}
        </div>
      </div>
      <div className="h-cell-3" />

      {/* 소개 부분 — 라임 배경 위에 있는 동안 이 안의 색만 뒤집는다 (index.css 의 lime-section) */}
      <div ref={introRef} className={cn("px-cell-1", limeColors && "lime-section")}>
        <PixelTitle as="h1" className="text-fg-strong">
          {profile.name}
        </PixelTitle>
        <div className="h-cell-6" />

        <div className="space-y-cell-3 break-keep text-base/[1.8] font-normal text-fg-strong">
          <p>
            I am an Integrated M.S./Ph.D. Student at <a href="https://gsai.kaist.ac.kr/?lang=en">KAIST AI</a>, advised
            by <a href="https://hyunw.kim/">Hyunwoo Kim</a>.
          </p>

          <p>
            My research focuses on evaluating and enhancing the general reasoning capabilities of LLMs. Specifically, I
            investigate data-centric methodologies leveraging LLMs to synthesize and filter high-quality datasets to
            push model reasoning beyond existing capabilities. Beyond data curation, I study seemingly unmeasurable
            non-verifiable tasks, seeking out the measurable properties hidden within them and turning those properties
            into verifiable environments for LLM reasoning.
          </p>

          <p>
            Previously, I was a Research Intern at <a href="https://www.upstage.ai/">Upstage</a>, where I contributed to
            their Sovereign AI project. Working within the Coding Agent team, I helped develop the Solar Open2 and Solar
            Pro4 models.
          </p>
        </div>
      </div>
    </header>
  )
}
