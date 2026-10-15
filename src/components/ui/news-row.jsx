import { cn } from "@/lib/utils"
import { Overstrike } from "@/components/ui/overstrike"

// 내용 다음 줄에 날짜를 친다
export function NewsRow({ title, leading, onClick }) {
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      className={cn("outline-none", onClick && "cursor-pointer")}
    >
      {/* 한글은 단어 단위로 끊어 자연스럽게 줄바꿈한다 */}
      <Overstrike as="h3" className="break-keep text-fg-strong">
        {title}
      </Overstrike>
      {leading && <p>{leading}</p>}
    </div>
  )
}
