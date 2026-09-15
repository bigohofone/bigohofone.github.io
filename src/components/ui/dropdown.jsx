import { colors } from "@toss/tds-colors"
import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"

import { INTERACTION_TOKENS } from "@/lib/interactions"
import { variants, sizes } from "@/components/ui/button"

export const DropdownMenu = DropdownMenuPrimitive.Root


export const DropdownMenuTrigger = React.forwardRef(({ asChild = true, ...props }, ref) => (
  <DropdownMenuPrimitive.Trigger
    ref={ref}
    asChild={asChild}
    {...props}
  />
))
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"


export const DropdownMenuContent = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      side="bottom"
      align="start"
      sideOffset={12}
      style={{backgroundColor: colors.white }}
      className={cn(
        "z-50 overflow-hidden rounded-xl p-1 shadow-md w-fit min-w-40 flex flex-col ",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = "DropdownMenuContent"

export const DropdownMenuItem = React.forwardRef(({ className, onSelect, ...props }, ref) => (

  <DropdownMenuPrimitive.Item
    ref={ref}
    onSelect={(e) => { e.preventDefault(); onSelect?.(e); }}
    className={cn(
      variants['ghost'], sizes['md'], 
      "cursor-pointer inline-flex items-center justify-left font-bold",
      INTERACTION_TOKENS.press,
      INTERACTION_TOKENS.hover,
      INTERACTION_TOKENS.focus,
      INTERACTION_TOKENS.disabled,
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = "DropdownMenuItem"

export const DropdownMenuCheckItem = React.forwardRef(({ className, children, checked, onCheckedChange, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    onSelect={(e) => { e.preventDefault(); onCheckedChange?.(!checked); }}
    className={cn(
      variants['ghost'], sizes['md'],
      "cursor-pointer inline-flex items-center justify-left font-bold",
      INTERACTION_TOKENS.press,
      INTERACTION_TOKENS.hover,
      INTERACTION_TOKENS.focus,
      INTERACTION_TOKENS.disabled,
      className
    )}
    {...props}
  >
    <Checkbox checked={checked} onCheckedChange={onCheckedChange} size="sm" />
    <span>{children}</span>
  </DropdownMenuPrimitive.Item>
))
DropdownMenuCheckItem.displayName = "DropdownMenuCheckItem"
