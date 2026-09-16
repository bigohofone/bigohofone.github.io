import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { variants, sizes } from "@/components/ui/button"

export function SegmentedControl({ options, value, onChange, className }) {
  // 여러 개 생성되어도 애니메이션 ID가 충돌하지 않도록 고유 ID 생성
  const layoutId = React.useId()

  return (
    <div
      className={cn(
        variants["secondary"],
        sizes["md"],
        "inline-flex p-1 gap-1 relative overflow-hidden",
        className
      )}
    >
      {options.map((opt) => {
        const isSelected = value === opt.value

        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange?.(opt.value)}
            className={cn(
              "relative px-4 py-1.5 text-sm font-bold transition-colors duration-150 cursor-pointer z-10 select-none",
              isSelected ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
            )}
          >
            {/* 선택된 버튼 위치로 슬라이딩 이동하는 하이라이트 배경 */}
            {isSelected && (
              <motion.div
                layout
                layoutId={`active-indicator-${layoutId}`}
                className="absolute inset-0 bg-white rounded-[8px] shadow-xs -z-10"
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 35,
                }}
              />
            )}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}