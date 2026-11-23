import fs from "node:fs/promises"
import path from "node:path"
import { createElement } from "react"
import { renderToString } from "react-dom/server"
import { createServer } from "vite"

// 검색 엔진·링크 미리보기가 JavaScript 없이도 내용을 읽도록 빌드 결과 HTML 에 페이지를 미리 그려 넣는다
export function prerender() {
  let outDir
  return {
    name: "prerender",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    async closeBundle() {
      const server = await createServer({ server: { middlewareMode: true, ws: false }, appType: "custom" })
      try {
        const { default: App } = await server.ssrLoadModule("/src/App.jsx")
        const file = path.join(outDir, "index.html")
        const html = await fs.readFile(file, "utf8")
        await fs.writeFile(
          file,
          html.replace('<div id="root"></div>', `<div id="root">${renderToString(createElement(App))}</div>`),
        )
      } finally {
        await server.close()
      }
    },
  }
}
