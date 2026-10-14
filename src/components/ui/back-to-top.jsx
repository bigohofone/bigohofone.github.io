import { ArrowUp } from "pixelarticons/react"

import { pixelButtonClass, pixelButtonTextClass } from "@/components/ui/chip"
import { cn } from "@/lib/utils"

// 목록 끝에서 맨 위로 돌아가는 버튼 — CV 버튼과 같은 픽셀 버튼, 색만 밝은 배경(bg-light).
// pixelarticons 화살표는 24 격자에 2단위 픽셀로 가로 5~19 · 세로 4~20 사이에 7×8 픽셀이 그려져 있어,
// 그 부분만 잘라(viewBox 5 4 14 16) 7×8 픽셀 크기로 그린다.
// 버튼 폭이 99픽셀(홀수)이라 가운데 정렬하면 반 픽셀에 걸리므로 반 픽셀 왼쪽으로 당겨 격자에 맞춘다.
// 버튼은 위아래로 세 칸 오르내린다 — 버튼의 translate 는 반 픽셀 당기기에 쓰므로 움직임은 감싼 줄에 준다
export function BackToTop() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="flex animate-bob-3 justify-center pb-cell-15">
      <button
        type="button"
        onClick={scrollToTop}
        className={cn(
          pixelButtonClass,
          "-translate-x-[calc(var(--font-px)*0.5)] bg-bg-light text-fg-strong sm:hover:text-primary"
        )}
      >
        <ArrowUp
          viewBox="5 4 14 16"
          shapeRendering="crispEdges"
          aria-hidden="true"
          style={{ width: "calc(7 * var(--font-px))", height: "calc(8 * var(--font-px))" }}
        />
        <span className={pixelButtonTextClass}>Back to top</span>
      </button>
    </div>
  )
}
