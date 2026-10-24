import { compareItemsByDateThenAlphabetical, formatDateEndpoints, formatDateLabel, formatMonthYear } from "@/lib/date"
import { parseMarkdownTable, parseMarkdownWithYaml } from "@/lib/markdown"

import newsTable from "./news.md?raw"
import profileMarkdown from "./profile.md?raw"

// 파일 경로를 그대로 id 로 쓴다 — 제목이 겹쳐도 안정적인 key 가 된다. 머리말(YAML)은 항목 값으로, 나머지는 본문(body)으로
function loadItems(fileMap) {
  return Object.entries(fileMap)
    .map(([path, rawContent]) => {
      const { metadata, content } = parseMarkdownWithYaml(rawContent)
      return { ...metadata, id: path, body: content || undefined }
    })
    .sort(compareItemsByDateThenAlphabetical)
}

// 폴더 하나가 섹션 하나 — .md 를 넣으면 그대로 목록에 붙는다.
// import.meta.glob 은 빌드 시점에 풀리므로 경로와 옵션을 리터럴로 적어야 한다.
const section = (title, fileMap) => ({ title, items: loadItems(fileMap) })

// 뉴스는 news.md 의 표 한 줄이 항목 하나다. Image 칸은 비워 둬도 되고, 넣으면 사진 경로(public/ 기준)나 주소를 적는다
export const news = {
  title: "News",
  items: parseMarkdownTable(newsTable)
    .map((row) => ({ id: row.Date + row.News, date: row.Date, title: row.News, image: row.Image || undefined }))
    .sort(compareItemsByDateThenAlphabetical),
}
export const education = section("Education", import.meta.glob("./education/*.md", { eager: true, query: "?raw", import: "default" }))
export const experience = section("Experience", import.meta.glob("./experience/*.md", { eager: true, query: "?raw", import: "default" }))
export const publications = section("Publications", import.meta.glob("./publications/*.md", { eager: true, query: "?raw", import: "default" }))
export const awards = section("Awards & Honors", import.meta.glob("./awards/*.md", { eager: true, query: "?raw", import: "default" }))
export const talks = section("Talks", import.meta.glob("./talks/*.md", { eager: true, query: "?raw", import: "default" }))
export const extracurricular = section(
  "Extracurricular Activities",
  import.meta.glob("./extracurricular/*.md", { eager: true, query: "?raw", import: "default" })
)

// 머리말은 이름·소속·사진, 본문은 About 에 들어가는 소개 글
const { metadata: profileMetadata, content: bio } = parseMarkdownWithYaml(profileMarkdown)
export const profile = { ...profileMetadata, bio }
export { contact } from "./contact"

function formatPeriod(date) {
  const { start, end } = formatDateEndpoints(date)
  return end ? `${start} – ${end}` : start
}

// 페이지가 그리는 모양으로 옮긴다 — 제목 한 줄, 그 아래 줄들(lines), 누르면 갈 곳(link), 본문(body), 사진(image).
// selected: false 로 표시한 항목은 뺀다
function toEntries(items, toEntry) {
  return items
    .filter((item) => item.selected !== false)
    .map((item) => ({ id: item.id, body: item.body, ...toEntry(item) }))
}

// 메인에 보이는 미리보기 글 — previews/ 안의 <섹션 path>.md 하나씩
const previewFiles = import.meta.glob("./previews/*.md", { eager: true, query: "?raw", import: "default" })
export const previews = Object.fromEntries(
  Object.entries(previewFiles).map(([path, text]) => [path.replace("./previews/", "").replace(".md", ""), text])
)

// 섹션마다 페이지 하나 (/path), 메인에는 미리보기만 둔다
// 뉴스는 따로 페이지 없이 메인에 전부 보인다
export const newsEntries = toEntries(news.items, (it) => ({
  title: it.title,
  lines: [formatMonthYear(it.date)],
  image: it.image,
}))

export const sections = [
  {
    path: "publications",
    title: publications.title,
    // 논문은 arXiv 로 보낸다
    entries: toEntries(publications.items, (it) => ({
      title: it.title,
      lines: [it.authors, it.venue].filter(Boolean),
      link: it.arxiv,
    })),
    footnotes: [
      "* denotes co-first authors, who contributed equally to the work.",
      "† denotes corresponding authors, who supervised the work and handle inquiries about the paper.",
    ],
  },
  {
    path: "awards",
    title: awards.title,
    entries: toEntries(awards.items, (it) => ({
      title: it.title,
      lines: [`${formatDateLabel(it.date)} · ${it.organization}`],
    })),
  },
  // 경력과 학력은 한 페이지(/background)에 목록 두 개로 묶는다
  {
    path: "background",
    title: "Background",
    groups: [
      {
        title: "Work Experience",
        entries: toEntries(experience.items, (it) => ({
          title: it.organization,
          lines: [it.role, formatPeriod(it.date)],
        })),
      },
      {
        title: education.title,
        entries: toEntries(education.items, (it) => ({
          title: it.organization,
          lines: [it.major, formatPeriod(it.date)],
        })),
      },
    ],
  },
]
