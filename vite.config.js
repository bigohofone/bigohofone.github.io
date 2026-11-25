import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import mdx from "@mdx-js/rollup"
import remarkFrontmatter from "remark-frontmatter"
import remarkMdxFrontmatter from "remark-mdx-frontmatter"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import rehypeShiki from "@shikijs/rehype"
import { shrinkImages } from "./vite-plugin-shrink-images.js"
import { cv } from "./vite-plugin-cv.js"
import { prerender } from "./vite-plugin-prerender.js"

// 블로그 글의 머리말에 title(첫 "# 제목")과 minutes(읽는 시간)를 넣어 목록·쪽 제목에 쓴다.
// 읽는 시간은 코드·수식을 빼고 영어는 분당 230 단어, 한글은 분당 500 글자로 센다
const remarkPost = () => (tree) => {
  const text = (node, gap = "") =>
    ["code", "math", "inlineMath"].includes(node.type)
      ? ""
      : (node.value ?? node.children?.map((child) => text(child, gap)).join(gap) ?? "")
  const yaml = tree.children.find((node) => node.type === "yaml")
  if (!yaml) return
  const title = text(tree.children.find((node) => node.type === "heading" && node.depth === 1))
  const body = text(tree, " ")
  const words = body.match(/[A-Za-z0-9]+/g)?.length ?? 0
  const hangul = body.match(/[가-힣]/g)?.length ?? 0
  const minutes = Math.max(1, Math.round(words / 230 + hangul / 500))
  yaml.value += `\ntitle: ${JSON.stringify(title)}\nminutes: ${minutes}`
}

// 마크다운(소개 글, 블로그 글)은 빌드 때 컴포넌트로 바꾼다. 수식·코드 색도 이때 입혀 브라우저는 결과만 받는다
const markdown = mdx({
  include: ["src/blog/*.md", "src/resume/summary.md"],
  format: "md",
  development: false,
  remarkPlugins: [remarkFrontmatter, remarkPost, remarkMdxFrontmatter, remarkGfm, remarkMath],
  rehypePlugins: [rehypeKatex, [rehypeShiki, { themes: { light: "github-light", dark: "github-dark-dimmed" } }]],
})

export default defineConfig({
  plugins: [{ enforce: "pre", ...markdown }, react(), tailwindcss(), shrinkImages(), cv(), prerender()],
})
