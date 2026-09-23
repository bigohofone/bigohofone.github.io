import { useEffect } from "react"
import { createPortal } from "react-dom"
import { Cross2Icon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Modal({ open, onClose, className, children }) {
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose()
    }

    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()} // 내용 클릭으로는 닫히지 않게
        className={cn(
          "relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-base bg-surface px-6 pt-0 pb-18 shadow-xl",
          className
        )}
      >
        <div className="my-4 flex justify-end">
          <Button
            variant="ghost"
            onClick={onClose}
            className="size-8 items-center justify-center rounded-full p-0"
            aria-label="Close"
          >
            <Cross2Icon className="size-5" />
          </Button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  )
}
