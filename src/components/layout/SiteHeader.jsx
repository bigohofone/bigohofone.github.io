import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"

const SECTIONS = [
  ["Bio", "bio"],
  ["Education", "education"],
  ["Experience", "experience"],
  ["Publications", "publications"],
  ["Awards", "awards"],
  ["Activities", "activities"],
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0)
    handleScroll()

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      window.location.href = `/#${id}`
      return
    }

    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <header
      className={`sticky top-0 z-40 py-2 bg-white transition-colors ${
        scrolled ? "border-b border-gray-100" : ""
      }`}
    >
      <nav className="mx-auto flex w-full max-w-3xl items-center justify-between px-4">
        <div className="flex items-center overflow-x-auto whitespace-nowrap py-1 scrollbar-none">
          {SECTIONS.map(([label, id]) => (
            <Button
              key={id}
              variant="ghost"
              size="md"
              onClick={() => scrollToSection(id)}
              className="shrink-0"
            >
              {label}
            </Button>
          ))}
        </div>
      </nav>
    </header>
  )
}