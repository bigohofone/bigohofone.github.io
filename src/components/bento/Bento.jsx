import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

// Every text line inside a box sits on a shared 24px line grid so the year
// column and the content column stay aligned across font sizes (14px/15px),
// and all spacing lands on multiples of 4px.
export const LINE = "leading-6"

export function Box({ delay = 0, className = "", children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, delay, ease: "easeOut" }}
      className={`rounded-3xl bg-box p-5 ${LINE} ${className}`}
    >
      {children}
    </motion.div>
  )
}

export function BoxTitle({ children }) {
  return <h3 className={`text-sm font-normal ${LINE} text-heading`}>{children}</h3>
}

// Ongoing-state marker: plain text emphasized only by the accent color.
export function PresentPill({ children = "Present" }) {
  return <span className="text-accent-fg">{children}</span>
}

// Shared left-column width so every box (years, pills, logos, …) starts its
// content at the same x position.
export const LEFT_COL = "mr-1 w-22 min-w-22 lg:w-25 lg:min-w-25"

export function LogoTile({ src, alt }) {
  return (
    <span className="flex size-14 items-center justify-center overflow-hidden rounded-lg bg-white p-1">
      <img src={src} alt={alt} className="max-h-full max-w-full object-contain" />
    </span>
  )
}

export function Row({ year, present = false, left, children }) {
  return (
    <div className={`mt-6 flex ${LINE}`}>
      <div className={`${LEFT_COL} text-sm ${LINE} text-faint`}>
        {left ??
          (present ? (
            // Center the 20px pill inside one 24px line so the first line of
            // the content column stays level with it.
            <span className="flex h-6 items-center">
              <PresentPill>{year}</PresentPill>
            </span>
          ) : (
            <span>{year}</span>
          ))}
      </div>
      <div className={`min-w-0 flex-1 ${LINE}`}>{children}</div>
    </div>
  )
}

export function RowTitle({ children }) {
  return <span className={`text-sm ${LINE} text-heading`}>{children}</span>
}

// Inline "More" trigger that opens the full description in a popup styled
// like an expanded bento row: logo tile + title/subtitle header, then body.
export function Details({ title, subtitle, meta, logo, children }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <>
      {/* Separator lives inside the trigger so hiding it (e.g. for the CV
          PDF) leaves no dangling "·" in the text. */}
      <span className="details-trigger whitespace-nowrap">
        {"· "}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          className={`cursor-pointer text-sm ${LINE} text-faint underline underline-offset-2 hover:text-heading`}
        >
          More
        </button>
      </span>
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5 backdrop-blur-[2px]"
              onClick={() => setOpen(false)}
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
                className={`w-full max-w-md rounded-3xl bg-box p-5 ${LINE}`}
              >
                <div className="flex items-start gap-4">
                  {logo && <LogoTile src={logo} alt={title} />}
                  <div className="min-w-0 flex-1">
                    <h4 className={`text-sm ${LINE} text-heading`}>{title}</h4>
                    {subtitle && <p className={`text-sm ${LINE}`}>{subtitle}</p>}
                    {meta && <p className={`text-sm ${LINE} text-faint`}>{meta}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="-m-2 cursor-pointer p-2 text-faint transition-colors hover:text-heading"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <p className={`mt-6 text-sm ${LINE}`}>{children}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}

export function LinkAll({ href, download = false, children }) {
  if (!href) return <RowTitle>{children}</RowTitle>
  const external = href.startsWith("http")
  return (
    <a
      href={href}
      className="link-all"
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      {...(download ? { download: true } : {})}
    >
      {children}
    </a>
  )
}
