import { useId, useLayoutEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import rehypeSanitize from "rehype-sanitize"
import { FiGithub, FiLinkedin } from "react-icons/fi"

import { awardList, contact, profile, publicationList } from "@/data"

// 소개 글 밑에 늘어놓을 연락처 — contact.js 에서 이 순서대로 고른다. 메일은 맨 위에 따로 둔다
const EMAIL = contact.items.find((item) => item.label === "Email")
const CONTACT_LINKS = ["GitHub", "Google Scholar", "LinkedIn", "X"].map((label) =>
  contact.items.find((item) => item.label === label)
)
const EXTERNAL = { target: "_blank", rel: "noopener noreferrer" }

// 메일·구글 스칼라 아이콘 — Feather(react-icons/fi)와 같은 규칙(24 격자, currentColor, 굵기 2)으로 그린 것 (pixel 브랜치에서 가져옴)
const LineIcon = ({ children, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {children}
  </svg>
)

// CV 아이콘 — Feather 의 file-text 와 같은 종이 윤곽(모서리만 직각으로)에 줄 대신 접힌 귀 밑으로 CV 를 나란히 각지게 쓴다
function CvIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M14 2H4v20h16V8z" />
      <path d="M14 2v6h6M10 12H6.5v6H10M11.75 12l3 6 3-6" />
    </LineIcon>
  )
}

// 논문 아이콘 — CV 와 같은 종이 윤곽에 접힌 귀 밑으로 종류(논문 md 의 type) 머리글자 C·J·P 를 하나 각지게 쓴다
const paperIcon = (letter) => (props) => (
  <LineIcon {...props}>
    <path d="M14 2H4v20h16V8z" />
    <path d={`M14 2v6h6${letter}`} />
  </LineIcon>
)
const PUBLICATION_ICONS = {
  conference: paperIcon("M14.5 12h-5v6h5"),
  journal: paperIcon("M14.5 12v6h-5v-2"),
  preprint: paperIcon("M9.5 18v-6h5v3.5h-5"),
}

// 수상 아이콘 — Competition 은 트로피(각진 잔·손잡이·받침), Honor 는 상장(메일 봉투와 같은 크기의 종이에 글 세 줄, 오른쪽 아래 밑변에 걸친 인장과 리본 꼬리)
function TrophyIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M6 2h12v7l-3 5H9L6 9z" />
      <path d="M6 4H2v5h4M18 4h4v5h-4M12 14v4M7 18h10v4H7z" />
    </LineIcon>
  )
}

function CertificateIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M13 20H2V4h20v16h-2M6 8h12M6 11h12M6 14h6M14.5 19.5V23l2-1.5 2 1.5v-3.5" />
      <circle cx="16.5" cy="17" r="3" />
    </LineIcon>
  )
}

// Feather 에는 X(옛 트위터) 로고가 없어 Tabler 의 brand-x 를 같은 규칙으로 옮겨 그린다
function XIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M4 4l11.733 16H20L8.267 4z" />
      <path d="m4 20 6.768-6.768m2.46-2.46L20 4" />
    </LineIcon>
  )
}

function MailIcon(props) {
  return (
    <LineIcon {...props}>
      <rect x="2" y="4" width="20" height="16" />
      <path d="m22 7-10 5L2 7" />
    </LineIcon>
  )
}

// 위쪽 마름모(모자)와 아래쪽 원(책)이 만나는 자리를 마스크로 비워 둔다
function GoogleScholarIcon(props) {
  // useId 는 콜론 같은 글자가 들어가 url(#…) 참조가 깨질 수 있어 글자·숫자만 남긴다
  const maskId = `scholar${useId().replace(/[^a-zA-Z0-9]/g, "")}`
  return (
    <LineIcon {...props}>
      <mask id={maskId}>
        <rect width="24" height="24" fill="white" />
        <circle cx="12" cy="16" r="6" fill="black" stroke="black" strokeWidth="4" />
      </mask>
      <polygon points="12 2 22 8 12 16 2 8" mask={`url(#${maskId})`} />
      <circle cx="12" cy="16" r="6" />
    </LineIcon>
  )
}

// 글 앞에 다는 선 아이콘(연락처 이름은 링크 안에) — 폭은 글씨 크기(1em), 글과는 띄어쓰기 한 칸(Inter 0.28125em) 띄운다.
// 선 끝은 네모나게, 꺾이는 곳은 뾰족하게 — Feather 아이콘의 둥근 끝·둥근 꺾임도 덮어쓴다.
// 아이콘마다 24 격자 위아래 빈 곳이 달라, 그린 것(선 굵기의 반 1 까지)만 남게 잘라 내고 그 가운데를 대문자 높이(1cap)의 가운데에 맞춘다.
// 뾰족한 꺾임은 선 굵기의 반보다 더 튀어나와 잘린 밖도 보이게 둔다
const LINK_ICONS = {
  GitHub: FiGithub,
  "Google Scholar": GoogleScholarIcon,
  LinkedIn: FiLinkedin,
  X: XIcon,
}
const TextIcon = ({ icon: Icon }) => {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const { y, height } = ref.current.getBBox()
    const croppedHeight = `${(height + 2) / 24}em`
    ref.current.setAttribute("viewBox", `0 ${y - 1} 24 ${height + 2}`)
    ref.current.style.height = croppedHeight
    ref.current.style.verticalAlign = `calc((1cap - ${croppedHeight}) / 2)`
  }, [])
  return (
    <Icon
      ref={ref}
      aria-hidden="true"
      strokeLinecap="square"
      strokeLinejoin="miter"
      className="mr-[0.28125em] inline-block w-[1em] overflow-visible"
    />
  )
}

// 기관 로고 — 파일(public/assets/img/logos/이름.png)은 여백 없이 잘라 둔 단색 실루엣이고, 글씨 색으로 칠한다(mask).
// 글씨 크기(1em)만 한 정사각형 안에 비율대로 가장 크게 가운데에 넣고, 정사각형 가운데를 대문자 높이(1cap)의 가운데에 맞춘다
const Logo = ({ name }) => (
  <span
    aria-hidden="true"
    className="mr-[0.28125em] inline-block size-[1em] bg-current align-[calc((1cap-1em)/2)]"
    style={{ mask: `url(/assets/img/logos/${name}.png) center / contain no-repeat` }}
  />
)

// 소개 글 링크 앞에는 링크 주소의 도메인으로 고른 로고를 단다
const BIO_LOGOS = { "gsai.kaist.ac.kr": "kaist", "hyunw.kim": "coco", "www.upstage.ai": "upstage", "www.korea.edu": "korea" }
const BioLink = ({ node, href, children, ...props }) => {
  const logo = BIO_LOGOS[new URL(href).hostname]
  return (
    <a href={href} {...props}>
      {logo && <Logo name={logo} />}
      {children}
    </a>
  )
}

// 수상 제목 앞 아이콘 — 종류(수상 md 의 type)에 따라 Honor 는 상장, Competition 은 트로피
const AWARD_ICONS = { Honor: CertificateIcon, Competition: TrophyIcon }
// 수상은 종류마다 섹션 하나 — Honor 는 Awards & Honors, Competition 은 Competitions
const AWARD_SECTIONS = [
  { id: "awards", title: "Awards & Honors", type: "Honor" },
  { id: "competitions", title: "Competitions", type: "Competition" },
]

const cn = (...classes) => classes.filter(Boolean).join(" ")

// 위아래 여백은 사진 말고는 모두 본문 한 줄 높이(24px, index.css 의 line)의 배수로 맞춘다. 줄 높이는 글씨 크기마다 정해진 대로.
// 섹션 사이 세 줄 — 섹션 안 첫·마지막 요소의 여백은 0 으로 하고 섹션 안에 가둬(flow-root), 섹션끼리 정확히 세 줄 떨어지게 한다
const SECTION = "flow-root mt-line-3 first:mt-0 [&>:first-child]:mt-0 [&>:last-child]:mb-0"

// 섹션 제목 — 본문과 한 줄 떨어진다 (prose 가 제목 바로 다음 요소의 위 여백을 0 으로 둔다). 위 여백은 prose 기본값(2em = 40px)이 줄 간격 칸을 벗어나게 해 0 으로 — 사진 밑 여백(한 줄)만 남는다. 태블릿·휴대폰 폭에선 가운데에
const SECTION_TITLE = "mt-0 mb-line max-lg:text-center"

// 섹션 — (사진,) 제목(섹션 이름, 또는 따로 준 heading 두 줄), 본문. 사진은 4:5 에 1.5px 먹색 테두리로, 높이는 본문 열두 줄, 이름과는 한 줄 띄운다.
// 데스크탑에선 사진 윗변을 옆 칸 소개 글 첫 줄의 대문자 윗선에 맞춘다 — 줄 위 여백((줄 높이 - 대문자 높이)/2)만큼 내리되,
// 그림만 옮겨(translate) 밑의 이름·연락처는 줄 간격 칸에 그대로 둔다
// 제목은 본문보다 한 단계 크게(lg) 600 굵기로, 본문 두 줄 높이를 차지하되 글은 둘째 줄에 둬 옆 칸 본문 줄과 맞춘다 —
// 같은 줄 높이에서 큰 글씨는 기준선이 1px 아래로 내려가 그만큼 올린다. heading 은 둘째 줄(소속)부터 본문 크기에 보통 굵기, 회색으로
function Section({ id, title, heading, photo, className, children }) {
  const lines = heading ?? [title]
  return (
    <section id={id} className={cn(SECTION, className)}>
      {photo && (
        <img
          src={photo.src}
          alt={photo.alt}
          className="not-prose mb-line aspect-[4/5] h-[calc(var(--spacing-line)*12)] border-[1.5px] border-ink object-cover lg:translate-y-[calc((1lh-1cap)/2)]"
        />
      )}
      <h2 className={cn(SECTION_TITLE, "pt-line text-lg leading-(--spacing-line) font-semibold")}>
        {lines.map((line, i) => (
          <span key={line} className={cn("block", i === 0 ? "relative -top-px" : "text-base font-normal text-ink-light")}>
            {line}
          </span>
        ))}
      </h2>
      {children}
    </section>
  )
}

// 마우스를 올리면(휴대폰에선 누르면) 설명(desc)이 뜨는 글 — 링크처럼 점선 밑줄을 긋고 선택 상자를 띄운다(index.css 의 .hint).
// 설명은 App.jsx 의 Popup 이 data-desc 를 읽어 띄운다
const Hint = ({ desc, children }) => (
  <span data-desc={desc} className="hint cursor-default">
    {children}
  </span>
)

// 한 페이지에 Bio(소개 글·연구 관심사·링크), 논문, 수상, 바닥(저작권)

export default function Home() {
  return (
    // 데스크탑(lg)에선 12칸을 4/8로 — 왼쪽 4칸에 프로필, 오른쪽 8칸에 소개 글부터 나머지 섹션. 태블릿 폭부터는 둘 다 12칸 가득, 위아래로
    <div className="col-span-full grid grid-cols-subgrid pt-line-2">
      {/* 프로필 — 사진, 이름·소속, 그 밑에 연락처. 위아래로 쌓이는 태블릿·휴대폰 폭에선 통째로 가운데 맞춘다 */}
      <Section
        id="profile"
        heading={[profile.name, profile.affiliations[0]]}
        photo={{ src: profile.image, alt: profile.name }}
        className="col-span-full max-lg:text-center max-lg:[&>img]:mx-auto lg:col-span-4"
      >
        {/* 연락처·링크 — 메일, CV, 그 밑에 연락처 이름을 아이콘과 함께 한 줄씩.
              본문 링크처럼 글 속 링크로 둬 점선 밑줄과 글자에 맞는 호버 상자를 그대로 쓴다.
              CV 는 빌드 때 Word 파일에서 바꾼 PDF(vite-plugin-cv.js)를 새 탭 미리보기로 연다 — Word 파일은 주소로만 받을 수 있게 링크하지 않는다 */}
        <div>
          <div>
            <a href={EMAIL.link} className="font-normal!">
              <TextIcon icon={MailIcon} />
              Email
            </a>
          </div>
          <div>
            <a href="/Wonjun_Oh_CV.pdf" {...EXTERNAL} className="font-normal!">
              <TextIcon icon={CvIcon} />
              CV
            </a>
          </div>
          {CONTACT_LINKS.map(({ label, link }) => (
            <div key={label}>
              <a href={link} {...EXTERNAL} className="font-normal!">
                <TextIcon icon={LINK_ICONS[label]} />
                {label}
              </a>
            </div>
          ))}
        </div>
      </Section>

      <div className="col-span-full mt-line-3 lg:col-span-8 lg:mt-0">
        {/* 소개 글 — profile.md 본문, 제목 없이. 링크 앞에는 기관 로고 */}
        <section id="bio" className={SECTION}>
          <ReactMarkdown rehypePlugins={[rehypeSanitize]} components={{ a: BioLink }}>
            {profile.bio}
          </ReactMarkdown>
        </section>

        {/* 논문 — 논문 md 에 selected: false 를 적은 것은 빠진다. 제목은 arXiv 로 */}
        <Section id="publications" title="Publications">
          {/* 종류로 나누지 않고 한 줄씩 띄워 늘어놓는다 — 논문 제목은 arXiv 로, 앞에 종류 아이콘, 그 밑에 저자·학회를 회색으로.
              두 줄로 넘친 제목과 그 밑 줄들은 아이콘 오른쪽에 맞춰 들인다 */}
          {publicationList.entries.map((entry) => (
            <div key={entry.id} className="not-last:mb-line pl-[1.28125em]">
              <div className="-indent-[1.28125em]">
                <a href={entry.link} {...EXTERNAL}>
                  <TextIcon icon={PUBLICATION_ICONS[entry.type]} />
                  {entry.title}
                </a>
              </div>
              {entry.lines.map((line) => (
                <span key={line} className="block text-ink-light">
                  {line}
                </span>
              ))}
            </div>
          ))}
          {/* 논문 목록 밑에 한 줄 띄워 세 종류(논문이 없는 종류도) 아이콘 뜻, 그 밑에 * 와 † 표시의 뜻을 한 줄씩 — 줄 사이는 띄우지 않는다(not-prose — prose 의 문단 여백이 걸리지 않게).
              표시(*·†)는 아이콘과 같은 폭(1em, 띄어쓰기 한 칸) 칸 가운데에 둔다 */}
          <div className="not-prose mt-line text-ink-light">
            <p>
              {Object.entries(PUBLICATION_ICONS).map(([type, icon]) => (
                <span key={type} className="capitalize not-last:mr-[1em]">
                  <TextIcon icon={icon} />
                  {type}
                </span>
              ))}
            </p>
            {publicationList.footnotes.map(({ mark, text }) => (
              <p key={mark}>
                <span className="mr-[0.28125em] inline-block w-[1em] text-center">{mark}</span>
                {text}
              </p>
            ))}
          </div>
        </Section>

        {/* 수상 — 수상 md 에 selected: false 를 적은 것은 빠진다. 한 줄씩 띄워 늘어놓고, 제목 앞에 종류 아이콘을 단다.
              본문이 있으면 제목에 마우스를 올리면 뜨게, 그 밑에 기관·날짜를 회색으로. 두 줄로 넘친 제목과 그 밑 줄들은 아이콘 오른쪽에 맞춰 들인다 */}
        {AWARD_SECTIONS.map(({ id, title, type }) => (
          <Section key={id} id={id} title={title}>
            {awardList.entries
              .filter((entry) => entry.type === type)
              .map((entry) => (
                <div key={entry.id} className="not-last:mb-line pl-[1.28125em]">
                  <div className="-indent-[1.28125em]">
                    {entry.body ? (
                      <Hint desc={entry.body.trim()}>
                        <TextIcon icon={AWARD_ICONS[entry.type]} />
                        {entry.title}
                      </Hint>
                    ) : (
                      <>
                        <TextIcon icon={AWARD_ICONS[entry.type]} />
                        {entry.title}
                      </>
                    )}
                  </div>
                  {entry.lines.map((line) => (
                    <span key={line} className="block text-ink-light">
                      {line}
                    </span>
                  ))}
                </div>
              ))}
          </Section>
        ))}
      </div>

      <footer className="col-span-full mt-line-3 text-center">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
      </footer>
    </div>
  )
}
