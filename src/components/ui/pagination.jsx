import { colors } from "@toss/tds-colors"
import { cn } from "@/lib/utils"
import { INTERACTION_TOKENS } from "@/lib/interactions"

export function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "size-8 rounded-full flex items-center justify-center text-gray-500",
          INTERACTION_TOKENS.press,
          INTERACTION_TOKENS.hover,
          INTERACTION_TOKENS.focus,
          INTERACTION_TOKENS.disabled
        )}
        aria-label="Previous"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={cn(
            "size-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors text-gray-500",
            num === currentPage ? "bg-gray-300 text-gray-700" : "",
            INTERACTION_TOKENS.press,
            INTERACTION_TOKENS.hover,
            INTERACTION_TOKENS.focus,
            INTERACTION_TOKENS.disabled
          )}
        >
          {num}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "size-8 rounded-full flex items-center justify-center text-gray-500",
          INTERACTION_TOKENS.disabled,
          INTERACTION_TOKENS.hover,
          INTERACTION_TOKENS.press,
          INTERACTION_TOKENS.focus
        )}
        aria-label="Next"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

    </div>
  )
}
