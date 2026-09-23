import { useEffect } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/lib/use-media-query"

// 오른쪽으로 이만큼 끌거나 이 속도를 넘기면 닫는다
const SWIPE_CLOSE_DISTANCE = 120
const SWIPE_CLOSE_VELOCITY = 500

/**
 * 모바일은 오른쪽에서 밀려 들어오는 전체 화면 시트(오른쪽으로 스와이프하면 닫힘),
 * sm 이상은 가운데 떠 있는 패널.
 */
export function Modal({ open, onClose, className, children }) {
  const isDesktop = useMediaQuery("(min-width: 640px)")

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

  const panelMotion = isDesktop
    ? { initial: { opacity: 0, scale: 0.98 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.98 } }
    : { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } }

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex bg-black/40 sm:items-center sm:justify-center sm:p-6"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()} // 내용 클릭으로는 닫히지 않게
            {...panelMotion}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            // 모바일에서만 오른쪽으로 끌어 닫는다. 세로 스크롤과 섞이지 않게 방향을 잠근다
            drag={isDesktop ? false : "x"}
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 0.7 }}
            onDragEnd={(_, info) => {
              if (info.offset.x > SWIPE_CLOSE_DISTANCE || info.velocity.x > SWIPE_CLOSE_VELOCITY) {
                onClose()
              }
            }}
            className={cn(
              "relative flex w-full flex-col overflow-y-auto bg-bg",
              // 내용이 짧아도 최소 4:3 (가로:세로) 비율은 유지한다 — 패널 폭은 최대 672px(max-w-2xl),
              // 화면이 좁거나 낮으면 그만큼만 쓴다
              "sm:max-h-[85vh] sm:min-h-[min(504px,calc(75vw-36px),85vh)] sm:max-w-2xl sm:rounded-2xl",
              className
            )}
          >
            {/* 내용이 길어도 닫기 버튼은 위에 붙어 있는다 */}
            <div className="sticky top-0 z-10 flex justify-end bg-bg px-5 pt-5 pb-2 sm:px-8 sm:pt-6">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex size-11 items-center justify-center rounded-full text-fg-strong outline-none transition-colors hover:text-blue-500"
              >
                <X className="size-6 stroke-[1.5]" aria-hidden="true" />
              </button>
            </div>

            <div className="px-5 pb-15 sm:px-8 sm:pb-12">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
