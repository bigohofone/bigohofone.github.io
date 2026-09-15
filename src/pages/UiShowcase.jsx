import { useState } from "react"
import { Pagination } from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckItem } from "@/components/ui/dropdown"

import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid"
import { BookmarkIcon as BookmarkOutline } from "@heroicons/react/24/outline"
import { ChevronDownIcon } from "@heroicons/react/24/outline"

function PaginationDemo() {
  const [page, setPage] = useState(1)
  return (
    <Pagination currentPage={page} totalPages={5} onPageChange={setPage} />
  )
}

function DropdownCheckDemo() {
  const [checked, setChecked] = useState(false)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">Options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuCheckItem checked={checked} onCheckedChange={setChecked}>Enable feature</DropdownMenuCheckItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function DropdownDemo() {
  const [open, setOpen] = useState(true)
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">Select</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Option 1</DropdownMenuItem>
        <DropdownMenuItem>Option 2</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function SegmentedControlDemo() {
  const [value, setValue] = useState("all")
  return (
    <SegmentedControl
      options={[
        { value: "all", label: "All" },
        { value: "selected", label: "Selected" },
      ]}
      value={value}
      onChange={setValue}
    />
  )
}

export default function UiShowcase() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 p-10 space-y-16">
      <h1 className="text-4xl font-bold">shadcn/ui Components</h1>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Button Variants</h2>
        <div className="flex gap-3 flex-wrap">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Button Sizes</h2>
        <div className="flex gap-3 items-center flex-wrap">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">X-Large</Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Checkbox</h2>
        <div className="flex items-center gap-4">
          <Checkbox size="sm" />
          <Checkbox size="md" />
          <Checkbox size="lg" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Dropdown</h2>
        <div className="flex gap-4 items-center">
          <DropdownDemo />
          <DropdownCheckDemo />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Pagination</h2>
        <PaginationDemo />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Segmented Control</h2>
        <SegmentedControlDemo />
      </section>
    </div>
  )
}
