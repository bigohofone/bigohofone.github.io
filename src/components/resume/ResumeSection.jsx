import { useMemo, useState } from "react"

import { ListRow } from "@/components/ui/list-row"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import { Modal } from "@/components/ui/modal"
import { Pagination } from "@/components/ui/pagination"
import { compareItemsByDateThenAlphabetical } from "@/utils/date"

/**
 * 제목 + 목록으로 이루어진 이력 섹션.
 * 행의 생김새는 Row 로 갈아끼운다. 항목에 link 가 있으면 새 탭으로 열고,
 * 없으면 본문(md)을 모달로 띄운다. 둘 다 없으면 누를 수 없는 행이 된다.
 */
export function ResumeSection({
  id,
  title,
  items,
  Row = ListRow, // 행 모양을 통째로 갈아끼운다 (예: PublicationRow)
  usePagination = false,
  pageSize = 10,
  paginationSize = "sm",
  extraTitleGap = false, // 제목과 목록 사이를 20px 더 띄운다
  footnote = null, // 목록 아래에 붙는 주석 (예: 저자 기호 설명)
}) {
  const [page, setPage] = useState(1)
  const [openMd, setOpenMd] = useState(null)

  // selected: false 로 표시한 항목은 숨긴다 (값이 없으면 보여준다)
  const visibleItems = useMemo(
    () => items.filter((item) => item.selected !== false).sort(compareItemsByDateThenAlphabetical),
    [items]
  )

  const rowAction = (item) => {
    if (item.link) return () => window.open(item.link, "_blank", "noopener,noreferrer")
    if (item.md) return () => setOpenMd(item.md)
    return undefined
  }

  const totalPages = usePagination ? Math.ceil(visibleItems.length / pageSize) : 1
  const pagedItems = usePagination
    ? visibleItems.slice((page - 1) * pageSize, page * pageSize)
    : visibleItems

  return (
    <>
      <section id={id} className="px-5 pb-30">
        {title && (
          <>
            <h2 className="text-center text-[28px] font-medium text-fg-strong sm:text-[32px]">
              {title}
            </h2>
            <div className={extraTitleGap ? "h-15" : "h-10"} />
          </>
        )}

        <ul className="flex flex-col">
          {pagedItems.map((item) => (
            <Row
              key={item.id ?? item.title}
              {...item}
              onClick={rowAction(item)}
            />
          ))}
        </ul>

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            size={paginationSize}
          />
        )}

        {footnote && (
          <div className="mt-10 text-left text-sm/relaxed font-normal text-fg-muted">{footnote}</div>
        )}
      </section>

      <Modal open={Boolean(openMd)} onClose={() => setOpenMd(null)}>
        <MarkdownRenderer content={openMd ?? ""} />
      </Modal>
    </>
  )
}
