import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { cn } from "@/lib/utils"

const sizes = {
  sm: ["size-6 rounded-base", "size-3"],
  md: ["size-8 rounded-base", "size-4"],
  lg: ["size-12 rounded-base", "size-6"],
}

export function Checkbox({ className, size = "md", ...props }) {
  const [box, icon] = sizes[size]

  return (
    <CheckboxPrimitive.Root
      className={cn(
        "shrink-0 border border-border-strong text-transparent",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-fg",
        box,
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        <svg className={icon} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M3 8 6.5 11.5 13 4.5"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}
