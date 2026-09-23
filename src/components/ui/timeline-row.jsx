import { cn } from "@/lib/utils"
import { datePillClass, rowTitleHoverClass } from "@/components/ui/row-styles"

const dotClass = "absolute size-3 rounded-full bg-fg-strong"

// 한 행이 한 기간 — 위 점이 끝(모바일은 시작), 아래 점이 시작이고 그 사이를 선으로 잇는다
export function TimelineRow({ title, subtitle, start, end, onClick }) {
  return (
    <li className="group flex gap-2.5 pb-16 last:pb-0 sm:gap-5">
      {/* sm 이상에서만 선 왼쪽에 두 알약을 나눠 둔다 — 폭을 고정해 레일을 정렬한다 */}
      <div className="hidden shrink-0 flex-col items-end gap-8 sm:flex sm:w-[84px]">
        {end && <small className={datePillClass}>{end}</small>}
        {start && <small className={datePillClass}>{start}</small>}
      </div>

      {/* 레일 — 모바일에선 선 왼쪽에 10px 여백을 둔다.
          점은 알약 중심에, 아래 점은 모바일에선 행 끝 / sm 이상에선 두 번째 알약(80px) 에 맞춘다 */}
      <div className="relative ml-2.5 flex w-3 shrink-0 justify-center self-stretch sm:ml-0">
        <span
          aria-hidden
          className="absolute top-3 bottom-1.5 w-[1.5px] bg-fg-strong sm:top-4 sm:bottom-auto sm:h-16"
        />
        {/* 아래 점에서 다음 행 위 점까지 — 행이 길어져도 pb-16(64px) + 점 반지름만큼 더 내려간다.
            CSS 점선은 끝이 각져서, 끝이 둥근 파선을 쓰려고 SVG 로 그린다 */}
        <svg
          aria-hidden
          className="absolute top-[calc(100%-6px)] -bottom-[76px] w-[1.5px] group-last:hidden sm:top-20 sm:-bottom-20"
        >
          <line
            x1="1"
            y1="0"
            x2="1"
            y2="100%"
            className="stroke-fg-strong"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="2 6"
          />
        </svg>
        <span aria-hidden className={cn(dotClass, "top-1.5 sm:top-2.5")} />
        <span aria-hidden className={cn(dotClass, "bottom-0 sm:bottom-auto sm:top-[74px]")} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {/* 모바일에선 기간을 한 알약으로 묶어 선 오른쪽 맨 위, 위 점과 나란히 둔다 */}
        {start && (
          <small className={cn(datePillClass, "self-start sm:hidden")}>
            {end ? `${start} – ${end}` : start}
          </small>
        )}
        {/* 클릭은 제목/부제목 영역에만 건다 — 날짜와 레일은 그대로 둔다 */}
        <div
          role={onClick ? "button" : undefined}
          tabIndex={onClick ? 0 : undefined}
          onClick={onClick}
          className={cn(
            // 모바일에선 알약보다 8px 안쪽으로 들여 쓴다
            "flex w-full flex-col gap-1 pl-2 outline-none sm:min-h-24 sm:pl-0",
            // sm 이상의 클릭 블록만 — 다른 행들과 같은 여백으로 좌우를 채우고 흰색 20% 를 덮어 밝게 띄운다
            // 위아래 -my-2 만큼 끌어올리므로 min-h 도 그만큼(16px) 더 잡아야 96px 로 놓인다
            onClick &&
              "group/row cursor-pointer sm:-mx-3 sm:-my-2 sm:min-h-28 sm:rounded-lg sm:px-3 sm:py-2 sm:transition-colors sm:hover:bg-white/20"
          )}
        >
          {/* sm 이상: 줄간격 28px + 윗여백 (32-28)/2 = 2px 로 첫 줄 중심을 위 점(16px)에 맞춘다 */}
          <h3
            className={cn(
              "text-base/normal font-medium text-fg-strong sm:pt-0.5 sm:text-[20px]/[28px]",
              rowTitleHoverClass
            )}
          >
            {title}
          </h3>
          {subtitle && (
            <small className="text-sm/normal font-normal text-fg-strong sm:text-[16px]/normal">
              {subtitle}
            </small>
          )}
        </div>
      </div>
    </li>
  )
}
