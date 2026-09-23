// 목록 행들이 공유하는 스타일 조각 — 한 곳에서 고치면 모든 행이 같이 바뀐다

// 날짜 알약 — 모바일 24px / sm 이상 32px 높이, Contact 칩과 같은 테두리 규칙
export const datePillClass =
  "inline-flex h-6 items-center rounded-full border-[1.5px] border-fg-strong px-2 text-[11px]/normal font-normal whitespace-nowrap text-fg-strong sm:h-8 sm:px-3 sm:text-xs/normal"

// 누를 수 있는 행 — 배경색에 상관없이 흰색 20% 를 덮어 밝게 띄운다 (포인터가 없는 모바일은 제외)
export const interactiveRowClass =
  "group/row -mx-3 cursor-pointer rounded-lg px-3 transition-colors sm:hover:bg-white/20"

// 행 제목 — 그 행에 호버하면 파랗게. interactiveRowClass 와 짝으로 쓴다
export const rowTitleHoverClass = "transition-colors sm:group-hover/row:text-blue-500"
