import { Routes, Route } from "react-router-dom"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { colors } from "@toss/tds-colors"
import ResumePage from "@/pages/ResumePage"
import BlogPage from "@/pages/BlogPage"
import UiShowcase from "@/pages/UiShowcase"

export default function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<ResumePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/ui" element={<UiShowcase />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  )
}
