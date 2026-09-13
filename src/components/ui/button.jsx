import * as React from "react"
import { colors } from "@toss/tds-colors"
import { cn } from "@/lib/utils"

const variants = {
  default: { bg: colors.blue500, text: "white", hover: colors.blue500 },
  destructive: { bg: colors.red500, text: "white", hover: colors.red500 },
  outline: { border: `2px solid ${colors.grey100}`, bg: "transparent", text: colors.grey700, hover: colors.grey100 },
  secondary: { bg: colors.grey100, text: colors.grey700, hover: colors.grey100 },
  ghost: { bg: "white", text: colors.grey700, hover: colors.grey100, active: colors.grey100 },
  link: { text: colors.blue500, hover: colors.blue100, active: colors.blue100 },
}

const sizes = {
  sm: "h-9 text-xs px-3 rounded-lg gap-1",
  md: "h-11 text-sm px-4 rounded-xl gap-1",
  lg: "h-13 text-base px-5 rounded-2xl gap-2",
  xl: "h-16 text-lg px-7 rounded-3xl gap-2",
}

export function Button({ variant = "default", size = "md", className, ...props }) {
  const v = variants[variant] || variants.default
  const s = sizes[size] || sizes.md
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-semibold transition-all duration-150 active:scale-95 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none",
        s,
        className
      )}
      style={{
        backgroundColor: v.bg,
        color: v.text,
        border: v.border || undefined,
      }}
      {...props}
    />
  )
}
