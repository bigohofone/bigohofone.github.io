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

// 블로그 글의 첫 "# 제목" 을 머리말의 title 로 넘겨 목록·쪽 제목에 쓴다
const remarkTitle = () => (tree) => {
  const text = (node) => node.value ?? node.children?.map(text).join("") ?? ""
  const heading = tree.children.find((node) => node.type === "heading" && node.depth === 1)
  const yaml = tree.children.find((node) => node.type === "yaml")
  if (yaml) yaml.value += `\ntitle: ${JSON.stringify(text(heading))}`
}

// 마크다운(소개 글, 블로그 글)은 빌드 때 컴포넌트로 바꾼다. 수식·코드 색도 이때 입혀 브라우저는 결과만 받는다
const markdown = mdx({
  include: ["src/blog/*.md", "src/resume/summary.md"],
  format: "md",
  development: false,
  remarkPlugins: [remarkFrontmatter, remarkTitle, remarkMdxFrontmatter, remarkGfm, remarkMath],
  rehypePlugins: [rehypeKatex, [rehypeShiki, { themes: { light: "github-light", dark: "github-dark-dimmed" } }]],
})

export default defineConfig({
  plugins: [{ enforce: "pre", ...markdown }, react(), tailwindcss(), shrinkImages(), cv(), prerender()],
})
