import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

import { chipIconClass } from "@/components/ui/chip"

// 화면 오른쪽 위에 떠 있는 다크 모드 전환 버튼 — Contact 처럼 테두리 없이 아이콘만
export function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  )

  // main.jsx 가 첫 페인트 전에 읽는 것과 같은 키에 저장한다
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
    localStorage.setItem("theme", dark ? "dark" : "light")
  }, [dark])

  const Icon = dark ? Sun : Moon

  return (
    <button
      type="button"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={dark}
      onClick={() => setDark((prev) => !prev)}
      className="fixed top-4 right-4 z-40 inline-flex size-10 items-center justify-center rounded-full bg-bg text-fg-strong outline-none transition-colors hover:text-link"
    >
      <Icon className={chipIconClass} aria-hidden="true" />
    </button>
  )
}
