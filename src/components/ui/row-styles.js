// 목록 행들이 공유하는 스타일 조각 — 한 곳에서 고치면 모든 행이 같이 바뀐다

// 날짜 알약 — 24px 높이 · 좌우 12px, 테두리 없이 blue-50 배경 (다크: 배경보다 한 단계 밝은 surface-subtle)
export const datePillClass =
  "inline-flex h-6 items-center rounded-full bg-blue-50 px-3 dark:bg-surface-subtle text-[11px]/normal font-normal whitespace-nowrap text-fg-strong"

// 누를 수 있는 행 — 배경을 blue-50 (다크: gray-800) 으로 밝게 띄운다 (포인터가 없는 모바일은 제외)
export const interactiveRowClass =
  "group/row -mx-3 cursor-pointer rounded-lg px-3 transition-colors sm:hover:bg-blue-50 dark:sm:hover:bg-gray-800"

// 행 제목 — 그 행에 호버하면 파랗게. interactiveRowClass 와 짝으로 쓴다
export const rowTitleHoverClass = "transition-colors sm:group-hover/row:text-link"
