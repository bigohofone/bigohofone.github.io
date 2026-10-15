import { cn } from "@/lib/utils"

const DASHES = "-".repeat(200)

// 선 대신 하이픈을 타자로 한 줄 친다 — 글자와 같은 인쇄 효과를 받는다.
// 글자 단위로 줄을 바꾸고 첫 줄만 보여, 오른쪽 끝이 하이픈 중간에서 잘리지 않는다
export function DashRule({ className }) {
  return (
    <p
      aria-hidden
      className={cn(
        "pointer-events-none h-line overflow-hidden break-all text-fg-strong select-none",
        className
      )}
    >
      {DASHES}
    </p>
  )
}
