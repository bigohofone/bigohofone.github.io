// 문자열 그림을 격자 한 칸(--cell) = 한 픽셀로 그린다. colors 는 글자 → 칸 색 클래스이고, "." 은 비운다.
// 기본은 "1" 만 글자색(currentColor)으로 칠한다
export function PixelBitmap({ rows, colors = { 1: "fill-current" }, className, style }) {
  const width = rows[0].length
  return (
    <svg
      viewBox={`0 0 ${width} ${rows.length}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={className}
      style={{ width: `calc(${width} * var(--cell))`, height: `calc(${rows.length} * var(--cell))`, ...style }}
    >
      {rows.flatMap((row, y) =>
        [...row].map(
          (dot, x) =>
            colors[dot] && <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" className={colors[dot]} />
        )
      )}
    </svg>
  )
}
