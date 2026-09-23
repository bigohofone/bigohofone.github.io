import { Routes, Route } from "react-router-dom"
import ResumePage from "@/pages/ResumePage"
import UiShowcase from "@/pages/UiShowcase"

export default function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<ResumePage />} />
          <Route path="/ui" element={<UiShowcase />} />
        </Routes>
      </main>
    </div>
  )
}
