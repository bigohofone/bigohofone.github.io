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
    <Button as={NavLink} to={to} variant="ghost" size="md">
      {children}
    </Button>
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
      <nav className="mx-auto flex w-full max-w-3xl items-center justify-between px-4">
        <div>

        </div>
        <div className="flex items-center gap-2">
          <HeaderLink to="/">About</HeaderLink>
          <HeaderLink to="/blog">Blog</HeaderLink>
        </div>
      </nav>
    </header>
  )
}
