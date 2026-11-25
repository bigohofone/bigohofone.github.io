import { StrictMode } from "react"
import { createRoot, hydrateRoot } from "react-dom/client"
import App from "./App"
import "./index.css"

const root = document.getElementById("root")
const app = (
  <StrictMode>
    <App path={location.pathname} />
  </StrictMode>
)
// 배포 빌드는 HTML 이 미리 그려져 있어(vite-plugin-prerender.js) 이어받기만 한다
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)

// 개발 서버에서만 줄 격자(--grid)를 겹쳐 그려 줄 맞춤을 본다. 오른쪽 아래 버튼으로 켜고 끈다
if (import.meta.env.DEV) {
  const grid = document.createElement("div")
  grid.style.cssText =
    "position:absolute;inset:0;z-index:50;pointer-events:none;background:repeating-linear-gradient(transparent 0 calc(var(--grid) - 1px),rgb(255 0 0/.25) 0 var(--grid))"
  grid.hidden = localStorage.getItem("grid") === "off"
  const button = document.createElement("button")
  button.textContent = "Grid"
  button.style.cssText = "position:fixed;right:24px;bottom:24px;z-index:51;cursor:pointer;color:red"
  button.onclick = () => {
    grid.hidden = !grid.hidden
    localStorage.setItem("grid", grid.hidden ? "off" : "on")
  }
  document.body.style.position = "relative"
  document.body.append(grid, button)
}
