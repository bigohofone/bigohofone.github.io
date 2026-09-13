import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Cross2Icon } from "@radix-ui/react-icons"
import { colors } from "@toss/tds-colors"

// Text line-height comes from the active text-size token.
export const LINE = ""
const RowClickContext = createContext(null)

// Editorial look: sharp corners, hairline border, hard offset shadow toward
// the bottom-right, fill matching the page background. When `title` is given
// it renders as a separate header strip with its own even padding, divided
// from the body by a full-width rule.
export function Box({ className = "", id, title, count, controls, children }) {
  return (
    <div
      id={id}
      className={`py-12 ${LINE} ${className}`}
    >
      {title && (
        <div className="mb-6">
          <h3 className={`font-mono text-xl font-bold tracking-wide ${LINE}`} style={{ color: colors.grey800 }}>
          {title}
          {count !== undefined && <span className="ml-2 font-bold" style={{ color: colors.blue500 }}>{count}</span>}
          </h3>
          {controls}
        </div>
      )}
      <div className={title ? "[&>:first-child]:mt-0" : ""}>{children}</div>
    </div>
  )
}

export function Row({ year, present = false, description, onClick, children }) {
  const clickHandlerRef = useRef(onClick)
  const rowRef = useRef(null)
  const [interactive, setInteractive] = useState(Boolean(onClick))

  const registerClickHandler = useCallback((handler) => {
    clickHandlerRef.current = handler
    setInteractive(true)
    return () => {
      clickHandlerRef.current = null
      setInteractive(Boolean(onClick))
    }
  }, [onClick])

  const handleClick = (event) => {
    if (event.defaultPrevented) return
    clickHandlerRef.current?.(event)
  }

  const resetHover = useCallback(() => {
    if (rowRef.current) rowRef.current.style.backgroundColor = colors.white
  }, [])

  const rowContextValue = useMemo(
    () => ({ registerClickHandler, resetHover }),
    [registerClickHandler, resetHover]
  )

  return (
    <RowClickContext.Provider value={rowContextValue}>
      <div
        ref={rowRef}
        className={`${interactive ? "cursor-pointer transition-colors" : ""} rounded-[12px] px-2 py-3 ${LINE}`}
        style={{ backgroundColor: colors.white }}
        onClick={handleClick}
        onMouseEnter={interactive ? (event) => { event.currentTarget.style.backgroundColor = colors.grey100 } : undefined}
        onMouseLeave={interactive ? resetHover : undefined}
      >
        <div className={`min-w-0 flex-1 flex flex-col gap-1 ${LINE}`}>
          {children}
          {description && (
            <p className={`text-sm ${LINE}`} style={{ color: colors.grey500 }}>
              <span style={present ? { color: colors.blue500 } : undefined}>
                {present ? "Present" : year}
              </span>
              {" · "}
              {description}
            </p>
          )}
        </div>
      </div>
    </RowClickContext.Provider>
  )
}

export function RowTitle({ children }) {
  return (
      <span className="inline-block text-base font-semibold" style={{ color: colors.grey800 }}>
      {children}
    </span>
  )
}

// Title trigger that opens the full description in a popup styled like an
// expanded bento row: logo tile + title/subtitle header, then body.
export function Details({ title, subtitle, meta, logo, trigger, children }) {
  const [open, setOpen] = useState(false)
  const rowContext = useContext(RowClickContext)
  const registerClickHandler = rowContext?.registerClickHandler

  const closeDetails = useCallback(() => {
    setOpen(false)
    rowContext?.resetHover()
  }, [rowContext])

  useEffect(() => {
    if (!registerClickHandler) return undefined
    return registerClickHandler(() => setOpen(true))
  }, [registerClickHandler])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === "Escape" && closeDetails()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [closeDetails, open])

  return (
    <>
      <span className="text-base font-semibold" style={{ color: colors.grey800 }}>
        {trigger}
      </span>
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-5 backdrop-blur-[2px]"
              style={{ backgroundColor: `${colors.grey900}66` }}
              onClick={closeDetails}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 12 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onClick={(e) => e.stopPropagation()}
                className={`w-full max-w-3xl h-full rounded-[12px] px-6 py-6 ${LINE}`}
                style={{ backgroundColor: colors.white, boxShadow: `4px 4px 2px 0 ${colors.greyOpacity200}` }}
              >
                <div className="mb-2 flex w-full items-start justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeDetails}
                    aria-label="Close"
                    className="flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors"
                    style={{ backgroundColor: colors.grey100, color: colors.grey700 }}
                    onMouseEnter={(event) => { event.currentTarget.style.backgroundColor = colors.grey200 }}
                    onMouseLeave={(event) => { event.currentTarget.style.backgroundColor = colors.grey100 }}
                  >
                    <Cross2Icon className="size-4" />
                  </button>
                </div>
                <div className="mb-2 flex w-full flex-col items-start">
                  <h4 className="text-base font-semibold" style={{ color: colors.grey800 }}>{title}</h4>
                  {subtitle && <p className={`mt-2 text-sm ${LINE}`} style={{ color: colors.grey500}}>{subtitle}</p>}
                  {meta && <p className={`text-sm ${LINE}`} style={{ color: colors.grey500 }}>{meta}</p>}
                </div>
                <div className="mt-6 flex w-full flex-col items-start">
                  {/* TODO: Markdown for children */}
                  <p className={`text-sm ${LINE}`} style={{ color: colors.grey500}}>{children}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}

