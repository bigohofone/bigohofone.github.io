import * as CheckboxPrimitive from "@radix-ui/react-checkbox"

import * as React from "react"
import { colors } from "@toss/tds-colors"
import { cn } from "@/lib/utils"
import { INTERACTION_TOKENS } from "@/lib/interactions"


const sizes = {
  sm: "size-6 rounded-[6px]",
  md: "size-8 rounded-[8px]",
  lg: "size-12 rounded-[12px]",
}


const iconSizes = {
  sm: "size-3", 
  md: "size-4", 
  lg: "size-6"
}


const Checkbox = React.forwardRef(({ className, size = "md", ...props }, ref) => {
  const s = sizes[size] || sizes.md
  const iconS = iconSizes[size] || iconSizes.md
  return (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "cursor-pointer peer shrink-0 rounded-sm bg-tranparent text-gray-100 border-2 border-gray-100",
      "data-[state=checked]:bg-blue-500 data-[state=checked]:text-white data-[state=checked]:border-blue-500",
      s,
      INTERACTION_TOKENS.press,
      INTERACTION_TOKENS.hover,
      INTERACTION_TOKENS.focus,
      INTERACTION_TOKENS.disabled,
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn(
      "flex items-center justify-center text-current",
    )}>
      <svg className={iconS} viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M3 8 6.5 11.5 13 4.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
  )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
