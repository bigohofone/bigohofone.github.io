import { useEffect, useLayoutEffect, useRef, useState } from "react"

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

// 링크나 설명이 뜨는 글(.hint)에 마우스를 올리면 선택 상자(index.css) 아래에 먹색 딱지를 띄운다 — 링크는 가는 곳을 작게, 설명은 본문 크기로.
// 마우스를 올릴 수 없는 휴대폰에선 설명이 뜨는 글을 누르면 띄우고(상자도 data-open 으로 긋는다), 다시 누르거나 다른 데를 누르면 닫는다.
// 설명 딱지는 글이 든 섹션의 좌우를 꽉 채우고 양옆으로 4px 더 — 글에 긋는 선택 상자(글자에서 4px 바깥)와 끝을 맞춘다 — 마지막 줄 상자 아래 4px 에 — 화면 아래로 넘치면 첫 줄 상자 위 4px 에 띄운다.
// 링크 딱지 폭은 본문 폭(좌우 여백 뺀)까지, 넘치면 줄을 바꾼다. 자리는 여러 줄이면 마지막 줄 상자 아래 4px 에, 오른쪽 끝을 상자 오른변(글자에서
// 3.5px 바깥, 좌우 padding 은 빼고 잰다)에 맞추되 본문 왼쪽·오른쪽 끝을 넘으면 그 안으로 민다. 스크롤하면 자리가 어긋나 걷는다
function Popup() {
  const [target, setTarget] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    const follow = (event) => {
      if (event.pointerType !== "mouse") return
      setTarget(event.target.closest?.("a, .hint") ?? null)
    }
    const tap = (event) => {
      if (matchMedia("(hover: hover)").matches) return
      const hint = event.target.closest?.(".hint")
      setTarget((shown) => (hint && hint !== shown ? hint : null))
    }
    const hide = () => setTarget(null)
    document.addEventListener("pointerover", follow)
    document.addEventListener("click", tap)
    window.addEventListener("scroll", hide, { passive: true })
    return () => {
      document.removeEventListener("pointerover", follow)
      document.removeEventListener("click", tap)
      window.removeEventListener("scroll", hide)
    }
  }, [])

  useLayoutEffect(() => {
    if (!target) return
    target.dataset.open = ""
    const popup = ref.current
    const rects = [...target.getClientRects()]
    if (target.dataset.desc) {
      const section = target.closest("section").getBoundingClientRect()
      popup.style.left = `${section.left - 4}px`
      popup.style.width = `${section.width + 8}px`
      const below = rects.at(-1).bottom + 4
      const fitsBelow = below + popup.offsetHeight <= window.innerHeight
      popup.style.top = `${fitsBelow ? below : rects[0].top - 4 - popup.offsetHeight}px`
      return () => delete target.dataset.open
    }
    const main = target.closest("main")
    const mainStyle = getComputedStyle(main)
    const bodyLeft = main.getBoundingClientRect().left + parseFloat(mainStyle.paddingLeft)
    const bodyRight = main.getBoundingClientRect().right - parseFloat(mainStyle.paddingRight)
    popup.style.maxWidth = `${bodyRight - bodyLeft}px`
    const rect = rects.at(-1)
    const right = rect.right - parseFloat(getComputedStyle(target).paddingRight) + 3.5
    popup.style.left = `${Math.max(bodyLeft, Math.min(right, bodyRight) - popup.offsetWidth)}px`
    popup.style.top = `${rect.bottom + 4}px`
    return () => delete target.dataset.open
  }, [target])

  if (!target) return null
  const desc = target.dataset.desc
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed z-20 bg-ink text-paper [overflow-wrap:anywhere]",
        desc ? "px-2 py-1 whitespace-pre-line" : "w-max px-1 text-[11px] leading-[1.5]"
      )}
    >
      {desc ?? destinationOf(target)}
    </span>
  )
}

const cn = (...classes) => classes.filter(Boolean).join(" ")

export default function App() {
  return (
    <>
      <CrayonText />
      <Popup />
      {/* 최대 폭 1440px(좌우 여백 포함) — 좌우 여백 32px 안을 12칸, 칸 사이 24px 로 나눈다. 휴대폰 폭에선 여백 24px, 4칸, 칸 사이 16px.
          prose(typography 플러그인)가 문단·제목·링크에 기본 여백과 크기를 준다 */}
      <main className="prose mx-auto grid max-w-[1440px] grid-cols-4 gap-x-4 px-6 text-base sm:grid-cols-12 sm:gap-x-6 sm:px-8">
        <Home />
      </main>
    </>
  )
}
