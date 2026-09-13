import { colors } from "@toss/tds-colors"
import * as React from "react"
import { cn } from "@/lib/utils"

export function SegmentedControl({ options, value, onChange, className }) {
  return (
    <div className={cn("inline-flex h-11 rounded-xl p-1 gap-1", className)} style={{ backgroundColor: colors.grey100 }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange?.(opt.value)}
          className={cn(
            "px-4 py-0 rounded-lg text-md font-semibold transition-all duration-150 cursor-pointer",
            value === opt.value
              ? "bg-white"
              : ""
          )}
          style={value === opt.value ? { color: colors.grey700 } : { color: colors.grey300 }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
