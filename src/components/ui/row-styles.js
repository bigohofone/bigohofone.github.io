// 목록 행들이 공유하는 스타일 조각 — 한 곳에서 고치면 모든 행이 같이 바뀐다

// 누를 수 있는 행. 호버해도 배경은 그대로 두고 제목 글자색만 바꾼다 (rowTitleHoverClass).
// 행은 홀수 줄마다 밝은 배경으로 나뉘고 여백도 행이 직접 갖는다
export const interactiveRowClass = "group/row cursor-pointer"

// 행 제목 — 그 행에 호버하면 대표색(primary)으로. interactiveRowClass 와 짝으로 쓴다
export const rowTitleHoverClass = "transition-colors sm:group-hover/row:text-primary"
