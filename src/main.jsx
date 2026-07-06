import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "@/App"
import "@/index.css"

// Initialize theme from localStorage before render so the first paint matches
// the user's choice. Default is always light — no system-preference fallback.
const stored = localStorage.getItem("theme")
document.documentElement.classList.toggle("dark", stored === "dark")

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
