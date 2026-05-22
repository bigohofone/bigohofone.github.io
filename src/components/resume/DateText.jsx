export function DateText({ value }) {
  if (!value) return null
  const m = String(value).match(/^(.+?)\s+([–-])\s+(.+)$/)
  if (!m) return value
  return (
    <>
      {m[1]}
      <br />
      {`${m[2]} ${m[3]}`}
    </>
  )
}
