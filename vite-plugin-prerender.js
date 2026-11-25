import fs from "node:fs/promises"
import path from "node:path"
import { Feed } from "feed"
import { createElement } from "react"
import { renderToStaticMarkup, renderToString } from "react-dom/server"
import { createServer } from "vite"

const SITE = "https://wonjunoh.com"
const NAME = "Wonjun Oh"
const escape = (text) => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;")

// 검색 엔진·링크 미리보기가 JavaScript 없이도 읽도록 쪽마다 HTML 을 미리 그린다. sitemap 과 블로그 RSS 도 여기서 만든다
export function prerender() {
  let outDir
  return {
    name: "prerender",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    async closeBundle() {
      // 개발 서버와 의존성 캐시를 나눠 쓴다. 같이 쓰면 production 용 React 가 개발 서버에 섞여 깨진다
      const server = await createServer({
        mode: "production",
        cacheDir: "node_modules/.vite-build",
        server: { middlewareMode: true, ws: false },
        appType: "custom",
      })
      try {
        const { default: App } = await server.ssrLoadModule("/src/App.jsx")
        const { posts } = await server.ssrLoadModule("/src/blog/index.js")
        const tags = [...new Set(posts.flatMap((post) => post.tags))]
        const blog = posts.length > 0
        const pages = [
          { path: "/" },
          ...(blog ? [{ path: "/blog/", title: "Blog" }] : []),
          ...tags.map((tag) => ({ path: `/blog/tags/${encodeURIComponent(tag)}/`, title: `#${tag}` })),
          ...posts.map((post) => ({ path: `/blog/${post.slug}/`, title: post.title })),
        ]

        const template = await fs.readFile(path.join(outDir, "index.html"), "utf8")
        for (const page of pages) {
          const title = escape(page.title ? `${page.title} — ${NAME}` : NAME)
          const html = template
            .replace(`<title>${NAME}</title>`, `<title>${title}</title>`)
            .replace(`property="og:title" content="${NAME}"`, `property="og:title" content="${title}"`)
            .replaceAll(`"${SITE}/" />`, `"${SITE}${page.path}" />`)
            .replace(
              '<div id="root"></div>',
              `<div id="root">${renderToString(createElement(App, { path: page.path }))}</div>`,
            )
          const file = path.join(outDir, decodeURIComponent(page.path), "index.html")
          await fs.mkdir(path.dirname(file), { recursive: true })
          await fs.writeFile(file, html)
        }

        const urls = pages.map((page) => `  <url><loc>${SITE}${page.path}</loc></url>`).join("\n")
        await fs.writeFile(
          path.join(outDir, "sitemap.xml"),
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        )

        if (!blog) return
        const feed = new Feed({
          title: `${NAME} — Blog`,
          description: `Blog posts by ${NAME}`,
          id: `${SITE}/blog/`,
          link: `${SITE}/blog/`,
          copyright: NAME,
        })
        for (const post of posts) {
          const link = `${SITE}/blog/${post.slug}/`
          const content = renderToStaticMarkup(createElement(post.Content))
          feed.addItem({ title: post.title, id: link, link, date: new Date(post.date), content })
        }
        await fs.writeFile(path.join(outDir, "blog/feed.xml"), feed.rss2())
      } finally {
        await server.close()
      }
    },
  }
}
