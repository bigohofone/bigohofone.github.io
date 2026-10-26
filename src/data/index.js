import { compareItemsByDateThenAlphabetical, formatDateEndpoints, formatDateLabel } from "@/lib/date"
import { parseMarkdownWithYaml } from "@/lib/markdown"

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

export const education = section(
  "Education",
  import.meta.glob("./education/*.md", { eager: true, query: "?raw", import: "default" })
)
export const experience = section(
  "Experience",
  import.meta.glob("./experience/*.md", { eager: true, query: "?raw", import: "default" })
)
export const publications = section(
  "Publications",
  import.meta.glob("./publications/*.md", { eager: true, query: "?raw", import: "default" })
)
export const awards = section(
  "Honors & Awards",
  import.meta.glob("./awards/*.md", { eager: true, query: "?raw", import: "default" })
)
export const talks = section("Talks", import.meta.glob("./talks/*.md", { eager: true, query: "?raw", import: "default" }))
export const extracurricular = section(
  "Extracurricular Activities",
  import.meta.glob("./extracurricular/*.md", { eager: true, query: "?raw", import: "default" })
)

// 머리말은 이름·소속·사진, 본문은 Bio 에 들어가는 소개 글
const { metadata: profileMetadata, content: bio } = parseMarkdownWithYaml(profileMarkdown)
export const profile = { ...profileMetadata, bio }
export { contact } from "./contact"

function formatPeriod(date) {
  const { start, end } = formatDateEndpoints(date)
  return end ? `${start} – ${end}` : start
}

// 메인이 그리는 모양으로 옮긴다 — 제목 한 줄, 그 아래 줄들(lines), 누르면 갈 곳(link), 본문(body).
// selected: false 로 표시한 항목은 뺀다
function toEntries(items, toEntry) {
  return items.filter((item) => item.selected !== false).map((item) => ({ id: item.id, body: item.body, ...toEntry(item) }))
}

// 논문은 따로 페이지 없이 메인에만 보인다. 논문은 arXiv 로 보낸다.
// type 은 journal · conference · preprint 중 하나 — 메인에서 이걸로 나눠 보인다
export const publicationList = {
  entries: toEntries(publications.items, (it) => ({
    type: it.type,
    title: it.title,
    lines: [it.authors, it.venue].filter(Boolean),
    link: it.arxiv,
  })),
  footnotes: [
    "* denotes co-first authors, who contributed equally to the work.",
    "† denotes corresponding authors, who supervised the work and handle inquiries about the paper.",
  ],
}

// 수상·경력·학력도 따로 페이지 없이 메인에만 보인다. 본문(body)은 메인에서 제목에 마우스를 올리면 뜬다.
// 수상의 type 은 Competition · Honor 중 하나 — 메인에서 이걸로 나눠 보인다
export const awardList = {
  entries: toEntries(awards.items, (it) => ({
    type: it.type,
    title: it.title,
    lines: [it.organization, formatDateLabel(it.date)],
  })),
}

// 경력과 학력은 Background 하나에 목록 두 개로 묶는다. logo 는 제목 앞에 다는 기관 로고 파일 이름(public/assets/img/logos)
export const backgroundGroups = [
  {
    title: "Work Experience",
    entries: toEntries(experience.items, (it) => ({
      title: it.organization,
      logo: it.logo,
      lines: [it.role, formatPeriod(it.date)],
    })),
  },
  {
    title: education.title,
    entries: toEntries(education.items, (it) => ({
      title: it.organization,
      logo: it.logo,
      lines: [it.major, formatPeriod(it.date)],
    })),
  },
]
