import { useEffect, useState } from "react"

// 미디어 쿼리 결과를 따라가는 훅 — 화면 크기에 따라 동작(모션 등)을 갈라야 할 때 쓴다
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = (event) => setMatches(event.matches)

    setMatches(mql.matches)
    mql.addEventListener("change", onChange)

    return () => mql.removeEventListener("change", onChange)
  }, [query])

  return matches
}
