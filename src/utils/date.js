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
export function parseDateRange(dateStr) {
  if (!dateStr) return { start: 0, end: 0 }

  const str = String(dateStr).trim()
  const isPresent = /present/i.test(str)

  const parts = str.split(/\s*~\s*/)

  if (parts.length >= 2) {
    return {
      start: parseSingleDate(parts[0], false),
      end: isPresent
        ? new Date().getFullYear()
        : parseSingleDate(parts[1], true),
    }
  }

  const point = parseSingleDate(str, false)
  return { start: point, end: point }
}











/**
 * Compare two items by date descending (newest first).
 * Falls back to alphabetical (A-Z) when dates are equal.
 */
export function compareItemsByDateThenAlphabetical(a, b) {
  const rangeA = parseDateRange(a.date || "")
  const rangeB = parseDateRange(b.date || "")

  if (rangeA.end !== rangeB.end) return rangeB.end - rangeA.end
  if (rangeA.start !== rangeB.start) return rangeB.start - rangeA.start

  const labelA = String(a.title || a.organization || a.major || a.role || "").toLowerCase()
  const labelB = String(b.title || b.organization || b.major || b.role || "").toLowerCase()
  return labelA.localeCompare(labelB)
}

/**
 * Returns all 4-digit years covered by the date/range string (inclusive).
 * e.g. "2024-03 ~ 2025-08" → ["2024", "2025"]
 *      "2026-09 ~ Present"  → ["2026", "<current year>"]
 */
export function getYearsInRange(dateStr) {
  const { start, end } = parseDateRange(dateStr)
  if (!start && !end) return []

  const startYear = Math.floor(start / 10000)
  const endYear = end === 99991231 ? new Date().getFullYear() : Math.floor(end / 10000)

  if (!startYear) return []

  const years = []
  for (let y = startYear; y <= endYear; y++) years.push(String(y))
  return years
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
 * Returns the end year string from a date/range string.
 * e.g. "2024-03 ~ 2025-08" → "2025"
 */
export function endYear(dateStr) {
  const { end } = parseDateRange(dateStr)
  if (end === 99991231) return String(new Date().getFullYear())
  const y = Math.floor(end / 10000)
  return y ? String(y) : String(dateStr ?? "")
}
