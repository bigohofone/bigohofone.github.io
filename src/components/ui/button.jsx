import { cn } from "@/lib/utils"

export const variants = {
  default: "bg-primary text-primary-fg",
  destructive: "bg-danger text-danger-fg",
  outline: "bg-transparent text-fg border border-border-strong",
  secondary: "bg-surface-muted text-fg",
  ghost: "bg-transparent text-fg",
  link: "bg-transparent text-link",
}

export const sizes = {
  sm: "h-8 text-xs px-4 rounded-base gap-1.5",
  md: "h-10 text-sm px-5 rounded-base gap-2",
  lg: "h-12 text-base px-6 rounded-base gap-2.5",
  xl: "h-14 text-lg px-7 rounded-base gap-3",
}

export function Button({ variant = "default", size = "md", className, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center font-semibold",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
}
