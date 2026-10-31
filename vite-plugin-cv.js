import { execFile } from "node:child_process"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { promisify } from "node:util"
import { createServer } from "vite"

// CV — src/lib/cv.js 가 사이트 데이터로 만든 Word 파일과, 그걸 LibreOffice(soffice)로 바꾼 PDF 를 사이트 맨 위 경로에 둔다.
// 배포 빌드에선 dist 에 써 넣고, 개발 서버에선 부를 때마다 새로 만든다.
// cv.js 는 import.meta.glob 으로 데이터를 읽어 Vite 를 거쳐야 해서 ssrLoadModule 로 불러온다
const NAME = "Wonjun_Oh_CV"
const TYPES = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

async function makeCV(loadModule) {
  const { cvDocx } = await loadModule("/src/lib/cv.js")
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cv-"))
  const docx = path.join(dir, `${NAME}.docx`)
  await fs.writeFile(docx, await cvDocx())
  // 설정 폴더를 따로 줘야 개발 서버와 빌드처럼 둘이 동시에 돌아도 서로 막지 않는다
  await promisify(execFile)("soffice", [
    `-env:UserInstallation=file://${dir}/profile`,
    "--headless",
    "--convert-to",
    "pdf",
    "--outdir",
    dir,
    docx,
  ])
  return { docx: await fs.readFile(docx), pdf: await fs.readFile(path.join(dir, `${NAME}.pdf`)) }
}

export function cv() {
  let outDir, command
  return {
    name: "cv",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
      command = config.command
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const ext = path.extname(req.url).slice(1)
        if (req.url !== `/${NAME}.${ext}` || !TYPES[ext]) return next()
        makeCV((id) => server.ssrLoadModule(id))
          .then((files) => {
            res.setHeader("Content-Type", TYPES[ext])
            res.end(files[ext])
          })
          .catch(next)
      })
    },
    async closeBundle() {
      // 개발 서버도 닫힐 때 closeBundle 을 부른다
      if (command !== "build") return
      const server = await createServer({ server: { middlewareMode: true }, appType: "custom" })
      try {
        const files = await makeCV((id) => server.ssrLoadModule(id))
        for (const ext of Object.keys(TYPES)) await fs.writeFile(path.join(outDir, `${NAME}.${ext}`), files[ext])
        console.log(`  cv  ${NAME}.docx, ${NAME}.pdf`)
      } finally {
        await server.close()
      }
    },
  }
}
