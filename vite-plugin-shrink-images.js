import fs from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

// 배포 빌드(dist)에 복사된 이미지만 줄인다. public/ 의 원본은 그대로 두고,
// 파일 이름·형식도 그대로라 코드에서 경로를 바꿀 필요가 없다.
//
// 긴 변 최대 픽셀 — 화면에 보이는 크기의 3배(레티나)쯤. 위에서부터 먼저 맞는 규칙을 쓴다.
const RULES = [
  // 화면에선 160px 이지만 og:image(링크 미리보기)로도 쓰여 넉넉히 둔다
  { match: "assets/img/profile.", maxSize: 800 },
  { match: "assets/img/publications/", maxSize: 640 },
  { match: "assets/logo/", maxSize: 400 },
  { match: "", maxSize: 1200 },
]

const JPEG_QUALITY = 78
const WEBP_QUALITY = 78
const PNG_QUALITY = 80 // palette 양자화 품질

const EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"])

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else yield full
  }
}

async function shrink(file, rel) {
  const ext = path.extname(file).toLowerCase()
  const { maxSize } = RULES.find((r) => rel.includes(r.match))
  const input = await fs.readFile(file)

  let pipeline = sharp(input).rotate().resize({
    width: maxSize,
    height: maxSize,
    fit: "inside",
    withoutEnlargement: true,
  })
  if (ext === ".png") pipeline = pipeline.png({ palette: true, quality: PNG_QUALITY, effort: 10 })
  else if (ext === ".webp") pipeline = pipeline.webp({ quality: WEBP_QUALITY })
  else pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true })

  const output = await pipeline.toBuffer()
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
