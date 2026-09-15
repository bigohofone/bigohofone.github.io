import { colors } from "@toss/tds-colors"
import * as React from "react"
import { cn } from "@/lib/utils"

import { INTERACTION_TOKENS } from "@/lib/interactions"
import { variants, sizes } from "@/components/ui/button"

export function SegmentedControl({ options, value, onChange, className }) {
  return (
    <div className={cn(
      variants['secondary'], sizes['md'],
      "inline-flex p-0.5 gap-1", 
      className
    )}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange?.(opt.value)}
          className={cn(
            "px-4 py-0 rounded-[8px] font-bold transition-all duration-150 cursor-pointer",
            value === opt.value ? "bg-white text-gray-700 shadow-xs" : "text-gray-500"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
