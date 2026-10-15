import { cn } from "@/lib/utils"

// 겹쳐 쓰기 — 타자기에서 같은 자리를 한 번 더 친 것처럼, 다른 노이즈(#print-2)로 어긋나는 글자를 하나 더 겹친다
export function Overstrike({ as: Tag, className, children }) {
  return (
    <div className="relative">
      <Tag className={className}>{children}</Tag>
      {/* 같은 태그로 그려야 줄바꿈 규칙(h1·h2 balance, h3~ pretty)이 같아져 두 벌이 같은 자리에서 줄을 바꾼다 */}
      <Tag
        aria-hidden
        className={cn(
          className,
          "pointer-events-none absolute inset-0 translate-x-[0.5px] translate-y-[0.3px] select-none [filter:url(#print-2)]"
        )}
      >
        {children}
      </Tag>
    </div>
  )
}
