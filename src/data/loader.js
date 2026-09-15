import { parseMarkdownWithYaml } from "@/utils/markdown"
import { compareItemsByDateThenAlphabetical } from "@/utils/date"

// Use Vite's glob import to automatically load all markdown files per section
const educationFiles = import.meta.glob("./Education/*.md", { eager: true, query: "?raw", import: "default" })
const experienceFiles = import.meta.glob("./Experience/*.md", { eager: true, query: "?raw", import: "default" })
const publicationsFiles = import.meta.glob("./Publications/*.md", { eager: true, query: "?raw", import: "default" })
const awardsFiles = import.meta.glob("./Awards/*.md", { eager: true, query: "?raw", import: "default" })
const talksFiles = import.meta.glob("./Talks/*.md", { eager: true, query: "?raw", import: "default" })
const extracurricularFiles = import.meta.glob("./Extracurricular/*.md", { eager: true, query: "?raw", import: "default" })

function loadItems(fileMap) {
  const items = Object.entries(fileMap).map(([path, rawContent]) => {
    const { metadata } = parseMarkdownWithYaml(rawContent)

    return {
      ...metadata,
      md: rawContent,
      _filePath: path,
    }
  })

  return items.sort(compareItemsByDateThenAlphabetical)
}

export const education = {
  title: "Education",
  items: loadItems(educationFiles),
}

export const experience = {
  title: "Experience",
  items: loadItems(experienceFiles),
}

export const publications = {
  title: "Publications",
  items: loadItems(publicationsFiles),
}

export const awards = {
  title: "Awards & Honors",
  items: loadItems(awardsFiles),
}

export const talks = {
  title: "Talks",
  items: loadItems(talksFiles),
}

export const extracurricular = {
  title: "Extracurricular Activities",
  items: loadItems(extracurricularFiles),
}

export { profile } from "./profile"
export { contact } from "./contact"
