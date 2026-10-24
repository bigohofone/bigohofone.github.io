import { load } from "js-yaml"

export function parseMarkdownWithYaml(rawContent) {
  if (typeof rawContent !== "string") {
    return {
      metadata: {},
      content: "",
      rawContent: "",
    }
  }

  const match = rawContent.match(
    /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/
  )

  if (match) {
    try {
      const metadata = load(match[1]) || {}
      const content = match[2].trim()

      return {
        metadata,
        content,
        rawContent,
      }
    } catch (e) {
      console.error("Failed to parse YAML frontmatter:", e)

      return {
        metadata: {},
        content: rawContent.trim(),
        rawContent,
      }
    }
  }

  return {
    metadata: {},
    content: rawContent.trim(),
    rawContent,
  }
}
// 마크다운 표를 첫 줄(머리글)을 키로 하는 객체 목록으로 읽는다. 두 번째 줄(---)은 구분선이라 건너뛴다
export function parseMarkdownTable(text) {
  const [header, , ...rows] = text
    .trim()
    .split("\n")
    .map((line) => line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim()))
  return rows.map((cells) => Object.fromEntries(header.map((key, i) => [key, cells[i]])))
}
