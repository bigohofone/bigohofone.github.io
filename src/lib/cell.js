// 격자 한 칸의 px 크기와 본문 칸 수 — index.css 의 --cell · --frame-cells 와 같은 구간 값.
// 스크롤마다 부르므로 getComputedStyle 로 읽지 않고 창 폭으로 바로 정한다
export const cellPx = () => (window.innerWidth >= 720 ? 8 : 6)
export const frameCells = () => (window.innerWidth >= 720 ? 90 : 60)
