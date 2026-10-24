import { Fragment, useEffect, useId, useState } from "react"
import { Link } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import rehypeSanitize from "rehype-sanitize"

import { contact, previews, profile, sections } from "@/data"

const research = sections.find((section) => section.path === "publications")

// Contact 의 Links 줄에 보일 바깥 사이트 — contact.js 에서 이 순서대로 고른다. 새 탭으로 연다
const CONTACT_LINKS = ["GitHub", "Google Scholar", "LinkedIn", "X"].map((label) =>
  contact.items.find((item) => item.label === label)
)
const EXTERNAL = { target: "_blank", rel: "noopener noreferrer" }
const EMAIL = contact.items.find((item) => item.label === "Email")
// 명함 둘레 사진 자리 — 화면 가로·세로에 대한 비율(가운데 기준)과 기울기. 사진이 더 많으면 처음부터 다시 돈다
const PHOTO_SPOTS = [
  { x: "14%", y: "24%", rotate: -6 },
  { x: "86%", y: "20%", rotate: 5 },
  { x: "10%", y: "74%", rotate: 4 },
  { x: "88%", y: "76%", rotate: -5 },
  { x: "34%", y: "88%", rotate: -3 },
  { x: "66%", y: "10%", rotate: 3 },
]

// 사진 틀 — 가로/세로 비율이 가장 가까운 것을 고른다 (로그로 견줘 4:5 와 5:4 를 같은 거리로 본다)
const PHOTO_RATIOS = [
  { value: 4 / 5, className: "aspect-[4/5]" },
  { value: 1, className: "aspect-square" },
  { value: 5 / 4, className: "aspect-[5/4]" },
]
function nearestRatio(image) {
  const ratio = image.naturalWidth / image.naturalHeight
  const distance = (option) => Math.abs(Math.log(ratio / option.value))
  return PHOTO_RATIOS.reduce((best, option) => (distance(option) < distance(best) ? option : best)).className
}

// 스냅 자리 — 위가 떠 있는 메뉴 바로 아래에 오도록 메뉴 높이만큼 비워 둔다
const SNAP_POINT = "snap-start scroll-mt-[var(--header-h,0px)]"
const cn = (...classes) => classes.filter(Boolean).join(" ")

// 섹션 사이 64px — 섹션 안 첫·마지막 요소의 여백은 0 으로 하고 섹션 안에 가둬(flow-root), 섹션끼리 정확히 64px 떨어지게 한다
const SECTION = "flow-root mt-16 first:mt-0 [&>:first-child]:mt-0 [&>:last-child]:mb-0"
// 섹션 번호 — 메인에 놓인 차례대로, 제목 바로 위 줄에 쓴다
const SECTION_ORDER = ["bio", "research", "publications", "contact"]
const sectionNumber = (id) => <span className="block">{SECTION_ORDER.indexOf(id) + 1}</span>

// 섹션 제목 — 본문과 48px 떨어진다 (prose 가 제목 바로 다음 요소의 위 여백을 0 으로 둔다)
const SECTION_TITLE = "mb-12 text-center font-sans text-sm font-normal"

// 섹션 끝의 바로가기(See all …) — 오른쪽 정렬
const SHORTCUT = "block text-right"

// 섹션 제목 위에 두는 아이콘 — Openclipart 의 퍼블릭 도메인 선화를 손으로 크레용으로 그린 것처럼 바꿔 구운 PNG.
// 선을 노이즈로 살짝 휘고(손 떨림), 테두리를 까끌하게, 선 속을 종이 결처럼 군데군데 비웠다.
// 원본: Hand with quill pen(298211), Old Light Bulb - Unlit(336502), White open book being read(355258), Hung Up Rotary Phone(322919)
const ICONS = {
  contact: { src: "/assets/img/icons/contact.png", alt: "Rotary telephone" },
  bio: { src: "/assets/img/icons/bio.png", alt: "Hand writing with a quill pen" },
  research: { src: "/assets/img/icons/research.png", alt: "Old light bulb" },
  publications: { src: "/assets/img/icons/background.png", alt: "Open book" },
}
// 아이콘은 96×96 칸 안에 비율을 지켜 담는다
const icon = (id) => <img src={ICONS[id].src} alt={ICONS[id].alt} className="mx-auto size-24 object-contain" />

// 메인이 곧 About — Bio(소개 글), 연구 관심사(data/previews/publications.md), 대표 논문, 연락처, 바닥(저작권)
// 흩어 놓은 사진 하나 — 틀은 실제 사진 비율에 가장 가까운 4:5·1:1·5:4 중 하나로 고르고, 남는 부분은 잘라 낸다
function ScatteredPhoto({ src, spot }) {
  const [ratio, setRatio] = useState("aspect-square")
  return (
    <img
      src={src}
      alt=""
      onLoad={(event) => setRatio(nearestRatio(event.currentTarget))}
      className={cn("absolute w-[clamp(72px,13vw,168px)] object-cover shadow-sm", ratio)}
      style={{ left: spot.x, top: spot.y, transform: `translate(-50%, -50%) rotate(${spot.rotate}deg)` }}
    />
  )
}

// 크레용으로 그은 듯한 가로선 — 검은 선을 넓은 물결로 살짝 위아래로 휘고(손 떨림), 잘게 밀어 테두리를 까끌하게,
// 선 속을 종이 결처럼 군데군데 비운다. seed 가 다르면 선마다 휘는 모양이 다르다
function CrayonRule({ seed }) {
  // useId 는 ":r1:" 처럼 콜론이 들어가 url(#…) 참조가 깨지므로 글자·숫자만 남긴다
  const id = `crayon-rule${useId().replace(/[^a-zA-Z0-9]/g, "")}`
  return (
    <svg aria-hidden="true" className="block h-3 w-full overflow-visible">
      {/* 가로선은 높이가 0 이라 선 기준(objectBoundingBox) 필터 영역이 납작해져 사라진다 — 영역을 svg 전체로 잡는다 */}
      <filter id={id} filterUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" seed={seed} result="warp" />
        <feDisplacementMap in="SourceGraphic" in2="warp" scale="6" xChannelSelector="R" yChannelSelector="G" result="wobbly" />
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed={seed + 50} result="fine" />
        <feDisplacementMap in="wobbly" in2="fine" scale="1" xChannelSelector="R" yChannelSelector="G" result="rough" />
        <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed={seed + 100} result="grain" />
        <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -3 0 0 0 2.6" result="paper" />
        <feComposite in="rough" in2="paper" operator="in" />
      </filter>
      <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#111" strokeWidth="1" strokeLinecap="round" filter={`url(#${id})`} />
    </svg>
  )
}

export default function Home() {
  // 메인에서만 스크롤이 스냅 자리(명함·Bio 첫머리)에 붙게 한다 — 다른 페이지로 가면 푼다
  useEffect(() => {
    document.documentElement.classList.add("snap-y", "snap-mandatory")
    return () => document.documentElement.classList.remove("snap-y", "snap-mandatory")
  }, [])

  return (
    <>
      {/* 첫 화면 — 가운데 명함, 둘레에 사진들을 흩어 놓는다. 메뉴 아래 남은 한 화면을 차지하고,
          본문 폭(675px)을 넘어 화면 가로 전체를 쓴다. 명함은 메뉴 높이의 절반만큼 끌어올려 창 한가운데 온다 */}
      <section
        id="intro"
        className={cn(
          "not-prose relative left-1/2 flex h-[calc(100dvh-var(--header-h,0px))] w-screen -translate-x-1/2 items-center justify-center overflow-hidden",
          SNAP_POINT
        )}
      >
        {profile.photos.map((src, i) => (
          <ScatteredPhoto key={i} src={src} spot={PHOTO_SPOTS[i % PHOTO_SPOTS.length]} />
        ))}

        {/* 명함 — 실제 명함 크기(90×50mm, 한국 표준). 화면이 그보다 좁으면 비율을 지켜 줄어든다 */}
        <div className="relative z-10 flex aspect-[9/5] w-[90mm] max-w-[calc(100%-40px)] -translate-y-[calc(var(--header-h,0px)/2)] flex-col justify-between rounded-[3mm] bg-white p-[6mm] shadow-md">
          <div>
            <p className="text-lg">{profile.name}</p>
            {profile.affiliations.map((affiliation) => (
              <p key={affiliation} className="font-sans text-xs">
                {affiliation}
              </p>
            ))}
          </div>
          <a href={EMAIL.link} className="font-sans text-xs underline">
            {EMAIL.value}
          </a>
        </div>
      </section>

      {/* 명함 아래 전부(바닥까지)를 한 덩어리 스냅 자리로 묶는다 — 명함에서 한 번 내리면 Bio 첫머리로 붙고,
          그 아래는 덩어리가 화면보다 길어 자유롭게 스크롤된다 */}
      <div className={cn(SNAP_POINT, "pt-16")}>
      {/* Bio — 소개 글 */}
      <section id="bio" className={SECTION}>
        {icon("bio")}
        <h2 className={SECTION_TITLE}>
          {sectionNumber("bio")}
          Bio
        </h2>

        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{profile.bio}</ReactMarkdown>
        <Link to="/background" className={SHORTCUT}>
          See all background
        </Link>
      </section>

      <section id="research" className={SECTION}>
        {icon("research")}
        <h2 className={SECTION_TITLE}>
          {sectionNumber("research")}
          Research Interests
        </h2>
        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{previews.publications}</ReactMarkdown>
      </section>

      {/* 대표 논문 — 논문 md 에 selected: false 를 적은 것은 빠진다. 제목은 arXiv 로 */}
      <section id="publications" className={SECTION}>
        {icon("publications")}
        <h2 className={SECTION_TITLE}>
          {sectionNumber("publications")}
          Selected Publications
        </h2>
        {/* 점 없이, 위·아래와 논문 사이를 크레용으로 그은 듯한 선으로 나눈다 */}
        <div className="mb-5">
          <CrayonRule seed={1} />
          {research.entries.map((entry, i) => (
            <Fragment key={entry.id}>
              <div className="py-2">
                <a href={entry.link} {...EXTERNAL} className="block leading-snug no-underline">
                  {entry.title}
                </a>
                {entry.lines.map((line) => (
                  <span key={line} className="block font-sans text-sm">
                    {line}
                  </span>
                ))}
              </div>
              <CrayonRule seed={i + 2} />
            </Fragment>
          ))}
        </div>
        <Link to="/publications" className={SHORTCUT}>
          See all publications
        </Link>
      </section>

      <section id="contact" className={SECTION}>
        {icon("contact")}
        <h2 className={SECTION_TITLE}>
          {sectionNumber("contact")}
          Contact
        </h2>
        {/* 줄마다 "이름: 내용" — 메일은 주소를 적고(복사해 쓰는 경우가 많다), 나머지는 이름만 쉼표로 이어 링크한다 */}
        <p>
          Email: <a href={EMAIL.link}>{EMAIL.value}</a>
          <br />
          Links:{" "}
          {CONTACT_LINKS.map((item, i) => (
            <Fragment key={item.label}>
              {i > 0 && ", "}
              <a href={item.link} {...EXTERNAL}>
                {item.label}
              </a>
            </Fragment>
          ))}
        </p>
      </section>

      <footer className="mt-16 text-center text-sm">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
      </footer>
      </div>
    </>
  )
}
