import { NavLink } from "react-router-dom"
import { useEffect, useState } from "react"
import { colors } from "@toss/tds-colors"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown"
import { Button } from "@/components/ui/button"
import { ChevronDownIcon } from "@heroicons/react/24/outline"

// Same mono-uppercase voice as the box header strips; the active page is
// underlined, inactive links sit in the faint grey until hovered.
function HeaderLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className="rounded-[12px] px-4 py-2.5 font-mono text-sm font-bold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
      <nav className="mx-auto flex w-full max-w-[768px] items-center justify-between px-4">
        <div></div>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="md" className="inline-flex items-center gap-2 rounded-xl">
              Shortcut <ChevronDownIcon className="!size-4 text-[#374151]" strokeWidth={2.5} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-fit">
            {sections.map(([label, id]) => (
              <DropdownMenuItem key={id}>
                <a href={`/#${id}`} onClick={() => setOpen(false)} className="text-sm font-bold" style={{ color: colors.grey700 }}>{label}</a>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* <HeaderLink to="/blog">Blog</HeaderLink> */}
      </nav>
    </header>
  )
}
