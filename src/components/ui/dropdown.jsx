import { colors } from "@toss/tds-colors"
import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { cn } from "@/lib/utils"

export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Trigger
    ref={ref}
    className={cn(
        "cursor-pointer outline-none focus:outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-offset-2 hover:outline-none active:outline-none", 
        className
    )}
    style={{ ...(className ? {} : { '--focus-ring-color': colors.blue500, backgroundColor: colors.grey100, color: colors.grey700 }) }}
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
        "z-50 overflow-hidden rounded-xl p-1 shadow-md w-fit flex flex-col ",
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
    style={{backgroundColor: colors.white }}
    className={cn("h-10 px-4 relative flex cursor-pointer select-none items-center rounded-lg text-md font-semibold outline-none hover:brightness-95 ", className)}
    {...props}
  />
))
DropdownMenuItem.displayName = "DropdownMenuItem"
