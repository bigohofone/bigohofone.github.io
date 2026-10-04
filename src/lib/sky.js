import { getPosition } from "suncalc"

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
const lerp = (a, b, t) => a + (b - a) * t

const hexToRgb = (hex) => [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255]
const rgbToHex = ([r, g, b]) => (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b)

// 해 고도(도)별 Vanta CLOUDS 색. 사이 값은 선형 보간한다.
const STOPS = [
  {
    alt: -18, // 밤
    skyColor: 0x0b1026,
    cloudColor: 0x2a3350,
    cloudShadowColor: 0x05070f,
    sunColor: 0x000000,
    sunGlareColor: 0x000000,
    sunlightColor: 0x1a2340,
  },
  {
    alt: -6, // 박명
    skyColor: 0x2a3768,
    cloudColor: 0x5a5f8a,
    cloudShadowColor: 0x141a33,
    sunColor: 0x803020,
    sunGlareColor: 0x6b2f5a,
    sunlightColor: 0x7a5a8a,
  },
  {
    alt: 0, // 해 뜰 녘·질 녘
    skyColor: 0xe9a07e,
    cloudColor: 0xf3c1a8,
    cloudShadowColor: 0x4a3050,
    sunColor: 0xff9919,
    sunGlareColor: 0xff6633,
    sunlightColor: 0xff9933,
  },
  {
    alt: 8, // 이른 아침·늦은 오후
    skyColor: 0x8ec5e8,
    cloudColor: 0xdfe7f2,
    cloudShadowColor: 0x3a5a80,
    sunColor: 0xffd9a0,
    sunGlareColor: 0xffb070,
    sunlightColor: 0xffd0a0,
  },
  {
    alt: 30, // 한낮
    skyColor: 0x68b8d7,
    cloudColor: 0xadc1de,
    cloudShadowColor: 0x183550,
    sunColor: 0xfff2d0,
    sunGlareColor: 0xffe0b0,
    sunlightColor: 0xfff0d0,
  },
]

const KEYS = Object.keys(STOPS[0]).filter((k) => k !== "alt")

// 주어진 시각·장소의 해 고도에 맞는 Vanta CLOUDS 색 옵션
export function skyColorsAt(date, { latitude, longitude }) {
  const alt = clamp(getPosition(date, latitude, longitude).altitude, -18, 30)
  const i = Math.max(1, STOPS.findIndex((s) => s.alt >= alt))
  const lo = STOPS[i - 1]
  const hi = STOPS[i]
  const t = (alt - lo.alt) / (hi.alt - lo.alt)

  return Object.fromEntries(
    KEYS.map((key) => {
      const a = hexToRgb(lo[key])
      const b = hexToRgb(hi[key])
      return [key, rgbToHex(a.map((v, j) => lerp(v, b[j], t)))]
    }),
  )
}

// WCAG 상대 휘도
function luminance(c) {
  const [r, g, b] = c.map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const contrast = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)

// 하늘색 위에서 진한 글자(gray-800)와 밝은 글자(gray-50) 중 대비가 큰 쪽을 고른다.
// dim 은 다크 모드에서 하늘 위에 덮는 검은 막의 불투명도.
export function textToneFor(skyColor, dim = 0) {
  const bg = luminance(hexToRgb(skyColor).map((v) => v * (1 - dim)))
  const darkText = 0.015
  const lightText = 0.95
  return contrast(bg, darkText) >= contrast(bg, lightText) ? "dark" : "light"
}
