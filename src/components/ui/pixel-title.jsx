import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

// 본문 폭 가운데에 놓는 픽셀 글꼴 제목 (pixel-title 참고).
// 가운데 정렬하면 제목 폭이 홀수 글자 픽셀일 때 왼쪽 끝이 반 픽셀에 걸린다. 글꼴을 불러온 뒤 폭을 재어
// 홀수면 반 픽셀 오른쪽으로 밀어 격자에 맞춘다. 글자마다 오른쪽에 한 픽셀 틈이 붙어 있어 이렇게 밀면 글자 자체가 정가운데에 온다
export function PixelTitle({ as: Tag = "h2", className, children }) {
  const ref = useRef(null)
  const [oddWidth, setOddWidth] = useState(false)

  useEffect(() => {
    document.fonts.ready.then(() => {
      const el = ref.current
      if (!el) return
      const range = document.createRange()
      range.selectNodeContents(el)
      // Jersey 10 은 1em 이 56/3 글자 픽셀이다
      const fontPx = parseFloat(getComputedStyle(el).fontSize) / (56 / 3)
      setOddWidth(Math.round(range.getBoundingClientRect().width / fontPx) % 2 === 1)
    })
  }, [children])

  return (
    <Tag
      ref={ref}
      className={cn("pixel-title", className)}
      style={oddWidth ? { "--pixel-title-x": "calc(var(--font-px) * 0.5)" } : undefined}
    >
      {children}
    </Tag>
  )
}
