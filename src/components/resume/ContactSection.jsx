import { Download } from "pixelarticons/react"

import { pixelButtonClass, pixelButtonTextClass } from "@/components/ui/chip"
import { cn } from "@/lib/utils"
import { downloadCV } from "@/components/cv/cvPDF"

// pixelarticons 아이콘은 24 격자에 2단위 픽셀로 3~21 사이에 9×9 픽셀이 그려져 있어,
// 그 부분만 잘라(viewBox 3 3 18 18) 9픽셀 크기로 그리면 아이콘 픽셀 하나가 글자 픽셀 하나와 겹친다.
// 버튼 폭은 42픽셀(짝수)이라 가운데 정렬해도 격자에 맞는다
export function ContactSection() {
  return (
    <section id="contact" className="flex justify-center px-cell-5 pb-cell-20">
      <button
        type="button"
        onClick={downloadCV}
        aria-label="Download CV"
        className={cn(pixelButtonClass, "bg-primary text-primary-fg sm:hover:brightness-110")}
      >
        <Download
          viewBox="3 3 18 18"
          shapeRendering="crispEdges"
          aria-hidden="true"
          style={{ width: "calc(9 * var(--font-px))", height: "calc(9 * var(--font-px))" }}
        />
        <span className={pixelButtonTextClass}>CV</span>
      </button>
    </section>
  )
}
