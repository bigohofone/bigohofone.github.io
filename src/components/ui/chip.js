export const chipIconClass = "size-4 stroke-2 sm:size-5"

// 픽셀 버튼 (CV · 맨 위로). Jersey 10 글자와 pixelarticons 아이콘을 글자 픽셀(--font-px) 격자에 맞춰 놓는다.
// - 아이콘은 글자 바닥선에 맞추고, 아이콘과 글자 사이는 한 칸. 둘레는 위아래 두 칸, 좌우 네 칸.
//   글자 오른쪽에 한 픽셀 틈이 붙어 있어 오른쪽 안쪽 여백은 7픽셀만 준다.
// - 네 꼭짓점은 한 칸씩 깎는다. 크기를 지키도록 전역 버튼 최소 크기(44px)는 끄고,
//   전역 누름 효과(filter·scale)가 깎은 모서리를 무시하고 그려지는 걸 막으려고 그것도 끈다
// - 호버하면 상자만 상하좌우로 한 칸씩 커진다. 안쪽 여백을 한 칸 늘린 만큼 바깥 여백을 한 칸 당겨,
//   글자·아이콘과 주변 배치는 그대로 둔다
export const pixelButtonClass =
  "inline-flex min-h-0 min-w-0 pixel-corners items-end gap-cell-1 py-cell-2 pr-[calc(var(--font-px)*7)] pl-cell-4 transition-colors active:scale-100 active:filter-none active:backdrop-filter-none sm:hover:-mx-cell-1 sm:hover:-my-cell-1 sm:hover:py-cell-3 sm:hover:pr-[calc(var(--font-px)*7+var(--cell))] sm:hover:pl-cell-5"

// 픽셀 버튼 글자 — 줄 상자를 대문자 높이(10픽셀)로 잘라 둔다
export const pixelButtonTextClass =
  "block h-[calc(var(--font-px)*10)] pixel-label whitespace-nowrap [text-box:trim-both_cap_alphabetic]"

// Contact 버튼 — 높이 56 의 원. 글씨가 든 버튼(CV)만 좌우로 늘어난 알약 모양이 된다.
// 호버 8% · 누름 10% 의 state layer 를 겹친다.
// 전역 버튼 누름 효과(축소·어둡게)는 끄고, 링크와 버튼이 같은 피드백을 받게 한다
export const toolbarButtonClass =
  "relative isolate inline-flex h-14 min-w-14 items-center justify-center gap-2 rounded-full bg-surface-muted text-sm/normal font-bold whitespace-nowrap text-fg no-underline outline-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-current before:opacity-0 before:transition-opacity hover:before:opacity-8 focus-visible:before:opacity-10 active:scale-100 active:filter-none active:backdrop-filter-none active:before:opacity-10"

export const toolbarIconClass = "size-5 stroke-2 sm:size-6"
