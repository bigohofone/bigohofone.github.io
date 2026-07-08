import { useEffect, useState } from "react"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"

const STORAGE_KEY = "theme"

function readInitialTheme() {
  if (typeof window === "undefined") return "light"
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === "dark" ? "dark" : "light"
}

export function SiteFooter() {
  const [now, setNow] = useState(() => new Date())
  const [theme, setTheme] = useState(readInitialTheme)

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark"
    // Persist only on explicit choice so the site keeps following the OS
    // preference for users who never touch the toggle.
    window.localStorage.setItem(STORAGE_KEY, next)
    setTheme(next)
  }

  return (
    <footer className="py-8">
      <div className="mx-auto flex w-full max-w-[1080px] items-center justify-between px-5 text-sm text-heading">
        <p>© Wonjun Oh</p>
        <p className="tabular-nums">{now.toLocaleTimeString("en-US")}</p>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="-m-2 cursor-pointer p-2"
        >
          {theme === "dark" ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
        </button>
      </div>
    </footer>
  )
}
