import { NavLink } from "react-router-dom"
import { useEffect, useState } from "react"
import { colors } from "@toss/tds-colors"

// Same mono-uppercase voice as the box header strips; the active page is
// underlined, inactive links sit in the faint grey until hovered.
function HeaderLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className="rounded-[12px] px-4 py-2.5 font-mono text-sm font-bold transition-colors"
      style={{ color: colors.grey700, backgroundColor: "transparent" }}
      onMouseEnter={(event) => { event.currentTarget.style.backgroundColor = colors.grey100 }}
      onMouseLeave={(event) => { event.currentTarget.style.backgroundColor = "transparent" }}
    >
      {children}
    </NavLink>
  )
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const sections = [
    ["Bio", "bio"],
    ["Education", "education"],
    ["Experience", "experience"],
    ["Publications", "publications"],
    ["Awards", "awards"],
    ["Activities", "activities"],
  ]

  useEffect(() => {
    const updateScrollState = () => setScrolled(window.scrollY > 0)
    updateScrollState()
    window.addEventListener("scroll", updateScrollState, { passive: true })
    return () => window.removeEventListener("scroll", updateScrollState)
  }, [])

  return (
    <header
      className="sticky top-0 z-40 py-3 transition-colors"
      style={{ backgroundColor: colors.white, borderBottom: scrolled ? `1px solid ${colors.grey100}` : "none" }}
    >
      <nav className="mx-auto flex w-full max-w-[768px] items-center px-4">
        <div className="relative inline-flex">
          <NavLink
            to="/"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex items-center rounded-[12px] px-4 py-2.5 font-mono text-sm font-bold transition-colors"
            style={{ color: colors.grey700, backgroundColor: "transparent" }}
            onMouseEnter={(event) => { event.currentTarget.style.backgroundColor = colors.grey100 }}
            onMouseLeave={(event) => { event.currentTarget.style.backgroundColor = "transparent" }}
          >
            About
          </NavLink>
          {open && (
            <div className="absolute left-0 top-[calc(100%+12px)] z-10">
              <div className="flex w-fit flex-col gap-1 rounded-[12px] p-2 shadow-[0_4px_16px_rgba(0,0,0,0.12)]" style={{ backgroundColor: colors.white }}>
                {sections.map(([label, id]) => (
                  <a
                    key={id}
                    href={`/#${id}`}
                    onClick={() => setOpen(false)}
                    className="rounded-[8px] px-4 py-2.5 text-sm font-bold leading-6 transition-colors"
                    style={{ backgroundColor: colors.white, color: colors.grey700 }}
                    onMouseEnter={(event) => { event.currentTarget.style.backgroundColor = colors.grey100 }}
                    onMouseLeave={(event) => { event.currentTarget.style.backgroundColor = colors.white }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        <HeaderLink to="/blog">Blog</HeaderLink>
      </nav>
    </header>
  )
}
