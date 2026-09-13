import { load } from "js-yaml"

export function parseMarkdownWithYaml(rawContent) {
  if (typeof rawContent !== "string") {
    return { metadata: {}, content: "" }
  }

  // Check for leading YAML frontmatter: --- \n ... \n ---
  const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (match) {
    try {
      const metadata = load(match[1]) || {}
      const content = match[2].trim()
      return { metadata, content }
    } catch (e) {
      console.error("Failed to parse YAML frontmatter:", e)
      return { metadata: {}, content: rawContent }
    }
  }

  return { metadata: {}, content: rawContent.trim() }
}
