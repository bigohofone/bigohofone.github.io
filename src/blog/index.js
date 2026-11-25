// 글 하나가 .md 하나. 첫 "# 제목" 이 제목이고 머리말엔 date, tags 만 둔다.
// 파일 이름이 주소다(hello.md → /blog/hello/). _ 로 시작하는 파일은 개발 서버에서만 보인다(예시 글)
const files = import.meta.glob("./*.md", { eager: true })

export const posts = Object.entries(files)
  .filter(([path]) => import.meta.env.DEV || !path.startsWith("./_"))
  .map(([path, { default: Content, frontmatter }]) => ({
    slug: path.slice(2, -3).replace(/^_/, ""),
    Content,
    tags: [],
    ...frontmatter,
  }))
  .sort((a, b) => b.date.localeCompare(a.date))
