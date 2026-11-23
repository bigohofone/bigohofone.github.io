import { execFile } from "node:child_process"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { promisify } from "node:util"
import { createServer } from "vite"

// cv.js 는 resume/ 를 import.meta.glob 으로 읽어 Vite 를 거쳐야 해서 ssrLoadModule 로 불러온다
const NAME = "Wonjun_Oh_CV"

async function makeCV(loadModule) {
  const { cvTex } = await loadModule("/src/cv.js")
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cv-"))
  const source = path.join(dir, `${NAME}.tex`)
  await fs.writeFile(source, cvTex())
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
      const server = await createServer({ server: { middlewareMode: true, ws: false }, appType: "custom" })
      try {
        await fs.writeFile(path.join(outDir, `${NAME}.pdf`), await makeCV((id) => server.ssrLoadModule(id)))
        console.log(`  cv  ${NAME}.pdf`)
      } finally {
        await server.close()
      }
    },
  }
}
