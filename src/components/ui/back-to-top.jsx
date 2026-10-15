import { ArrowUp } from "lucide-react"

import { chipClass, chipIconClass } from "@/components/ui/chip"
import { cn } from "@/lib/utils"

// 목록 끝에서 맨 위로 돌아가는 버튼 — Contact 처럼 테두리 없이 한 줄
export function BackToTop() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="flex justify-center px-5 pb-[calc(var(--spacing-line)*4)]">
      <button type="button" onClick={scrollToTop} className={cn(chipClass, "h-line border-0 sm:h-line")}>
        <ArrowUp className={chipIconClass} aria-hidden="true" />
        Back to top
      </button>
    </div>
  )
}
