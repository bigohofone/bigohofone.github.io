import { ArrowUp } from "lucide-react"

import { chipClass, chipIconClass } from "@/components/ui/chip"

// 목록 끝에서 맨 위로 돌아가는 버튼 — Contact 칩과 같은 생김새
export function BackToTop() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="flex justify-center px-5 pb-30">
      <button type="button" onClick={scrollToTop} className={chipClass}>
        <ArrowUp className={chipIconClass} aria-hidden="true" />
        Back to top
      </button>
    </div>
  )
}
