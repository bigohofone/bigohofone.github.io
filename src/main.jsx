import { StrictMode } from "react"
import { createRoot, hydrateRoot } from "react-dom/client"
import App from "./App"
import "./index.css"

const root = document.getElementById("root")
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)
// 배포 빌드는 HTML 이 미리 그려져 있어(vite-plugin-prerender.js) 이어받기만 한다
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
