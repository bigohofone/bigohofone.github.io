// 목록 행들이 공유하는 스타일 조각 — 한 곳에서 고치면 모든 행이 같이 바뀐다

// 날짜 알약 — 테두리 없이 반투명 tint 배경 (상세 팝업 머리에 쓴다)
export const datePillClass =
  "inline-flex h-6 items-center rounded-full bg-tint px-3 text-base/normal font-normal whitespace-nowrap text-fg-strong"

// 누를 수 있는 행 — 반투명 tint 를 깔아 띄운다 (포인터가 없는 모바일은 제외)
export const interactiveRowClass = "group/row cursor-pointer transition-colors sm:hover:bg-tint"

// 행 제목 — 그 행에 호버하면 링크색(한 단계 흐린 글자색)으로. interactiveRowClass 와 짝으로 쓴다
export const rowTitleHoverClass = "transition-colors sm:group-hover/row:text-link"
