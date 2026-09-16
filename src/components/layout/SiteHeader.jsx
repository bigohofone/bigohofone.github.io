import { NavLink, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

// 1. asChild를 활용해 NavLink를 원활하게 랜더링하도록 수정
function HeaderLink({ to, children, onClick }) {
  return (
    <Button asChild variant="ghost" size="lg">
      <NavLink to={to} onClick={onClick}>
        {children}
      </NavLink>
    </Button>
  )
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

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

  // 2. 특정 섹션 id 위치로 스무스 스크롤 이동 함수
  const scrollToSection = (id) => {
    // 메인 페이지가 아닐 경우 메인페이지로 이동 처리 후 스크롤
    if (location.pathname !== "/") {
      window.location.href = `/#${id}`
      return
    }

    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header
      className={`sticky top-0 z-40 py-2 bg-white transition-colors ${
        scrolled ? "border-b border-gray-100" : ""
      }`}
    >
      <nav className="mx-auto flex w-full max-w-3xl items-center justify-between px-4">
        {/* 왼쪽: Bio, Education 등 페이지 내 섹션 바로가기 */}
        <div className="flex items-center">
          {sections.map(([label, id]) => (
            <Button
              key={id}
              variant="ghost"
              size="md"
              onClick={() => scrollToSection(id)}
            >
              {label}
            </Button>
          ))}
        </div>

        {/* 오른쪽: 라우터 일반 페이지 링크 */}
        {/* <div className="flex items-center gap-1">
          <HeaderLink to="/">About</HeaderLink>
          <HeaderLink to="/blog">Blog</HeaderLink>
        </div> */}
      </nav>
    </header>
  )
}