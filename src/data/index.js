import { load } from "js-yaml"

import profileMarkdown from "./profile.md?raw"
import aboutMeMarkdown from "./about_me.md?raw"

export { contact } from "./contact"

// md 파일 — 머리말(YAML)은 항목 값으로, 나머지는 본문(body)으로
function parse(markdown) {
  const [, yaml, body] = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  return { ...load(yaml), body: body.trim() }
}

// date 는 "2025", "2025-05", "2025-05-27" 이거나 두 날짜를 " ~ " 로 이은 기간("2024-03 ~ Present") — 이 꼴은 글자 순서가 곧 날짜 순서다.
// 최근 것부터, 시작이 같으면 늦게 끝난 것부터, 그다음 이름순
function newestFirst(a, b) {
  const [aStart, aEnd = aStart] = a.date.replace("Present", "9999").split(" ~ ")
  const [bStart, bEnd = bStart] = b.date.replace("Present", "9999").split(" ~ ")
  return bStart.localeCompare(aStart) || bEnd.localeCompare(aEnd) || (a.title ?? a.organization).localeCompare(b.title ?? b.organization)
}

// 폴더 하나가 목록 하나 — .md 를 넣으면 그대로 붙는다. 파일 경로를 id(React key)로 쓴다.
// import.meta.glob 은 빌드 때 풀려 경로와 옵션을 글자 그대로 적어야 한다
const items = (files) =>
  Object.entries(files)
    .map(([id, markdown]) => ({ id, ...parse(markdown) }))
    .sort(newestFirst)

export const profile = parse(profileMarkdown)
// 사이트 맨 아래 About Me — 머리말 없는 마크다운. 주석(<!-- -->)은 빼고 본문만
export const aboutMe = aboutMeMarkdown.replace(/<!--[\s\S]*?-->/g, "").trim()
export const education = items(import.meta.glob("./education/*.md", { eager: true, query: "?raw", import: "default" }))
export const experience = items(import.meta.glob("./experience/*.md", { eager: true, query: "?raw", import: "default" }))
export const publications = items(import.meta.glob("./publications/*.md", { eager: true, query: "?raw", import: "default" }))
export const awards = items(import.meta.glob("./awards/*.md", { eager: true, query: "?raw", import: "default" }))
export const extracurricular = items(
  import.meta.glob("./extracurricular/*.md", { eager: true, query: "?raw", import: "default" })
)

export const footnotes = [
  { mark: "*", text: "Denotes equal contribution" },
  { mark: "†", text: "Denotes corresponding author" },
]
