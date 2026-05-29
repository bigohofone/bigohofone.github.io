import { Routes, Route } from "react-router-dom"
import { TopNav } from "@/components/layout/TopNav"
import { SiteFooter } from "@/components/layout/SiteFooter"
import ResumePage from "@/pages/ResumePage"

export default function App() {
  return (
    <div className="min-h-screen">
      <TopNav />
      <Routes>
        <Route path="/" element={<ResumePage />} />
      </Routes>
      <SiteFooter />
    </div>
  )
}
