import * as React from "react"
import { colors } from "@toss/tds-colors"
import { cn } from "@/lib/utils"
import { INTERACTION_TOKENS } from "@/lib/interactions"

export const variants = {
  default: "bg-blue-500 text-white",
  destructive: "bg-red-500 text-white",
  outline: "bg-transparent text-gray-700 border-2 border-gray-100",
  secondary: "bg-gray-100 text-gray-700",
  ghost: "bg-transparent text-gray-700",
  link: "bg-transparent text-blue-500",
}


export const sizes = {
  sm: "h-8 text-xs px-4 rounded-[8px] gap-1.5",
  md: "h-10 text-sm px-5 rounded-[10px] gap-2",
  lg: "h-12 text-base px-6 rounded-[12px] gap-2.5",
  xl: "h-14 text-lg px-7 rounded-[14px] gap-3",
}


export function Button({ variant = "default", size = "md", className, ...props }) {
  if (!variants[variant]) throw new Error(`Invalid variant: ${variant}`)
  if (!sizes[size]) throw new Error(`Invalid size: ${size}`)

  const v = variants[variant]
  const s = sizes[size]

  return (
    <button
      className={cn(
        v, s,
        "cursor-pointer inline-flex items-center justify-left font-bold",
        INTERACTION_TOKENS.press,
        INTERACTION_TOKENS.hover,
        INTERACTION_TOKENS.focus,
        INTERACTION_TOKENS.disabled,
        className
      )}
      {...props}
    />
  )
}
