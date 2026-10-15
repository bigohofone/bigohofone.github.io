import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "@/App"
import "@/index.css"

// 첫 페인트 전에 저장된 테마를 적용한다 (ThemeToggle 이 같은 키에 저장). 기본은 라이트
document.documentElement.classList.toggle("dark", localStorage.getItem("theme") === "dark")

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
