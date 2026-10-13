// 문자열 그림("1" 이 칠한 칸)을 격자 한 칸(--cell) = 한 픽셀로 그린다. 색은 글자색(currentColor)을 따른다
export function PixelBitmap({ rows, className, style }) {
  const width = rows[0].length
  return (
    <svg
      viewBox={`0 0 ${width} ${rows.length}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={className}
      style={{ width: `calc(${width} * var(--cell))`, fill: "currentColor", ...style }}
    >
      {rows.flatMap((row, y) =>
        [...row].map((dot, x) => dot === "1" && <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />)
      )}
    </svg>
  )
}
