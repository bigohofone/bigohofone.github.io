import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "@/App"
import "@/index.css"

// 다크 모드 토글(ThemeToggle)은 지금 숨겨 두었다. 예전에 저장된 "dark" 로
// 갇히지 않도록 저장값을 복원하지 않는다. 토글을 되살리면 아래 줄도 함께 되살린다.
// document.documentElement.classList.toggle("dark", localStorage.getItem("theme") === "dark")

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
