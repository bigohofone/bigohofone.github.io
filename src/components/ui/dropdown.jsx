import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { variants, sizes } from "@/components/ui/button"

export const DropdownMenu = DropdownMenuPrimitive.Root

export function DropdownMenuTrigger({ asChild = true, ...props }) {
  return <DropdownMenuPrimitive.Trigger asChild={asChild} {...props} />
}

export function DropdownMenuContent({ className, children, ...props }) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content side="bottom" align="start" sideOffset={8} asChild {...props}>
        <motion.div
          initial={{ opacity: 0, scaleY: 0.8, y: -10 }}
          animate={{ opacity: 1, scaleY: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          style={{ originY: 0 }} // 상단 기준으로 펴짐
          className={cn(
            "z-50 flex w-fit min-w-40 flex-col overflow-hidden rounded-base border border-border bg-surface p-1 shadow-md",
            className
          )}
        >
          {children}
        </motion.div>
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  )
}

export function DropdownMenuItem({ className, onSelect, ...props }) {
  return (
    <DropdownMenuPrimitive.Item
      onSelect={(e) => {
        e.preventDefault() // 선택해도 메뉴를 닫지 않는다
        onSelect?.(e)
      }}
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 font-semibold",
        variants.ghost,
        sizes.md,
        className
      )}
      {...props}
    />
  )
}

export function DropdownMenuCheckItem({ children, checked, onCheckedChange, ...props }) {
  return (
    <DropdownMenuItem onSelect={() => onCheckedChange?.(!checked)} {...props}>
      {/* 토글은 항목 전체가 처리한다 — 체크박스가 따로 받으면 두 번 뒤집힌다 */}
      <Checkbox checked={checked} size="sm" tabIndex={-1} className="pointer-events-none" />
      <span>{children}</span>
    </DropdownMenuItem>
  )
}
