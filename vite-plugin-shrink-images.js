import fs from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

// 배포 빌드(dist)에 복사된 이미지만 줄인다(public/ 의 원본은 그대로).
// 사진은 og:image(링크 미리보기)로도 쓰여 화면 크기보다 넉넉히 긴 변 800px 까지 둔다
const MAX_SIZE = 800
const EXTENSIONS = new Set([".jpg", ".jpeg", ".png"])

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else yield full
  }
}

async function shrink(file, rel) {
  const ext = path.extname(file).toLowerCase()
  const input = await fs.readFile(file)

  const resized = sharp(input)
    .rotate()
    .resize({ width: MAX_SIZE, height: MAX_SIZE, fit: "inside", withoutEnlargement: true })
  const output = await (
    ext === ".png"
      ? resized.png({ palette: true, quality: 80, effort: 10 })
      : resized.jpeg({ quality: 78, mozjpeg: true })
  ).toBuffer()
  // 줄였는데 오히려 커지면 원본을 둔다
  if (output.length >= input.length) return [rel, input.length, input.length]
  await fs.writeFile(file, output)
  return [rel, input.length, output.length]
}

export function shrinkImages() {
  let outDir
  return {
    name: "shrink-images",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    async closeBundle() {
      const jobs = []
      for await (const file of walk(outDir)) {
        if (EXTENSIONS.has(path.extname(file).toLowerCase())) {
          jobs.push(shrink(file, path.relative(outDir, file).split(path.sep).join("/")))
        }
      }
      const kb = (n) => `${Math.round(n / 1024)}KB`
      for (const [rel, before, after] of await Promise.all(jobs)) {
        console.log(`  shrink-images  ${rel}  ${kb(before)} → ${kb(after)}`)
      }
    },
  }
}
