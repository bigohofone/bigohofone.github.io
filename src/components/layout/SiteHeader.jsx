import { NavLink } from "react-router-dom"

// Same mono-uppercase voice as the box header strips; the active page is
// underlined, inactive links sit in the faint grey until hovered.
function HeaderLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `font-mono text-sm uppercase tracking-wide transition-colors ${
          isActive
            ? "text-heading underline decoration-1 underline-offset-4"
            : "text-faint hover:text-heading"
        }`
      }
    >
      {children}
    </NavLink>
  )
}

export function SiteHeader() {
  return (
    <header className="py-6">
      <nav className="mx-auto flex w-full max-w-[1080px] items-center gap-6 px-5">
        <HeaderLink to="/">About</HeaderLink>
        <HeaderLink to="/blog">Blog</HeaderLink>
      </nav>
    </header>
  )
}
