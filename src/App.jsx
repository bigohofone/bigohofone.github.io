import { Routes, Route } from "react-router-dom"
import { SiteFooter } from "@/components/layout/SiteFooter"
import ResumePage from "@/pages/ResumePage"

export default function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<ResumePage />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  )
}
