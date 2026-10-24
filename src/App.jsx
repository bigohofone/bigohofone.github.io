import { useEffect, useRef } from "react"
import { Link, Routes, Route, useLocation } from "react-router-dom"

import { profile, sections } from "@/data"
import { downloadCV } from "@/lib/cv"
import Home from "@/pages/Home"
import Section from "@/pages/Section"

// 페이지를 옮기면 맨 위부터 보이게 한다
function ScrollToTop() {
  const { pathname } = useLocation()
  // 중괄호로 감싸 아무것도 돌려주지 않는다 — 요즘 브라우저의 scrollTo 는 Promise 를 돌려주는데,
  // 그대로 돌려주면 React 가 정리 함수로 알고 부르다 에러가 나 화면이 통째로 사라진다
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// 메뉴 높이를 --header-h 로 내보낸다 — 좁은 화면에선 두 줄로 넘어가 높이가 바뀌므로 잴 때마다 고친다
function useHeaderHeight(ref) {
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      document.documentElement.style.setProperty("--header-h", `${entry.borderBoxSize[0].blockSize}px`)
    })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref])
}

export default function App() {
  const headerRef = useRef(null)
  useHeaderHeight(headerRef)

  return (
    <>
      <ScrollToTop />
      {/* 메뉴 — 어느 페이지든 스크롤해도 화면 맨 위에 붙어 있다(sticky). 자기 높이만큼 자리를 차지해,
          좁은 화면에서 두 줄로 넘어가도 본문을 가리지 않는다. 아래 글이 비치지 않게 바탕색을 깐다 */}
      <header ref={headerRef} className="sticky top-0 z-10 bg-paper">
        <nav className="mx-auto box-content flex max-w-[675px] flex-wrap gap-x-4 gap-y-1 px-5 py-3">
          <Link to="/">{profile.name}</Link>
          {sections.map(({ path, title }) => (
            <Link key={path} to={`/${path}`}>
              {title}
            </Link>
          ))}
          <button type="button" onClick={downloadCV}>
            CV
          </button>
        </nav>
      </header>
      {/* 본문은 폭 675px 까지, 가운데 정렬. 좌우 20px 여백은 폭 밖에 둬(box-content) 좁은 화면에서도 글이 끝에 붙지 않는다.
          prose(typography 플러그인)가 문단·제목·목록·링크에 기본 여백과 크기를 준다 */}
      <main className="prose mx-auto box-content max-w-[675px] px-5">
        <Routes>
          <Route path="/" element={<Home />} />
          {sections.map((section) => (
            <Route key={section.path} path={`/${section.path}`} element={<Section section={section} />} />
          ))}
        </Routes>
      </main>
    </>
  )
}
