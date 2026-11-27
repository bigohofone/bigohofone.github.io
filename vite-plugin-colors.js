import { Theme, Color, BackgroundColor } from "@adobe/leonardo-contrast-colors"

// 색은 대략의 색(colorKeys)과 바탕 대비만 정하고, 실제 값은 Leonardo 가 라이트·다크 바탕마다 그 대비에 맞춰 계산한다.
// 본문 7:1(WCAG AAA), 흐린 글씨·기관 링크 4.5:1(AA), 표 선·초점 테두리 3:1(글자 아닌 UI, AA), 구분선·코드 상자 바탕 1.25:1
const gray = new BackgroundColor({
  name: "gray",
  colorKeys: ["#49505b"],
  ratios: { ink: 7, "ink-light": 4.5, line: 3, divider: 1.25 },
})
const COLORS = [
  gray,
  new Color({ name: "blue", colorKeys: ["#1f71d5"], ratios: { focus: 3, kaist: 4.5 } }),
  new Color({ name: "violet", colorKeys: ["#7958e7"], ratios: { upstage: 4.5 } }),
  new Color({ name: "crimson", colorKeys: ["#db2158"], ratios: { korea: 4.5 } }),
  new Color({ name: "green", colorKeys: ["#76b900"], ratios: { nvidia: 4.5 } }),
]
// 바탕 밝기(0~100)
const LIGHTNESS = { light: 97, dark: 16 }

const palette = (lightness) => new Theme({ colors: COLORS, backgroundColor: gray, lightness }).contrastColorPairs
const variables = (pairs) =>
  Object.entries(pairs)
    .map(([name, value]) => `--${name}:${value};`)
    .join("")

// 계산한 색을 CSS 변수(--background, --ink, ...)로 index.html 머리에 넣는다. 주소창 색(theme-color)도 바탕색으로
export function colors() {
  const light = palette(LIGHTNESS.light)
  const dark = palette(LIGHTNESS.dark)
  return {
    name: "colors",
    transformIndexHtml: () => [
      { tag: "style", children: `:root{${variables(light)}}[data-theme="dark"]{${variables(dark)}}` },
      ...[
        ["light", light],
        ["dark", dark],
      ].map(([scheme, pairs]) => ({
        tag: "meta",
        attrs: { name: "theme-color", content: pairs.background, media: `(prefers-color-scheme: ${scheme})` },
      })),
    ],
  }
}
