import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./ThemeToggle"

export function TopNav() {
  return (
    <header className="fixed top-0 z-40 w-full border-b bg-background">
      <div className="mx-auto flex h-14 w-full max-w-4xl items-center px-4">
        <Button asChild variant="ghost" className="px-0 hover:bg-transparent hover:text-primary">
          <a href="/">Wonjun</a>
        </Button>
        <nav className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
