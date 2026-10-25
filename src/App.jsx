import { useEffect, useState } from "react"

import Home from "@/pages/Home"

// 크레용으로 쓴 듯한 글씨 — 잘게 밀어 테두리를 까끌하게, 군데군데 덜 묻게 한다.
// 본문에 index.css 에서 건다
function CrayonText() {
  return (
    <svg aria-hidden="true" className="absolute size-0">
      <filter id="crayon-text" x="-1%" y="-1%" width="102%" height="102%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="51" result="fine" />
        <feDisplacementMap in="SourceGraphic" in2="fine" scale="1.05" xChannelSelector="R" yChannelSelector="G" result="rough" />
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="101" result="grain" />
        <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1.6 0 0 0 1.9" result="paper" />
        <feComposite in="rough" in2="paper" operator="in" />
      </filter>
    </svg>
  )
}

// 링크가 가는 곳 — 바깥 주소는 https:// 를 떼고, 메일은 주소만. 주소가 없는 링크(CV)는 data-destination 에 적어 둔 것을 쓴다
function destinationOf(link) {
  const href = link.getAttribute("href")
  if (!href) return link.dataset.destination
  return href
    .replace(/^mailto:/, "")
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "")
}

// 링크에 마우스를 올리면 선택 상자(index.css) 오른쪽 아래에 가는 곳을 먹색 딱지로 띄운다 — 링크가 여러 줄이면 마지막 줄에.
// 딱지 오른쪽 끝은 상자 오른변(글자에서 3.5px 바깥, 좌우 padding 은 빼고 잰다)에, 위는 상자 아래 끝(padding 아래 끝)에서 4px 밑에.
// 스크롤하면 자리가 어긋나 걷는다
function HoverDestination() {
  const [hovered, setHovered] = useState(null)

  useEffect(() => {
    const follow = (event) => {
      if (event.pointerType !== "mouse") return
      const link = event.target.closest?.("a")
      setHovered(
        link && {
          destination: destinationOf(link),
          rect: [...link.getClientRects()].at(-1),
          paddingRight: parseFloat(getComputedStyle(link).paddingRight),
        }
      )
    }
    const hide = () => setHovered(null)
    document.addEventListener("pointerover", follow)
    window.addEventListener("scroll", hide, { passive: true })
    return () => {
      document.removeEventListener("pointerover", follow)
      window.removeEventListener("scroll", hide)
    }
  }, [])

  if (!hovered) return null
  const { destination, rect, paddingRight } = hovered
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none fixed z-20 -translate-x-full bg-ink px-1 text-[11px] leading-[1.5] whitespace-nowrap text-paper"
      style={{ left: rect.right - paddingRight + 3.5, top: rect.bottom + 4 }}
    >
      {destination}
    </span>
  )
}

export default function App() {
  return (
    <>
      <CrayonText />
      <HoverDestination />
      {/* 본문 폭은 최대 720px — 좌우 여백 32px(휴대폰 폭에선 24px)은 따로 둔다. prose(typography 플러그인)가 문단·제목·링크에 기본 여백과 크기를 준다 */}
      <main className="prose mx-auto max-w-[calc(720px+4rem)] px-6 text-base sm:px-8">
        <Home />
      </main>
    </>
  )
}
