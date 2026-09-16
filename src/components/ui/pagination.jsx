import * as React from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { INTERACTION_TOKENS } from "@/lib/interactions"

export function Pagination({ currentPage, totalPages, onPageChange }) {
  const layoutId = React.useId()

  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const navBtnClass = cn(
    "size-8 rounded-full flex items-center justify-center text-gray-500 cursor-pointer",
    INTERACTION_TOKENS.press,
    INTERACTION_TOKENS.hover,
    INTERACTION_TOKENS.focus,
    INTERACTION_TOKENS.disabled
  )

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      {/* 이전 페이지 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={navBtnClass}
        aria-label="Previous"
      >
        <ChevronLeft className="size-5 stroke-[2.5]" />
      </button>

      {/* 페이지 번호 목록 */}
      {pages.map((num) => {
        const isSelected = num === currentPage

        return (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={cn(
              "relative size-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors cursor-pointer z-10 select-none",
              isSelected ? "text-gray-700" : "text-gray-500 hover:text-gray-900",
              INTERACTION_TOKENS.press,
              INTERACTION_TOKENS.hover,
              INTERACTION_TOKENS.focus
            )}
          >
            {isSelected && (
              <motion.div
                layoutId={`pagination-active-${layoutId}`}
                className="absolute inset-0 bg-gray-300 rounded-full -z-10"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            {num}
          </button>
        )
      })}

      {/* 다음 페이지 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={navBtnClass}
        aria-label="Next"
      >
        <ChevronRight className="size-5 stroke-[2.5]" />
      </button>
    </div>
  )
}