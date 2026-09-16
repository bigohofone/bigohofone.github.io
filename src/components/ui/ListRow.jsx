import { useState } from "react"
import { cn } from "@/lib/utils"
import { INTERACTION_TOKENS } from "@/lib/interactions"

export function ListRow({
  title,
  subtitle,
  onClick,
  children,
}) {
  const handleClick = () => {
    if (onClick) onClick()
  }

  return (
    <li
      role="button"
      tabIndex={0}
      onClick={handleClick}
      className={cn(
        "group relative cursor-pointer rounded-xl px-2 py-3 outline-none transition-colors duration-150 flex flex-1 flex-col gap-1",
        INTERACTION_TOKENS.press,
        INTERACTION_TOKENS.hover,
        INTERACTION_TOKENS.focus,
      )}    
    >
        <h3 className="text-lg font-bold text-gray-700">{title}</h3>
        {subtitle && <p className="text-sm font-medium text-gray-500">{subtitle}</p>}
    </li>
  )
}
