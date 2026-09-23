import { cn } from "@/lib/utils"

export function NewsRow({ title, leading, onClick }) {
  return (
    <li
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      // 언제나 한 열 — 내용 아래에 날짜를 둔다
      className={cn(
        "group relative flex flex-col-reverse gap-1 p-2.5 outline-none",
        onClick && "cursor-pointer"
      )}
    >
      {/* border 로는 끝을 둥글게 할 수 없어 1.5px 막대를 깔아 선으로 쓴다 */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 hidden h-[1.5px] rounded-full bg-fg-strong group-first:block"
      />
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-[1.5px] rounded-full bg-fg-strong" />

      {leading && (
        <small className="text-xs/normal font-normal sm:text-[15px]/normal">{leading}</small>
      )}

      {/* 한글은 단어 단위로 끊어 자연스럽게 줄바꿈한다 */}
      <h3 className="min-w-0 flex-1 break-keep text-base/normal font-normal text-fg-strong sm:text-[20px]/normal">
        {title}
      </h3>
    </li>
  )
}
