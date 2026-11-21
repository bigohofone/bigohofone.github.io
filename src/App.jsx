import { useId, useState } from "react"
import ReactMarkdown from "react-markdown"
import rehypeSanitize from "rehype-sanitize"

import { aboutMe, awards, contact, footnotes, profile, publications } from "./data"

const EXTERNAL = { target: "_blank", rel: "noopener noreferrer" }
const linkOf = (label) => contact.find((item) => item.label === label).link
const selected = (items) => items.filter((item) => item.selected !== false)

// 선 아이콘 — 48×48 격자에 글씨 색(currentColor)으로 그리고, 그림은 가운데 40×40(4~44) 칸 안에.
// 넣을 때는 그 40×40 칸만 보여 14×14px 를 꽉 채운다(viewBox). 칸 가장자리 선의 바깥 반쪽이 잘리지 않게 넘치는 것도 그린다. 선 끝은 네모, 꺾인 모서리는 둥글게(종이·책·봉투 테두리는 반지름 4).
// 선 굵기는 아이콘 크기와 상관없이 늘 화면 1.5px (index.css 의 non-scaling-stroke)
const LineIcon = ({ children, ...props }) => (
  <svg
    viewBox="4 4 40 40"
    overflow="visible"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="square"
    strokeLinejoin="round"
    {...props}
  >
    {children}
  </svg>
)

// CV 아이콘 — 오른쪽 위 모서리를 아주 작게 접은 종이(가로 36·세로 40)에 사람(둥근 머리와 반원 어깨)을 그린 이력서
function CvIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M34 4H10a4 4 0 0 0-4 4v32a4 4 0 0 0 4 4h28a4 4 0 0 0 4-4V12z" />
      {/* 아주 작게 접힌 귀(8칸) — 선 끝이 종이 밖으로 삐져나오지 않게 끝을 평평하게(butt) */}
      <path d="M34 4v8h8" strokeLinecap="butt" />
      {/* 몸통(어깨) — 종이 밑변까지 내려와 닿는다. 끝이 밑변 밖으로 삐져나오지 않게 평평하게(butt) */}
      <path d="M12 44a12 12 0 0 1 24 0" strokeLinecap="butt" />
      <circle cx="24" cy="21" r="7" />
    </LineIcon>
  )
}

// 논문 아이콘 — 책 표지(가로 36·세로 40, 왼쪽에 책등 선) 가운데에 종류(논문 md 의 type) 머리글자 C·J·P 를 둥근 손글씨처럼 쓴다
const bookIcon = (letter) => (props) => (
  <LineIcon {...props}>
    <rect x="6" y="4" width="36" height="40" rx="4" />
    <path d="M14 4v40" />
    <path d={letter} strokeLinecap="round" strokeLinejoin="round" />
  </LineIcon>
)
const PUBLICATION_ICONS = {
  conference: bookIcon("M32.5 17.88A7 8 0 1 0 32.5 30.12"),
  journal: bookIcon("M33 16v11a5 5 0 0 1-10 0"),
  preprint: bookIcon("M23 32V16h6a4.5 4.5 0 0 1 0 9h-6"),
}

// 메달 — 목걸이 끈에 매달린 꽃잎 테두리 메달
function MedalIcon(props) {
  return (
    <LineIcon {...props}>
      {/* 목걸이 끈 — 두 가닥이 40×40 칸의 위 두 모서리에서 45° 로 내려와 메달로 모인다. 가닥마다 선 두 줄(폭 10)로 두께를 보이고,
          위쪽은 칸 윗변을 따라 가로줄 하나로 두 가닥을 이어 목에 거는 고리처럼, 꺾이는 곳은 곡선으로 부드럽게 */}
      <path d="M11.54 18.62L9.2 16.28C4.8 11.88 3.8 4 12 4H36C44.2 4 43.2 11.88 38.8 16.28L36.46 18.62" />
      {/* 끈 안쪽 선 — 메달에서 올라와 위 가로줄에 닿기 전에 위로 살짝 휘어 끝나, 끈이 목 뒤로 자연스럽게 넘어가는 것처럼 */}
      <path d="M20 12.92 17.6 10.52Q16 8.92 16.6 7.2M28 12.92l2.4-2.4Q32 8.92 31.4 7.2" strokeLinecap="round" />
      {/* 32×32 메달 — 40×40 칸의 아래 가운데에 붙는다. 테두리는 얕은 꽃잎 열두 장, 안쪽에 원 */}
      <path d="M24 12.68A7.16 7.16 0 0 1 31.66 14.74A7.16 7.16 0 0 1 37.26 20.34A7.16 7.16 0 0 1 39.32 28A7.16 7.16 0 0 1 37.26 35.66A7.16 7.16 0 0 1 31.66 41.26A7.16 7.16 0 0 1 24 43.32A7.16 7.16 0 0 1 16.34 41.26A7.16 7.16 0 0 1 10.74 35.66A7.16 7.16 0 0 1 8.68 28A7.16 7.16 0 0 1 10.74 20.34A7.16 7.16 0 0 1 16.34 14.74A7.16 7.16 0 0 1 24 12.68z" />
      <circle cx="24" cy="28" r="9" />
    </LineIcon>
  )
}

// 상장 — 가로 40·세로 36 종이(칸 윗변에서 2칸 아래부터)를 네 칸으로 나눈 자리에 고르게 글 세 줄, 아래 두 줄은 오른쪽을 비워 그 자리에 둥근 인장과 그 밑으로 리본
function CertificateIcon(props) {
  return (
    <LineIcon {...props}>
      {/* 종이 — 리본이 지나가는 밑변 가운데(26~36)는 비운다 */}
      <path d="M26 42H8a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4h32a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4h-4" />
      {/* 글 세 줄 — 끝을 둥글게 */}
      <path d="M12 15h24M12 24h8M12 33h8" strokeLinecap="round" />
      <circle cx="31" cy="28.5" r="6" />
      {/* 인장 밑으로 리본 꼬리 두 갈래 — 안을 칠하고, 윗변은 인장 아래 둘레를 따라 닫아 인장 안으로 번지지 않게 */}
      <path d="M27 32.98V44l4-3 4 3v-11.02A6 6 0 0 1 27 32.98z" fill="currentColor" />
    </LineIcon>
  )
}

// Feather 에는 X(옛 트위터) 로고가 없어 Tabler 의 brand-x 를 같은 규칙으로 옮겨 그린다
function XIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M6 6l26.4 36H42L15.6 6z" />
      {/* 왼쪽 아래 → 오른쪽 위 가는 선 — 굵은 획의 테두리에서 딱 끊기게 끝을 평평하게(butt). 네모 끝이면 획 안으로 삐져 들어간다 */}
      <path d="m6 42 15.228-15.228m5.536-5.536L42 6" strokeLinecap="butt" />
    </LineIcon>
  )
}

// GitHub — Feather 의 github 에서 꼬리를 빼고 얼굴과 목만 남겨 오른쪽 반을 왼쪽에 거울처럼 옮겨 좌우 대칭으로, 40×40 칸에 꽉 차게 키운다.
// 꺾이는 곳은 둥글게 부드럽게, 목은 칸 아랫변(키우기 전 Feather 좌표로 y=19)에서 평평하게(butt) 끝내 잘린 듯 보이게
function GitHubIcon(props) {
  return (
    <LineIcon {...props}>
      <path
        transform="matrix(2.2222 0 0 2.2189 -3.7778 1.8405)"
        strokeLinecap="butt"
        strokeLinejoin="round"
        d="M16 19v-.87A3.37 3.37 0 0 0 15.06 15.52C18.2 15.17 21.5 13.98 21.5 8.52A5.44 5.44 0 0 0 20 4.77A5.07 5.07 0 0 0 19.91 1C19.91 1 18.73 .65 16 2.48A13.38 13.38 0 0 0 9 2.48C6.27 .65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77A5.44 5.44 0 0 0 3.5 8.52C3.5 13.98 6.8 15.17 9.94 15.52A3.37 3.37 0 0 0 9 18.13V19"
      />
    </LineIcon>
  )
}

// LinkedIn — Feather 의 linkedin 을 옮겨 그려 40×40 칸에 맞춘다
function LinkedInIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M32 16a12 12 0 0 1 12 12v16h-8v-16a4 4 0 0 0-4-4 4 4 0 0 0-4 4v16h-8v-16a12 12 0 0 1 12-12zM4 18h8v26H4z" />
      <circle cx="8" cy="8" r="4" />
    </LineIcon>
  )
}

function MailIcon(props) {
  return (
    <LineIcon {...props}>
      <rect x="4" y="6" width="40" height="36" rx="4" />
      {/* 봉투 덮개 — 둥근 위 두 모서리에서 봉투 높이 절반(18칸) 아래 가운데로. 선 끝이 봉투 밖으로 삐져나오지 않게 끝을 평평하게(butt) */}
      <path d="M5.18 7.18 24 24l18.82-16.82" strokeLinecap="butt" />
    </LineIcon>
  )
}

// 위쪽 마름모(모자)와 아래쪽 원(머리) — 원 안에 들어간 마름모만 마스크로 가려, 마름모 선이 원 테두리에 딱 닿아 이어진다
function GoogleScholarIcon(props) {
  // useId 는 콜론 같은 글자가 들어가 url(#…) 참조가 깨질 수 있어 글자·숫자만 남긴다
  const maskId = `scholar${useId().replace(/[^a-zA-Z0-9]/g, "")}`
  return (
    <LineIcon {...props}>
      <mask id={maskId}>
        <rect width="48" height="48" fill="white" />
        <circle cx="24" cy="31" r="13" fill="black" />
      </mask>
      <polygon points="24 4 44 18 24 32 4 18" mask={`url(#${maskId})`} />
      <circle cx="24" cy="31" r="13" />
    </LineIcon>
  )
}

// 라이트/다크 모드 아이콘 — 해(가운데 원과 둘레 빛살 여덟 줄)와 달(초승달)
function SunIcon(props) {
  return (
    <LineIcon {...props} strokeLinecap="round">
      <circle cx="24" cy="24" r="8" />
      <path d="M24 4v4M24 40v4M4 24h4M40 24h4M9.86 9.86l2.83 2.83M35.31 35.31l2.83 2.83M9.86 38.14l2.83-2.83M35.31 12.69l2.83-2.83" />
    </LineIcon>
  )
}

function MoonIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M40 28.5A17 17 0 1 1 19.5 8 13 13 0 0 0 40 28.5z" />
    </LineIcon>
  )
}

// 라이트/다크 모드 전환 — 페이지 오른쪽 위에 붙는 버튼. 고른 모드는 브라우저에 기억해 두고(index.html 이 처음 그리기 전에 읽는다),
// 고른 적이 없으면 기기 설정을 따른다
function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.dataset.theme === "dark")
  const toggle = () => {
    const theme = dark ? "light" : "dark"
    document.documentElement.dataset.theme = theme
    localStorage.setItem("theme", theme)
    setDark(!dark)
  }
  const Icon = dark ? SunIcon : MoonIcon
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed top-6 right-6 z-10 cursor-pointer text-ink"
    >
      <Icon aria-hidden="true" className="size-6" />
    </button>
  )
}

// 연락처 — 모두 기본 링크 색
const CONTACTS = [
  { label: "Email", icon: MailIcon },
  { label: "CV", icon: CvIcon, link: "/Wonjun_Oh_CV.pdf" },
  { label: "GitHub", icon: GitHubIcon },
  { label: "Google Scholar", icon: GoogleScholarIcon },
  { label: "LinkedIn", icon: LinkedInIcon },
  { label: "X", icon: XIcon },
]

// 글 앞에 다는 아이콘·로고 — 폭 14px 상자를 줄 높이(1lh) 그대로 줄 맨 위에 붙이고, 그림은 그 상자 가운데에 꽉 채운다(SVG 는 viewBox 가,
// 로고는 mask 의 center 가 맞춰 준다). 보기 좋게 줄 한가운데보다 0.5px 올린다(자리를 차지하지 않게 relative). 글과는 8px 띄운다
const BEFORE_TEXT = "relative -top-[0.5px] mr-2 inline-block h-lh w-3.5 align-top"

// 소개 글 링크 앞 기관 로고 — 링크 주소의 도메인으로 고른다. 파일(public/assets/img/logos)은 단색 실루엣이라 글씨 색으로 칠한다(mask).
// KAIST·Upstage·고려대는 로고·글씨를 브랜드 색으로 — 원래 색의 색상(HSL 의 H)은 그대로, 채도 75%, 명도는 흰 바탕 대비 7:1(웹 접근성 AAA 기준)에 맞춘 값
// 색은 라이트·다크 바탕 각각에서 대비 7:1 로 맞춘 값
const BIO_LOGOS = {
  // KAIST AI 는 KAIST 원형 엠블럼 — 다른 로고처럼 글씨 색으로 칠한다
  "gsai.kaist.ac.kr": { logo: "kaist-seal", color: "text-[#1854a0] dark:text-[#86b5ee]" },
  "hyunw.kim": { logo: "coco" },
  "www.upstage.ai": { logo: "upstage", color: "text-[#542be1] dark:text-[#b7a7f2]" },
  "www.korea.edu": { logo: "korea", color: "text-[#a51942] dark:text-[#f098b2]" },
}
function BioLink({ node, href, children, ...props }) {
  const { logo, color } = BIO_LOGOS[new URL(href).hostname] ?? {}
  return (
    // 로고와 글자가 서로 다른 줄로 갈라지지 않게 링크 전체를 한 줄로
    <a href={href} {...props} className={`whitespace-nowrap ${color ?? ""}`}>
      {/* 로고 — 다른 아이콘처럼 그림을 14px 상자에 꽉 채워 넣는다. 글 속이라 여백 대신 글자처럼 띄어쓰기 한 칸 */}
      {logo && (
        <span aria-hidden="true" className={`${BEFORE_TEXT} mr-0! inline-flex items-center justify-center`}>
          <span
            className="size-3.5 bg-current"
            style={{ mask: `url(/assets/img/logos/${logo}.png) center / contain no-repeat` }}
          />
        </span>
      )}
      {logo && " "}
      {children}
    </a>
  )
}

// 연구 방향 아이콘 — 선 끝·점선 끝·꺾인 곳 모두 둥글게. 데이터 합성·선별은 깔때기(좋은 데이터만 걸러 낸다), 다양성은 정사면체 프리즘(입체)
// 깔때기 — 정사면체처럼 입체로, 위에서 내려다본 둥근 입구(타원)에서 좁아져 아래 끝이 막힌 가는 대롱으로. 좌우 대칭
function FunnelIcon(props) {
  return (
    <LineIcon {...props} strokeLinecap="round">
      <ellipse cx="24" cy="10" rx="20" ry="6" />
      <path d="M4 10l17 20v14h6v-14L44 10" />
    </LineIcon>
  )
}

// 정사면체 — 좌우 대칭으로, 꼭대기와 바닥 세 꼭짓점(왼쪽·오른쪽·앞)을 잇는 입체. 보이는 모서리 다섯 개는 실선,
// 뒤로 숨은 바닥 모서리(왼쪽–오른쪽)는 점선
function PrismIcon(props) {
  return (
    <LineIcon {...props} strokeLinecap="round">
      <path d="M24 4 4 34l20 10 20-10zM24 4v40" />
      <path d="M4 34h40" strokeDasharray="1 3" />
    </LineIcon>
  )
}

// 소개 글 맨 위 인사(## 제목) — 섹션 제목과 같은 크기·굵기
const BioHeading = ({ node, ...props }) => <h2 className="text-lg/6 font-semibold" {...props} />

// 소개 글에서 굵은 머리말로 시작하는 연구 방향 문단 — 앞에 아이콘을 달고, 둘째 줄부터는 논문·수상처럼 아이콘 오른쪽에 맞춰 들인다
const RESEARCH_ICONS = {
  "Data Synthesis and Selection with LLMs.": FunnelIcon,
  "Diversity Preservation in LLMs.": PrismIcon,
}
function BioParagraph({ node, children }) {
  const Icon = RESEARCH_ICONS[node.children[0]?.children?.[0]?.value]
  if (!Icon) return <p>{children}</p>
  return (
    <p className="pl-5.5 -indent-5.5">
      <Icon aria-hidden="true" className={BEFORE_TEXT} />
      {children}
    </p>
  )
}

// 수상 종류(md 의 type)별 아이콘 — 이 순서대로 늘어놓는다. Honor 는 상장, Competition 은 메달
const AWARD_ICONS = [
  { type: "Honor", icon: CertificateIcon },
  { type: "Competition", icon: MedalIcon },
]

function Section({ title, children }) {
  return (
    <section className="mt-18 first:mt-0">
      <h2 className="mb-6 text-lg/6 font-semibold">{title}</h2>
      {children}
    </section>
  )
}

// 목록 한 항목 — 앞에 아이콘을 단 제목, 그 밑 회색 줄들. 제목이 넘쳐 둘째 줄로 가면 밑 줄들과 함께 아이콘 오른쪽(22px)에 맞춰 들인다
function Entry({ icon: Icon, title, lines }) {
  return (
    <div className="pl-5.5 not-last:mb-6">
      <div className="-indent-5.5">
        <Icon aria-hidden="true" className={BEFORE_TEXT} />
        {title}
      </div>
      {lines.map((line, i) => (
        <div key={i} className="text-ink-light">
          {line}
        </div>
      ))}
    </div>
  )
}

// 모든 높이·간격은 본문 한 줄(24px)의 배수 — 왼쪽 프로필과 오른쪽 내용의 줄이 서로 맞는다
export default function App() {
  return (
    // 데스크탑(lg)에선 12칸을 8/4로 — 왼쪽 8칸에 나머지, 오른쪽 4칸에 프로필(같은 첫 줄에). 그보다 좁으면 프로필이 위, 나머지가 아래로
    <div className="mx-auto max-w-5xl px-6 py-24 sm:px-8">
      <ThemeToggle />
      <main className="grid grid-cols-4 gap-x-4 gap-y-18 sm:grid-cols-12 sm:gap-x-6">
        {/* 프로필 — 사진(열두 줄 높이), 이름·소속, 연락처. 좁은 화면에선 가운데, 데스크탑에선 왼쪽 맞춤에 스크롤해도 붙어 있다 */}
        <header className="col-span-full text-center lg:sticky lg:top-24 lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:self-start lg:text-left">
          <img src={profile.image} alt={profile.name} className="mx-auto aspect-4/5 h-72 rounded object-cover lg:mx-0" />
          <h1 className="mt-6 text-lg/6 font-semibold">{profile.name}</h1>
          <p className="text-ink-light">{profile.affiliations[0]}</p>
          {/* CV 는 빌드 때 LaTeX 로 만든 PDF(src/cv.js, vite-plugin-cv.js) */}
          <ul className="mt-6">
            {CONTACTS.map(({ label, icon: Icon, link = linkOf(label) }) => (
              <li key={label}>
                <a href={link} {...EXTERNAL}>
                  <Icon aria-hidden="true" className={BEFORE_TEXT} />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </header>

        <div className="col-span-full lg:col-span-8 lg:row-start-1">
          {/* 소개 글 — profile.md 본문 */}
          <section className="space-y-6">
            <ReactMarkdown rehypePlugins={[rehypeSanitize]} components={{ a: BioLink, p: BioParagraph, h2: BioHeading }}>
              {profile.body}
            </ReactMarkdown>
          </section>

          {/* 논문 — md 에 selected: false 를 적은 것은 빠진다. 밑에 저자, 그 밑에 학회 · Paper · Code · Model · Data 바로가기(md 에 주소가 있는 것만) */}
          <Section title="Publications">
            {selected(publications).map((paper) => (
              <Entry
                key={paper.id}
                icon={PUBLICATION_ICONS[paper.type]}
                title={paper.title}
                lines={[
                  paper.authors,
                  <>
                    {paper.venue}
                    {[
                      ["Paper", paper.arxiv],
                      ["Code", paper.github],
                      ["Model", paper.huggingface],
                      ["Data", paper.dataset],
                    ]
                      .filter(([, link]) => link)
                      .map(([label, link]) => (
                        <span key={label}>
                          {" · "}
                          <a href={link} {...EXTERNAL}>
                            {label}
                          </a>
                        </span>
                      ))}
                  </>,
                ]}
              />
            ))}
            {/* 범례 — 세 종류 아이콘의 뜻, 그 밑에 * 와 † 표시의 뜻 */}
            <div className="mt-6 text-ink-light">
              <p className="space-x-4">
                {Object.entries(PUBLICATION_ICONS).map(([type, Icon]) => (
                  <span key={type} className="capitalize">
                    <Icon aria-hidden="true" className={BEFORE_TEXT} />
                    {type}
                  </span>
                ))}
              </p>
              {footnotes.map(({ mark, text }) => (
                <p key={mark} className="pl-5.5 -indent-5.5">
                  <span className="mr-2 inline-block w-3.5 indent-0 text-center">{mark}</span>
                  {text}
                </p>
              ))}
            </div>
          </Section>

          {/* 수상 — md 에 selected: false 를 적은 것은 빠진다. 밑에 기관·연도 */}
          {/* 수상 — 상(Honor) 다음에 대회(Competition)를 한 섹션에 이어서. 한 줄에 제목 · 기관 · 연도 */}
          <Section title="Awards & Honors">
            {AWARD_ICONS.flatMap(({ type, icon }) =>
              selected(awards)
                .filter((award) => award.type === type)
                .map((award) => (
                  <Entry
                    key={award.id}
                    icon={icon}
                    title={
                      <>
                        {award.title}
                        <span className="text-ink-light">
                          {" "}
                          · {award.organization} · {award.date.slice(0, 4)}
                        </span>
                      </>
                    }
                    lines={[]}
                  />
                ))
            )}
          </Section>

          {/* About Me — src/data/about_me.md 에 적은 글. 비어 있으면 섹션을 그리지 않는다 */}
          {aboutMe && (
            <Section title="About Me">
              <div className="space-y-6">
                <ReactMarkdown rehypePlugins={[rehypeSanitize]} components={{ a: BioLink }}>
                  {aboutMe}
                </ReactMarkdown>
              </div>
            </Section>
          )}
        </div>
      </main>

      <footer className="mt-24 text-center">© {new Date().getFullYear()} {profile.name}</footer>
    </div>
  )
}
