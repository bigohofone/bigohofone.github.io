import { useId } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { variants } from "@/components/ui/button"

export function SegmentedControl({ options, value, onChange, className }) {
  // 컨트롤이 여러 개여도 하이라이트 애니메이션이 서로 섞이지 않도록
  const layoutId = useId()

  // 컨테이너 패딩은 사방 4px 로 고정 — 버튼 사이즈(px-5, h-10)를 물려받지 않는다
  return (
    <div
      className={cn(
        "relative inline-flex gap-1 overflow-hidden rounded-base p-1 text-sm",
        variants.secondary,
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
              "relative z-10 select-none px-4 py-1.5 font-semibold transition-colors",
              isSelected && "text-fg-strong"
            )}
          >
            {/* 선택된 칸으로 미끄러지는 하이라이트 */}
            {isSelected && (
              <motion.div
                layoutId={`segmented-active-${layoutId}`}
                className="absolute inset-0 -z-10 rounded-base bg-surface shadow-xs"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
