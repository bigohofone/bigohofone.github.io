import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
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
} from "@/components/ui/dropdown"
import { Checkbox } from "@/components/ui/checkbox"
import { Pagination } from "@/components/ui/pagination"

import {
  compareItemsByDateThenAlphabetical,
  startYear,
} from "@/utils/date"

import { ChevronDownIcon } from "@heroicons/react/24/outline"


function YearSelect({
  years,
  selectedYears,
  onToggleYear,
  onToggleAll,
}) {
  const [open, setOpen] = useState(false)
  const allSelected = selectedYears.length === years.length

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="md"
          className="inline-flex items-center gap-2 rounded-xl"
        >
          Years
          <ChevronDownIcon
            className="h-4 w-4 text-[#374151]"
            strokeWidth={2}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-fit">
        <DropdownMenuItem onClick={onToggleAll}>
          <label
            className="flex cursor-pointer items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              checked={allSelected}
              onCheckedChange={onToggleAll}
            />
            <span className="text-sm">All</span>
          </label>
        </DropdownMenuItem>

        {years.map((year) => (
          <DropdownMenuItem
            key={year}
            onClick={() => onToggleYear(year)}
          >
            <label
              className="flex cursor-pointer items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Checkbox
                checked={selectedYears.includes(year)}
                onCheckedChange={() => onToggleYear(year)}
              />
              <span className="text-sm">{year}</span>
            </label>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


function SectionControls({
  showSelected,
  onToggleSelected,
  years,
  selectedYears,
  onToggleYear,
  onToggleAll,
}) {
  return (
    <div className="flex items-start gap-2">
      {years && (
        <YearSelect
          years={years}
          selectedYears={selectedYears}
          onToggleYear={onToggleYear}
          onToggleAll={onToggleAll}
        />
      )}

      {onToggleSelected && (
        <SegmentedControl
          options={[
            { value: "all", label: "All" },
            { value: "selected", label: "Selected" },
          ]}
          value={showSelected ? "selected" : "all"}
          onChange={(value) =>
            onToggleSelected(value === "selected")
          }
        />
      )}
    </div>
  )
}


function MarkdownModal({ md, onClose }) {
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

  if (!md) return null

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-end mb-4">
            <Button
              variant="ghost"
              onClick={onClose}
              className="size-11 p-0"
              aria-label="Close"
            >
              <Cross2Icon className="size-5" />
            </Button>
          </div>
          <MarkdownRenderer content={md} />
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}


function Row({
  title,
  subtitle,
  date,
  onClick,
}) {
  const present = /present/i.test(date || "")
  const [shaking, setShaking] = useState(false)

  const handleClick = () => {
    if (onClick) {
      onClick()
      return
    }

    setShaking(false)

    setTimeout(() => {
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
    }, 10)
  }

  return (
    <motion.li
      animate={
        shaking
          ? { x: [-6, 6, -5, 5, -3, 3, 0] }
          : { x: 0 }
      }
      transition={{ duration: 0.4 }}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          handleClick()
        }
      }}
      className="
        group relative cursor-pointer rounded-xl px-2 py-3
        outline-none transition-colors duration-150
        hover:bg-gray-100
        focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
        flex min-w-0 flex-1 flex-col gap-2
      "
    >
      <h3 className="!mt-0">
        {title}
      </h3>

      <p className="!mt-0">
        <span style={{ color: present ? colors.blue500 : colors.grey500 }}>
          {date}
        </span>
        <span style={{ color: colors.grey300 }}> · </span>
        <span style={{ color: colors.grey500 }}>{subtitle}</span>
      </p>
    </motion.li>
  )
}


export function Box({
  id,
  title,
  items = [],
  useCount = true,
  usePagination = false,
  useYearFilter = false,
  useSelectedFilter = false,
  pageSize = 10,
}) {
  const [page, setPage] = useState(1)
  const [showSelected, setShowSelected] = useState(false)
  const [selectedYears, setSelectedYears] = useState([])
  const [md, setMd] = useState(null)

  const years = [
    ...new Set(items.map((item) => startYear(item.date))),
  ]
    .filter((year) => /^\d{4}$/.test(year))
    .sort()
    .reverse()

  useEffect(() => {
    setSelectedYears(years)
  }, [items])

  const filteredItems = [...items]
    .filter(
      (item) =>
        (!useSelectedFilter ||
          !showSelected ||
          item.selected !== false) &&
        (!useYearFilter ||
          selectedYears.includes(startYear(item.date)))
    )
    .sort(compareItemsByDateThenAlphabetical)

  const totalPages = Math.ceil(
    filteredItems.length / pageSize
  )

  const visibleItems = usePagination
    ? filteredItems.slice(
        (page - 1) * pageSize,
        page * pageSize
      )
    : filteredItems

  const toggleYear = (year) => {
    setSelectedYears((current) =>
      current.includes(year)
        ? current.filter((value) => value !== year)
        : [...current, year]
    )
    setPage(1)
  }

  const toggleAllYears = () => {
    setSelectedYears((current) =>
      current.length === years.length ? [] : years
    )
    setPage(1)
  }

  return (
    <>
      <section id={id} className="pt-12 pb-18">
        <div className="mb-6 flex items-center gap-2">
          <h2 className="!mt-0">
            {title}
          </h2>
          {useCount && (
            <span className="text-xl font-bold" style={{ color: colors.blue500 }}>
              {filteredItems.length}
            </span>
          )}
        </div>

        {(useYearFilter || useSelectedFilter) && (
          <div className="mb-6">
            <SectionControls
              showSelected={showSelected}
              onToggleSelected={
                useSelectedFilter
                  ? setShowSelected
                  : undefined
              }
              years={useYearFilter ? years : undefined}
              selectedYears={selectedYears}
              onToggleYear={toggleYear}
              onToggleAll={toggleAllYears}
            />
          </div>
        )}

        <ul>
          {visibleItems.map((item) => (
            <Row
              key={item.title}
              title={item.title}
              subtitle={item.subtitle}
              date={item.date}
              onClick={
                item.md
                  ? () => setMd(item.md)
                  : undefined
              }
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

      <MarkdownModal
        md={md}
        onClose={() => setMd(null)}
      />
    </>
  )
}