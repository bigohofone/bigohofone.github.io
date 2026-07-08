import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowTopRightIcon, Cross2Icon } from "@radix-ui/react-icons"

// Every text line inside a box sits on a shared 22px line grid so the year
// column and the content column stay aligned across font sizes.
export const LINE = "leading-[22px]"

// Editorial look: sharp corners, hairline border, hard offset shadow toward
// the bottom-right, fill matching the page background. When `title` is given
// it renders as a separate header strip with its own even padding, divided
// from the body by a full-width rule.
export function Box({ className = "", title, children }) {
  return (
    <div
      className={`rounded-[4px] border border-black bg-background shadow-[4px_4px_2px_0_rgba(158,158,158,0.15)] dark:border-white ${LINE} ${className}`}
    >
      {title && (
        <div className="border-b border-faint/40 px-5 py-3">
          <h3 className={`font-mono text-sm font-normal uppercase tracking-wide ${LINE} text-heading`}>
            {title}
          </h3>
        </div>
      )}
      {/* Titled body: 20px padding all around; the first child drops its own
          mt so the rule-to-content gap is exactly the 20px padding. */}
      <div className={title ? "p-5 [&>:first-child]:mt-0" : "p-5"}>{children}</div>
    </div>
  )
}

// Ongoing-state marker: outline badge in the accent color, no fill.
export function PresentPill({ children = "Present" }) {
  return (
    <span className="inline-flex h-[18px] items-center rounded-[4px] border border-accent px-1 font-mono text-xs uppercase leading-none text-accent-fg">
      {children}
    </span>
  )
}

// Shared left-column width so every box (years, pills, logos, …) starts its
// content at the same x position.
export const LEFT_COL = "mr-1 w-22 min-w-22 lg:w-25 lg:min-w-25"

export function LogoTile({ src, alt }) {
  return (
    // Same tint as the boxes' offset shadow.
    <span className="flex size-14 items-center justify-center overflow-hidden bg-[rgba(158,158,158,0.15)] p-2.5">
      <img src={src} alt={alt} className="max-h-full max-w-full object-contain grayscale" />
    </span>
  )
}

export function Row({ year, present = false, left, children }) {
  return (
    <div className={`mt-6 flex ${LINE}`}>
      <div className={`${LEFT_COL} font-mono text-sm uppercase ${LINE} text-faint`}>
        {left ??
          (present ? (
            // Center the pill inside one 22px line so the first line of
            // the content column stays level with it.
            <span className="flex h-[22px] items-center">
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
                className={`w-full max-w-md rounded-[4px] border border-black bg-background p-5 shadow-[4px_4px_2px_0_rgba(158,158,158,0.15)] dark:border-white ${LINE}`}
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
                    <Cross2Icon className="size-4" />
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
      {/* Word joiner + nowrap glue the arrow to the last word so it never
          wraps onto a line of its own. */}
      <span className="whitespace-nowrap">
        {"⁠"}
        <ArrowTopRightIcon className="link-arrow" aria-hidden />
      </span>
    </a>
  )
}
