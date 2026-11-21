import { execFile } from "node:child_process"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { promisify } from "node:util"
import { createServer } from "vite"

// CV — src/cv.js 가 사이트 데이터로 만든 LaTeX 문서를 Tectonic 으로 PDF 로 만들어 사이트 맨 위 경로에 둔다.
// 배포 빌드에선 dist 에 써 넣고, 개발 서버에선 부를 때마다 새로 만든다.
// cv.js 는 import.meta.glob 으로 데이터를 읽어 Vite 를 거쳐야 해서 ssrLoadModule 로 불러온다
const NAME = "Wonjun_Oh_CV"

async function makeCV(loadModule) {
  const { cvTex } = await loadModule("/src/cv.js")
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cv-"))
  const source = path.join(dir, `${NAME}.tex`)
  await fs.writeFile(source, cvTex())
  // 쪽 수(1 of 2)는 두 번 돌아야 알 수 있는데 Tectonic 이 알아서 다시 돈다
  await promisify(execFile)("tectonic", ["--chatter", "minimal", "--outdir", dir, source])
  return fs.readFile(path.join(dir, `${NAME}.pdf`))
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
        if (req.url !== `/${NAME}.pdf`) return next()
        makeCV((id) => server.ssrLoadModule(id))
          .then((pdf) => {
            res.setHeader("Content-Type", "application/pdf")
            res.end(pdf)
          })
          .catch(next)
      })
    },
    async closeBundle() {
      // 개발 서버도 닫힐 때 closeBundle 을 부른다
      if (command !== "build") return
      const server = await createServer({ server: { middlewareMode: true }, appType: "custom" })
      try {
        await fs.writeFile(path.join(outDir, `${NAME}.pdf`), await makeCV((id) => server.ssrLoadModule(id)))
        console.log(`  cv  ${NAME}.pdf`)
      } finally {
        await server.close()
      }
    },
  }
}
