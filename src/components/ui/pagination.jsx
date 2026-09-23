import { useId } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const baseNavClass = "rounded-full flex items-center justify-center text-fg"

// 화살표는 쓸 수 없을 때 흐리게, 쓸 수 있을 때 진하게
const arrowClass =
  "text-fg-strong transition-colors disabled:text-blue-300 sm:hover:text-blue-500 sm:disabled:hover:text-blue-300"

// sm 은 목록이 짧을 때 쓰는 작은 버전
const sizes = {
  base: { nav: "size-10", icon: "size-6", label: "text-base", gap: "gap-2", mt: "mt-15" },
  sm: { nav: "size-8", icon: "size-5", label: "text-sm", gap: "gap-1", mt: "mt-15" },
}

export function Pagination({ currentPage, totalPages, onPageChange, size = "base" }) {
  const layoutId = useId()
  const s = sizes[size] ?? sizes.base
  const navClass = cn(baseNavClass, s.nav)

  if (totalPages <= 1) return null

  return (
    <div className={cn("flex items-center justify-center", s.gap, s.mt)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(navClass, arrowClass)}
        aria-label="Previous"
      >
        <ChevronLeft className={cn(s.icon, "stroke-[1.5]")} />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => {
        const isSelected = num === currentPage

        return (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={cn(
              navClass,
              "relative z-10 cursor-pointer select-none font-normal transition-colors",
              s.label,
              // 현재 페이지가 아닌 번호만 호버에 반응한다
              isSelected ? "text-fg-strong" : "sm:hover:text-blue-500"
            )}
          >
            {isSelected && (
              <motion.div
                layoutId={`pagination-active-${layoutId}`}
                // 선택 표시 — 페이지 배경을 90% 밝기로 깐다 (거의 검은 다크 배경에서는 곱셈이 통하지 않아 한 단계 밝은 면색을 쓴다)
                className="absolute inset-0 -z-10 rounded-full bg-bg brightness-90 dark:bg-surface-subtle dark:brightness-100"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            {num}
          </button>
        )
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(navClass, arrowClass)}
        aria-label="Next"
      >
        <ChevronRight className={cn(s.icon, "stroke-[1.5]")} />
      </button>
    </div>
  )
}
