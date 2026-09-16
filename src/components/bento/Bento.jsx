import { useState, useMemo, useEffect } from "react"
import { createPortal } from "react-dom"
import { Cross2Icon } from "@radix-ui/react-icons"
import { colors } from "@toss/tds-colors"

import { MarkdownRenderer } from "@/components/common/MarkdownRenderer"
import { Button } from "@/components/ui/button"
import { SegmentedControl } from "@/components/ui/segmented-control"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckItem
} from "@/components/ui/dropdown"
import { Checkbox } from "@/components/ui/checkbox"
import { Pagination } from "@/components/ui/pagination"

import {
  compareItemsByDateThenAlphabetical,
  startYear,
} from "@/utils/date"

import { ChevronDownIcon } from "@heroicons/react/24/outline"

import {ListRow} from "@/components/ui/ListRow"



function YearSelect({
  years,
  selectedYears,
  onToggleYear,
  onToggleAll,
}) {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="md">
          Years
          <ChevronDownIcon className="size-4 text-[#374151]" strokeWidth={2.5}/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit">
        <DropdownMenuCheckItem onClick={onToggleAll} checked={selectedYears.length === years.length}>
          All
        </DropdownMenuCheckItem>
        {years.map((year) => (
          <DropdownMenuCheckItem onClick={() => onToggleYear(year)} checked={selectedYears.includes(year)}>
            {year}
          </DropdownMenuCheckItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


// 1. MarkdownModal 수정 코드
function MarkdownModal({ md, onClose }) {
  const [mounted, setMounted] = useState(false)

  // SSR 환경 대응: 클라이언트 마운트 완료 후 포탈 렌더링
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!md) return

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose()
    }

    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [md, onClose])

  if (!mounted || !md) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white px-6 pt-0 pb-18 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end my-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="size-8 p-0 items-center justify-center rounded-full"
            aria-label="Close"
          >
            <Cross2Icon className="size-5" />
          </Button>
        </div>
        <MarkdownRenderer content={md} />
      </div>
    </div>,
    document.body
  )
}


export function Box({
  id,
  title,
  items = [],
  useCount = false,
  usePagination = false,
  useYearFilter = false,
  useSelectedFilter = false,
  pageSize = 10,
}) {
  const [page, setPage] = useState(1)
  const [showSelected, setShowSelected] = useState(true)
  const [selectedYears, setSelectedYears] = useState([])
  const [md, setMd] = useState(null)

  // 1. 연도 목록 계산 (불필요한 재연산 방지)
  const years = useMemo(() => {
    if (!useYearFilter) return []
    return [...new Set(items.map((item) => startYear(item.date)))]
      .filter((year) => /^\d{4}$/.test(year))
      .sort((a, b) => b.localeCompare(a))
  }, [items, useYearFilter])

  useEffect(() => {
    setSelectedYears(years)
  }, [years])

  // 2. 필터링 및 정렬 (조건식 단순화 및 메모이제이션)
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        if (useSelectedFilter && showSelected && item.selected === false) return false
        if (useYearFilter && !selectedYears.includes(startYear(item.date))) return false
        return true
      })
      .sort(compareItemsByDateThenAlphabetical)
  }, [items, useSelectedFilter, showSelected, useYearFilter, selectedYears])

  // 3. 페이지네이션 계산
  const totalPages = Math.ceil(filteredItems.length / pageSize)
  const visibleItems = usePagination
    ? filteredItems.slice((page - 1) * pageSize, page * pageSize)
    : filteredItems

  const toggleYear = (year) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    )
    setPage(1)
  }

  const toggleAllYears = () => {
    setSelectedYears((prev) => (prev.length === years.length ? [] : years))
    setPage(1)
  }

  const handleSelectedChange = (value) => {
    setShowSelected(value === "selected")
    setPage(1)
  }

  return (
    <>
      <section id={id} className="pt-16 pb-24">
        <div className="flex gap-2 mb-6">
          <h2 className="text-xl font-bold text-gray-700">{title}</h2>
          {useCount && (
            <span className="text-xl font-bold text-blue-500">{filteredItems.length}</span>
          )}
        </div>

        {(useYearFilter || useSelectedFilter) && (
          <div className="flex gap-2 mb-6">
            {useYearFilter && (
              <YearSelect
                years={years}
                selectedYears={selectedYears}
                onToggleYear={toggleYear}
                onToggleAll={toggleAllYears}
              />
            )}
            {useSelectedFilter && (
              <SegmentedControl
                options={[
                  { value: "all", label: "All" },
                  { value: "selected", label: "Selected" },
                ]}
                value={showSelected ? "selected" : "all"}
                onChange={handleSelectedChange}
              />
            )}
          </div>
        )}

        <ul>
          {visibleItems.map((item) => (
            <ListRow
              key={item.id || item.title}
              title={item.title}
              subtitle={`${item.date} · ${item.subtitle}`}
              onClick={item.md ? () => setMd(item.md) : undefined}
            />
          ))}
        </ul>

        {usePagination && totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </section>

      <MarkdownModal md={md} onClose={() => setMd(null)} />
    </>
  )
}