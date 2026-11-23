import ReactMarkdown from "react-markdown"
import rehypeSanitize from "rehype-sanitize"

import { footnotes, period } from "./format"
import * as Icons from "./icons"
import resume from "./resume"
import summary from "./resume/summary.md?raw"

const { basics, work, awards, publications } = resume
const EXTERNAL = { target: "_blank", rel: "noopener noreferrer" }

const PROFILE_ICONS = {
  GitHub: Icons.GitHub,
  "Google Scholar": Icons.GoogleScholar,
  LinkedIn: Icons.LinkedIn,
  X: Icons.X,
}
const CONTACTS = [
  { label: basics.email, link: `mailto:${basics.email}`, Icon: Icons.Mail },
  { label: "CV", link: "/Wonjun_Oh_CV.pdf", Icon: Icons.Cv },
  ...basics.profiles.map(({ network, url }) => ({ label: network, link: url, Icon: PROFILE_ICONS[network] })),
]

// resume 의 type 별 아이콘. 이 순서가 목록 순서와 범례 순서다
const PUBLICATION_TYPES = {
  Conference: Icons.Conference,
  Journal: Icons.Journal,
  Preprint: Icons.Preprint,
  "Tech Report": Icons.TechReport,
}
const AWARD_TYPES = { Honor: Icons.Certificate, Award: Icons.Trophy, Competition: Icons.Medal }
const WORK_TYPES = { Industry: Icons.Briefcase, Academia: Icons.Flask }
// 지금 다니는 곳(endDate 없음)을 이름 아래에 적는다
const AFFILIATIONS = [basics.label, ...work.filter((job) => !job.endDate).map((job) => `${job.position} @ ${job.name}`)]

const iconOf = (types, type) => Object.entries(types).find(([name]) => name.toLowerCase() === type)[1]
// 범례에 적힌 종류 순서대로 늘어놓는다
const byType = (types, items) =>
  Object.keys(types).flatMap((name) => items.filter((item) => item.type === name.toLowerCase()))

// 로고는 단색 실루엣이라 글씨 색으로 칠한다(mask). 색은 라이트·다크 바탕에서 각각 대비 7:1 로 맞춘 값
const ORGS = {
  "gsai.kaist.ac.kr": { logo: "kaist-seal.png", color: "text-[#1854a0] dark:text-[#86b5ee]" },
  "hyunw.kim": { logo: "coco.png" },
  "www.upstage.ai": { logo: "upstage.png", color: "text-[#542be1] dark:text-[#b7a7f2]" },
  "www.korea.edu": { logo: "korea.png", color: "text-[#a51942] dark:text-[#f098b2]" },
  "miil.korea.ac.kr": { logo: "miil.png", color: "text-[#a51942] dark:text-[#f098b2]" },
  "www.nvidia.com": { logo: "nvidia.svg", color: "text-[#405d0d] dark:text-[#86c31c]" },
}

// 아이콘은 14px 폭에 줄 높이 그대로 두고 줄 가운데보다 0.5px 올린다. 글과는 8px
const ICON = "relative -top-[0.5px] mr-2 inline-block h-lh w-3.5 align-top"

function OrgLink({ node, href, children, ...props }) {
  const { logo, color } = ORGS[new URL(href).hostname] ?? {}
  // 로고와 첫 단어만 한 줄에 묶고 나머지는 평소처럼 줄을 바꾼다
  const [first, rest] = String(children).split(/(?<=^\S+)\s/)
  return (
    <a href={href} {...props} className={color}>
      <span className="whitespace-nowrap">
        {logo && (
          <span aria-hidden="true" className={`${ICON} mr-0! inline-flex items-center justify-center`}>
            <span
              className="size-3.5 bg-current"
              style={{ mask: `url(/assets/img/logos/${logo}) center / contain no-repeat` }}
            />
          </span>
        )}
        {logo && " "}
        {first}
      </span>
      {rest && ` ${rest}`}
    </a>
  )
}

function Markdown({ children }) {
  return (
    <div className="markdown">
      <ReactMarkdown rehypePlugins={[rehypeSanitize]} components={{ a: OrgLink }}>
        {children}
      </ReactMarkdown>
    </div>
  )
}

// 빌드 때 HTML 로 미리 그려 두므로 상태 없이 CSS(dark:)로 아이콘을 고른다
function ThemeToggle() {
  const toggle = () => {
    const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark"
    document.documentElement.dataset.theme = theme
    localStorage.setItem("theme", theme)
  }
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="fixed top-6 right-6 z-10 cursor-pointer text-ink"
    >
      <Icons.Moon className="size-6 dark:hidden" />
      <Icons.Sun className="hidden size-6 dark:block" />
    </button>
  )
}

function Section({ title, children }) {
  return (
    <section className="mt-18 first:mt-0">
      <h2 className="mb-6 text-lg/6 font-semibold">{title}</h2>
      {children}
    </section>
  )
}

// 넘친 줄은 아이콘 오른쪽(14 + 8px)에 맞춰 들인다
function Entry({ icon: Icon, children }) {
  return (
    <div className="pl-5.5 -indent-5.5 not-last:mb-6">
      <Icon className={ICON} />
      {children}
    </div>
  )
}

function Legend({ types }) {
  return (
    <p className="mt-6 space-x-4 text-ink-light">
      {Object.entries(types).map(([name, Icon]) => (
        <span key={name}>
          <Icon className={ICON} />
          {name}
        </span>
      ))}
    </p>
  )
}

const joinDots = (items) =>
  items.map((item, i) => (
    <span key={i}>
      {i > 0 && " · "}
      {item}
    </span>
  ))

function Publication({ paper }) {
  return (
    <Entry icon={iconOf(PUBLICATION_TYPES, paper.type)}>
      {paper.name}
      <div className="indent-0 text-ink-light">{paper.authors}</div>
      <div className="indent-0 text-ink-light">
        {joinDots([
          paper.publisher,
          ...Object.entries({ Paper: paper.url, ...paper.links }).map(([label, href]) => (
            <a href={href} {...EXTERNAL}>
              {label}
            </a>
          )),
        ])}
      </div>
    </Entry>
  )
}

// 높이·간격은 모두 본문 한 줄(24px)의 배수라 프로필과 본문의 줄이 맞는다
export default function App() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-24 sm:px-8">
      <ThemeToggle />
      <main className="grid grid-cols-4 gap-x-4 gap-y-18 sm:grid-cols-12 sm:gap-x-6">
        <header className="col-span-full text-center lg:sticky lg:top-24 lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:self-start lg:text-left">
          <img
            src={basics.image}
            alt={`Photo of ${basics.name}`}
            className="mx-auto aspect-4/5 h-72 rounded object-cover lg:mx-0"
          />
          <h1 className="mt-6 text-lg/6 font-semibold">{basics.name}</h1>
          {AFFILIATIONS.map((affiliation) => (
            <p key={affiliation} className="text-ink-light">
              {affiliation}
            </p>
          ))}
          <ul className="mt-6">
            {CONTACTS.map(({ label, link, Icon }) => (
              <li key={label}>
                <a href={link} {...(link.startsWith("mailto:") ? {} : EXTERNAL)}>
                  <Icon className={ICON} />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </header>

        <div className="col-span-full lg:col-span-8 lg:row-start-1">
          <Markdown>{summary}</Markdown>

          <Section title="Publications">
            {publications.map((paper) => (
              <Publication key={paper.name} paper={paper} />
            ))}
            <Legend types={PUBLICATION_TYPES} />
            <div className="text-ink-light">
              {footnotes.map(({ mark, text }) => (
                <p key={mark} className="pl-5.5 -indent-5.5">
                  <span className="mr-2 inline-block w-3.5 indent-0 text-center">{mark}</span>
                  {text}
                </p>
              ))}
            </div>
          </Section>

          <Section title="Awards">
            {byType(
              AWARD_TYPES,
              awards.filter((award) => award.selected !== false),
            ).map((award) => (
              <Entry key={award.title} icon={iconOf(AWARD_TYPES, award.type)}>
                {award.title}
                <span className="text-ink-light">
                  {" "}
                  · {award.awarder} · {award.date.slice(0, 4)}
                </span>
              </Entry>
            ))}
            <Legend types={AWARD_TYPES} />
          </Section>

          <Section title="Work">
            {work.map((job) => (
              <Entry key={job.name} icon={iconOf(WORK_TYPES, job.type)}>
                {job.position} @{" "}
                <OrgLink href={job.url} {...EXTERNAL}>
                  {job.name}
                </OrgLink>
                <span className="text-ink-light"> · {period(job.startDate, job.endDate)}</span>
              </Entry>
            ))}
            <Legend types={WORK_TYPES} />
          </Section>
        </div>
      </main>

      <footer className="mt-24 text-center">
        © {new Date().getFullYear()} {basics.name}
      </footer>
    </div>
  )
}
