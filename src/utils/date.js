/**
 * Unified Date Format Specification:
 *
 * Standard single date (mm and dd are optional):
 *   "YYYY"          e.g. "2025"
 *   "YYYY-MM"       e.g. "2025-05"
 *   "YYYY-MM-DD"    e.g. "2025-05-15"
 *   "Present"       (case-insensitive)
 *
 * Standard date range — connect two dates with " ~ ":
 *   "YYYY-MM ~ YYYY-MM"        e.g. "2024-03 ~ 2024-10"
 *   "YYYY-MM ~ Present"        e.g. "2026-09 ~ Present"
 *   "YYYY ~ YYYY"              e.g. "2019 ~ 2026"
 */

/**
 * Parses a single date token into an integer timestamp YYYYMMDD.
 * @param {string} token
 * @param {boolean} isEnd  When true, missing mm/dd default to 12/31 (end of period).
 * @returns {number}
 */
function parseSingleDate(token, isEnd = false) {
  if (!token) return 0
  const t = token.trim()

  if (/^present$/i.test(t)) return 99991231

  // YYYY-MM-DD
  const fullMatch = t.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (fullMatch) {
    return parseInt(fullMatch[1]) * 10000 + parseInt(fullMatch[2]) * 100 + parseInt(fullMatch[3])
  }

  // YYYY-MM
  const ymMatch = t.match(/^(\d{4})-(\d{2})$/)
  if (ymMatch) {
    const year = parseInt(ymMatch[1])
    const month = parseInt(ymMatch[2])
    return year * 10000 + month * 100 + (isEnd ? 28 : 1)
  }

  // YYYY
  const yMatch = t.match(/^(\d{4})$/)
  if (yMatch) {
    const year = parseInt(yMatch[1])
    return year * 10000 + (isEnd ? 1231 : 101)
  }

  return 0
}

/**
 * Parses a date or date-range string "Date ~ Date" → { start, end, isPresent }.
 */
function parseDateRange(dateStr) {
  if (!dateStr) return { start: 0, end: 0 }

  const str = String(dateStr).trim()
  const isPresent = /present/i.test(str)

  const parts = str.split(/\s*~\s*/)

  if (parts.length >= 2) {
    return {
      start: parseSingleDate(parts[0], false),
      end: isPresent
        ? 99991231
        : parseSingleDate(parts[1], true),
    }
  }

  const point = parseSingleDate(str, false)
  return { start: point, end: point }
}

/**
 * Compare two items by start date descending (newest first).
 * Ties break on the end date, then alphabetically (A-Z).
 */
export function compareItemsByDateThenAlphabetical(a, b) {
  const rangeA = parseDateRange(a.date || "")
  const rangeB = parseDateRange(b.date || "")

  if (rangeA.start !== rangeB.start) return rangeB.start - rangeA.start
  if (rangeA.end !== rangeB.end) return rangeB.end - rangeA.end

  const labelA = String(a.title || a.organization || a.major || a.role || "").toLowerCase()
  const labelB = String(b.title || b.organization || b.major || b.role || "").toLowerCase()
  return labelA.localeCompare(labelB)
}

/**
 * Returns the start year string from a date/range string.
 * e.g. "2024-03 ~ 2025-08" → "2024"
 */
export function startYear(dateStr) {
  const { start } = parseDateRange(dateStr)
  const y = Math.floor(start / 10000)
  return y ? String(y) : String(dateStr ?? "")
}

/**
 * Label shown next to a resume item.
 *   "2026-08-31 ~ Present"      → "Present"
 *   "2019-03-04 ~ 2026-02-25"   → "2019"   (start year only)
 *   "2025-05-27" / "2025"       → "2025"   (single date → its year)
 */
export function formatDateLabel(dateStr) {
  if (!dateStr) return ""

  const { end } = parseDateRange(dateStr)
  if (end === 99991231) return "Present"

  return startYear(dateStr)
}

/**
 * Month/year label for news rows: "2026-08-31" → "Aug. 2026"
 * Falls back to the year when the date has no month (e.g. "2026").
 */
export function formatMonthYear(dateStr) {
  if (!dateStr) return ""
  if (!/^\d{4}-\d{2}/.test(String(dateStr).trim())) return startYear(dateStr)

  const { start } = parseDateRange(dateStr)
  const year = Math.floor(start / 10000)
  const month = Math.floor(start / 100) % 100

  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return `${names[month - 1]}. ${year}`
}

/**
 * Splits a date/range string into the two endpoint labels used by the timeline.
 *   "2026-03-30 ~ 2026-08-28" → { start: "Mar. 2026", end: "Aug. 2026" }
 *   "2026-08-31 ~ Present"    → { start: "Aug. 2026", end: "Present" }
 *   "2025-05-27"              → { start: "May. 2025", end: "" }
 */
export function formatDateEndpoints(dateStr) {
  if (!dateStr) return { start: "", end: "" }

  const parts = String(dateStr).trim().split(/\s*~\s*/)
  if (parts.length < 2) return { start: formatMonthYear(parts[0]), end: "" }

  return {
    start: formatMonthYear(parts[0]),
    end: /^present$/i.test(parts[1].trim()) ? "Present" : formatMonthYear(parts[1]),
  }
}
