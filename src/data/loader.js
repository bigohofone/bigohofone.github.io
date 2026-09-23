import { compareItemsByDateThenAlphabetical } from "@/utils/date"
import { parseMarkdownWithYaml } from "@/utils/markdown"

// 파일 경로를 그대로 id 로 쓴다 — 제목이 겹쳐도 안정적인 key 가 된다.
// 본문이 없는 항목은 md 를 비워 둬서, 눌러도 빈 모달이 열리지 않게 한다.
function loadItems(fileMap) {
  return Object.entries(fileMap)
    .map(([path, rawContent]) => {
      const { metadata, content } = parseMarkdownWithYaml(rawContent)

      return { ...metadata, id: path, md: content ? rawContent : undefined }
    })
    .sort(compareItemsByDateThenAlphabetical)
}

// 폴더 하나가 섹션 하나 — .md 를 넣으면 그대로 목록에 붙는다.
// import.meta.glob 은 빌드 시점에 풀리므로 경로와 옵션을 리터럴로 적어야 한다.
const section = (title, fileMap) => ({ title, items: loadItems(fileMap) })

export const news = section("News", import.meta.glob("./News/*.md", { eager: true, query: "?raw", import: "default" }))
export const education = section("Education", import.meta.glob("./Education/*.md", { eager: true, query: "?raw", import: "default" }))
export const experience = section("Experience", import.meta.glob("./Experience/*.md", { eager: true, query: "?raw", import: "default" }))
export const publications = section("Publications", import.meta.glob("./Publications/*.md", { eager: true, query: "?raw", import: "default" }))
export const awards = section("Awards & Honors", import.meta.glob("./Awards/*.md", { eager: true, query: "?raw", import: "default" }))
export const talks = section("Talks", import.meta.glob("./Talks/*.md", { eager: true, query: "?raw", import: "default" }))
export const extracurricular = section(
  "Extracurricular Activities",
  import.meta.glob("./Extracurricular/*.md", { eager: true, query: "?raw", import: "default" })
)

export { profile } from "./profile"
export { contact } from "./contact"
