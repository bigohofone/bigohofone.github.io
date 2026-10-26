import { useId, useLayoutEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import rehypeSanitize from "rehype-sanitize"
import { FiGithub, FiLinkedin } from "react-icons/fi"

import { awardList, backgroundGroups, contact, profile, publicationList } from "@/data"
import { openCV } from "@/lib/cv"

// Links 트리에 늘어놓을 연락처 — contact.js 에서 이 순서대로 고른다. 메일은 Contact 트리에 따로 둔다
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

// Feather 의 file-text 는 종이 모서리를 둥글게 그려, 같은 모양을 모서리만 직각으로 다시 그린다
function FileIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M14 2H4v20h16V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </LineIcon>
  )
}

// CV 아이콘 — 같은 종이 윤곽에 줄 대신 접힌 귀 밑으로 CV 를 나란히 각지게 쓴다
function CvIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M14 2H4v20h16V8z" />
      <path d="M14 2v6h6M10 12H6.5v6H10M11.75 12l3 6 3-6" />
    </LineIcon>
  )
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

// 트리 뿌리 앞에 다는 폴더 — 닫히면 탭 달린 윤곽, 열리면 같은 뒤판 앞에 오른쪽으로 젖혀진 앞판(평행사변형)을 긋는다.
// 뒤판(2~22)과 앞판 밑선은 닫힌 폴더 그대로라 가운데(12)가 트리 세로선과 맞고, 젖혀진 앞판 윗변만 아이콘 칸(24) 밖으로 넘친다(overflow-visible)
function FolderIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M2 20V3h7l2 3h11v14z" />
    </LineIcon>
  )
}

function FolderOpenIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M2 20V3h7l2 3h11v4" />
      <path d="M2 20 6 10h20l-4 10z" />
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

// 글 앞에 다는 선 아이콘(Links 이름은 링크 안에, 트리 뿌리) — 폭은 글씨 크기(1em), 글과는 띄어쓰기 한 칸(Inter 0.28125em) 띄운다.
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

// 논문을 종류(논문 md 의 type)별로 — 이 차례대로, 논문이 있는 종류만 보인다. 논문 제목 앞에는 문서 아이콘
const PUBLICATION_GROUPS = [
  { type: "journal", title: "Journal", icon: FileIcon },
  { type: "conference", title: "Conference", icon: FileIcon },
  { type: "preprint", title: "Preprint", icon: FileIcon },
]
  .map((group) => ({ ...group, entries: publicationList.entries.filter((entry) => entry.type === group.type) }))
  .filter((group) => group.entries.length > 0)

// 수상을 종류(수상 md 의 type)별로 — 이 차례대로, 있는 종류만 보인다. 제목 앞에는 Honor 는 상장, Competition 은 트로피
const AWARD_GROUPS = [
  { type: "Honor", title: "Honor", icon: CertificateIcon },
  { type: "Competition", title: "Competition", icon: TrophyIcon },
]
  .map((group) => ({ ...group, entries: awardList.entries.filter((entry) => entry.type === group.type) }))
  .filter((group) => group.entries.length > 0)

// 디렉터리 트리 — 뿌리 줄(TreeRoot, prose 제목 모양을 빼 본문 글씨 그대로, 앞에 열린 폴더 아이콘) 밑에 항목을 한 줄씩, 앞에 터미널 tree 명령의 ├─(마지막은 └─) 모양 가지를 단다.
// 가지는 글자 대신 선으로 그린다 — 선 문자는 줄 사이가 끊기고 글꼴마다 굵기가 달라서. 굵기는 본문 글씨 획(17px Inter 약 1.5px),
// 가지는 글씨 크기(1em)만 한 칸에 반 칸을 더한 폭 — 첫 칸 한가운데에 세로선을, 거기서 오른쪽 끝까지 가로선을 긋는다. 세로선은 뿌리의
// 폴더 아이콘(1em) 가운데에서 내려온다. 칸 폭은 거기에 본문 띄어쓰기 한 칸(Inter 0.28125em)을 더해 항목 글이 뿌리 이름보다 반 칸(0.5em) 안에서
// 시작하고, 글 칸을 들일 때도 같은 폭(pl-[…])으로.
// 세로선은 칸 높이 내내 이어 다음 항목과 끊기지 않고, 마지막 항목은 첫 줄 가운데까지만,
// 가로선은 첫 줄 가운데에. 칸은 보통 한 줄 높이로 줄 안에 두고(relative), 여러 줄짜리 항목은 className 으로 항목 왼쪽에 항목 높이만큼 붙인다(absolute). 화면 읽기에선 뺀다
// 뿌리 줄을 누르면(키보드는 Enter·Space) 항목을 접고 편다 — 처음엔 펼쳐 둔다. 폴더 아이콘도 열고 닫는다. 앞에 다른 트리가 있으면 한 줄 띄운다.
// 아이콘은 붙을 때 한 번 잘라 맞춰서, 바뀔 때마다 새로 붙인다(key)
function TreeRoot({ title, children }) {
  const [open, setOpen] = useState(true)
  return (
    <details open className="not-first:mt-line" onToggle={(event) => setOpen(event.currentTarget.open)}>
      <summary className="w-fit cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <h3 className="not-prose inline">
          <TextIcon key={open} icon={open ? FolderOpenIcon : FolderIcon} />
          {title}
        </h3>
      </summary>
      {children}
    </details>
  )
}
const TreeBranch = ({ last, className = "relative h-line" }) => (
  <span
    aria-hidden="true"
    className={cn(
      "inline-block w-[1.78125em] shrink-0 align-top",
      "before:absolute before:top-0 before:left-[calc(0.5em-0.75px)] before:w-[1.5px] before:bg-current",
      last ? "before:h-[calc(var(--spacing-line)/2+0.75px)]" : "before:h-full",
      "after:absolute after:top-[calc(var(--spacing-line)/2-0.75px)] after:left-[calc(0.5em-0.75px)] after:h-[1.5px] after:w-[calc(1em+0.75px)] after:bg-current",
      className
    )}
  />
)
const cn = (...classes) => classes.filter(Boolean).join(" ")

// 위아래 여백은 사진 말고는 모두 본문 한 줄 높이(25.5px, index.css 의 line)의 배수로 맞춘다. 줄 높이는 글씨 크기마다 정해진 대로.
// 섹션 사이 네 줄 — 섹션 안 첫·마지막 요소의 여백은 0 으로 하고 섹션 안에 가둬(flow-root), 섹션끼리 정확히 네 줄 떨어지게 한다
const SECTION = "flow-root mt-line-4 first:mt-0 [&>:first-child]:mt-0 [&>:last-child]:mb-0"

// 섹션 제목 — 본문과 한 줄 떨어진다 (prose 가 제목 바로 다음 요소의 위 여백을 0 으로 둔다)
const SECTION_TITLE = "mb-line"

// 섹션 — (사진,) 제목(섹션 이름, 또는 따로 준 heading 두 줄), 본문. 사진은 4:5 에 1px 먹색 테두리로, 폭 160.
// 제목은 본문보다 한 단계 크게(lg) 600 굵기로, heading 은 둘째 줄(소속)부터 본문 크기에 보통 굵기, 회색으로
function Section({ id, title, heading, photo, children }) {
  const lines = heading ?? [title]
  return (
    <section id={id} className={SECTION}>
      {photo && (
        <img src={photo.src} alt={photo.alt} className="not-prose mb-line aspect-[4/5] w-40 border border-ink object-cover" />
      )}
      <h2 className={cn(SECTION_TITLE, "text-lg font-semibold")}>
        {lines.map((line, i) => (
          <span key={line} className={cn("block", heading && i > 0 && "text-base font-normal text-ink-light")}>
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

// 묶음(groups)마다 트리 하나 — 묶음 이름을 뿌리로, 그 밑에 항목을 가지로 단다. 묶음 사이는 한 줄 띄운다(TreeRoot).
// 항목마다 제목(링크가 있으면 링크로, 본문이 있으면 마우스를 올리면 뜨게), 그 밑에 줄들(lines)을 회색으로. 제목 앞에는 항목의 로고, 없으면 묶음의 icon.
// 항목 사이도 한 줄 띄우되(spaced, 끄면 붙인다) 그 줄까지 세로선으로 잇는다(띄운 줄을 항목 칸 안 아래 여백으로 둬서). 줄들과 두 줄로 넘친 제목은 가지 오른쪽에 맞춰 들인다
function EntryTree({ groups, spaced = true }) {
  return (
    <div>
      {groups.map(({ title, icon, entries }) => (
        <TreeRoot key={title} title={title}>
          {entries.map((entry, i) => {
            const mark = entry.logo ? <Logo name={entry.logo} /> : icon && <TextIcon icon={icon} />
            return (
              <div key={entry.id} className={cn("relative pl-[1.78125em]", spaced && "not-last:pb-line")}>
                <TreeBranch last={i === entries.length - 1} className="absolute inset-y-0 left-0" />
                {/* 제목은 줄 안(inline)으로 — 본문 링크처럼 점선 밑줄을 긋고, 호버 상자가 글자에 맞고 줄마다 나뉜다 */}
                <div>
                  {entry.link ? (
                    <a href={entry.link} {...EXTERNAL}>
                      {mark}
                      {entry.title}
                    </a>
                  ) : entry.body ? (
                    <Hint desc={entry.body.trim()}>
                      {mark}
                      {entry.title}
                    </Hint>
                  ) : (
                    <>
                      {mark}
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
            )
          })}
        </TreeRoot>
      ))}
    </div>
  )
}

// 한 페이지에 Bio(소개 글·연구 관심사·링크), 논문, 수상, 경력·학력, 바닥(저작권)

export default function Home() {
  return (
    <div className="pt-line-2">
      {/* Bio — 사진, 이름·소속, 소개 글, 링크 트리 차례로 */}
      <Section id="bio" heading={[profile.name, profile.affiliations[0]]} photo={{ src: profile.image, alt: profile.name }}>
        {/* 소개 글 — profile.md 본문. 링크 앞에는 기관 로고 */}
        <ReactMarkdown rehypePlugins={[rehypeSanitize]} components={{ a: BioLink }}>
          {profile.bio}
        </ReactMarkdown>
        {/* 연락처·링크 — "Contact" 뿌리 밑에 메일, "Links" 뿌리 밑에 맨 위에 CV, 그 밑에 연락처 이름을 아이콘과 함께 트리로.
              본문 링크처럼 글 속 링크로 둬 점선 밑줄과 글자에 맞는 호버 상자를 그대로 쓴다.
              CV 는 갈 주소 없이 누르면 PDF 를 만들어 새 탭에 띄운다 — 그래도 같은 모양이 되게 a 로 두고(주소가 없어 버튼 역할과 초점을 따로 준다),
              딱지에는 data-destination 의 파일 이름을 띄운다 */}
        <div className="mt-line">
          <TreeRoot title="Contact">
            <div>
              <TreeBranch last />
              <a href={EMAIL.link} className="font-normal!">
                <TextIcon icon={MailIcon} />
                Email
              </a>
            </div>
          </TreeRoot>
          <TreeRoot title="Links">
            <div>
              <TreeBranch />
              <a
                role="button"
                tabIndex={0}
                onClick={openCV}
                onKeyDown={(event) => event.key === "Enter" && openCV()}
                data-destination="Wonjun_Oh_CV.pdf"
                className="cursor-pointer font-normal!"
              >
                <TextIcon icon={CvIcon} />
                CV
              </a>
            </div>
            {CONTACT_LINKS.map(({ label, link }, i) => (
              <div key={label}>
                <TreeBranch last={i === CONTACT_LINKS.length - 1} />
                <a href={link} {...EXTERNAL} className="font-normal!">
                  <TextIcon icon={LINK_ICONS[label]} />
                  {label}
                </a>
              </div>
            ))}
          </TreeRoot>
        </div>
      </Section>

      {/* 논문 — 논문 md 에 selected: false 를 적은 것은 빠진다. 제목은 arXiv 로 */}
      <Section id="publications" title="Publications">
        {/* 종류(Journal·Conference·Preprint)마다 트리 하나 — 논문 제목은 arXiv 로, 그 밑에 저자·학회 */}
        <EntryTree groups={PUBLICATION_GROUPS} />
        {/* * 와 † 표시의 뜻 — 논문 목록 밑에 한 줄 띄워, 줄 사이는 띄우지 않는다(not-prose — prose 의 문단 여백이 걸리지 않게) */}
        <div className="not-prose mt-line text-ink-light">
          {publicationList.footnotes.map((footnote) => (
            <p key={footnote}>{footnote}</p>
          ))}
        </div>
      </Section>

      {/* 수상 — 종류(Honor·Competition)마다 트리 하나. 수상 md 에 selected: false 를 적은 것은 빠진다 */}
      <Section id="awards" title="Honors & Awards">
        <EntryTree groups={AWARD_GROUPS} spaced={false} />
      </Section>

      {/* 경력·학력 */}
      <Section id="background" title="Background">
        <EntryTree groups={backgroundGroups} spaced={false} />
      </Section>

      <footer className="mt-line-4 text-center">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
      </footer>
    </div>
  )
}
