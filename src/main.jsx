import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "@/App"
import "@/index.css"

// Initialize theme from localStorage or system preference before render
// so the first paint matches the user's choice (no light-then-dark flash).
const stored = localStorage.getItem("theme")
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
const initialTheme = stored === "light" || stored === "dark" ? stored : prefersDark ? "dark" : "light"
document.documentElement.classList.toggle("dark", initialTheme === "dark")

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
