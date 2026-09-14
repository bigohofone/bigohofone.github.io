import { colors } from "@toss/tds-colors"

export function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="size-9 rounded-full flex items-center justify-center disabled:opacity-30 disabled:hover:bg-transparent hover:bg-[#f3f4f6]"
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
          className={`size-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
            num === currentPage
              ? "bg-[#e5e7eb] text-[#374151] hover:bg-[#e5e7eb]"
              : "text-[#374151] hover:bg-[#f3f4f6]"
          }`}
          style={num !== currentPage ? { color: colors.grey700 } : undefined}
        >
          {num}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="size-9 rounded-full flex items-center justify-center disabled:opacity-30 disabled:hover:bg-transparent hover:bg-[#f3f4f6]"
        aria-label="Next"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  )
}
