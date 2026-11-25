import { footnotes, period } from "./format"
import { posts } from "./blog"
import * as Icons from "./icons"
import resume from "./resume"
import Summary from "./resume/summary.md"

const { basics, education, work, awards, publications } = resume
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
  conference: Icons.Conference,
  journal: Icons.Journal,
  preprint: Icons.Preprint,
  "tech report": Icons.TechReport,
}
const AWARD_TYPES = { honor: Icons.Certificate, award: Icons.Trophy, competition: Icons.Medal }
const WORK_TYPES = { industry: Icons.Briefcase, academia: Icons.Flask }
// 이름 아래 소속: 직함(label)과 지금 다니는 곳(endDate 없음). label 의 기관 링크는 지금 다니는 학교 url
const [labelPosition, labelName] = basics.label.split(" @ ")
const AFFILIATIONS = [
  { position: labelPosition, name: labelName, url: education.find((school) => !school.endDate).url },
  ...work.filter((job) => !job.endDate),
]

const byType = (types, items) => Object.keys(types).flatMap((type) => items.filter((item) => item.type === type))

// 로고는 단색 실루엣이라 글씨 색으로 칠한다(mask). 색은 대비를 라이트 4.5:1, 다크 7:1 로 맞춘 값
const ORGS = {
  "gsai.kaist.ac.kr": { logo: "kaist-seal.png", color: "text-[#2070d6] dark:text-[#86b5ee]" },
  "hyunw.kim": { logo: "coco.png" },
  "www.upstage.ai": { logo: "upstage.png", color: "text-[#7958e7] dark:text-[#b7a7f2]" },
  "www.korea.edu": { logo: "korea.png", color: "text-[#db2158] dark:text-[#f098b2]" },
  "miil.korea.ac.kr": { logo: "miil.png", color: "text-[#db2158] dark:text-[#f098b2]" },
  "www.nvidia.com": { logo: "nvidia.svg", color: "text-[#567d12] dark:text-[#86c31c]" },
}

// 링크 앞 로고를 그릴지. 잠시 꺼 둔다(ORGS 의 logo 는 그대로)
const SHOW_LOGOS = false

// 아이콘은 14px 폭에 줄 높이 그대로 두고 줄 가운데보다 0.5px 올린다. 글과는 8px
const ICON = "relative -top-[0.5px] mr-2 inline-block h-lh w-3.5 align-top"

function OrgLink({ href, children, ...props }) {
  const { logo: orgLogo, color } = ORGS[href.split("/")[2]] ?? {}
  const logo = SHOW_LOGOS && orgLogo
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

// 빌드 때 HTML 로 미리 그려 두므로 상태 없이 CSS(dark:)로 아이콘을 고른다
function ThemeToggle() {
  const toggle = () => {
    const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark"
    document.documentElement.dataset.theme = theme
    localStorage.setItem("theme", theme)
  }
  return (
    <button type="button" onClick={toggle} aria-label="Toggle dark mode" className="cursor-pointer text-ink">
      <Icons.Moon className="relative -top-[0.5px] h-lh w-3.5 dark:hidden" />
      <Icons.Sun className="relative -top-[0.5px] hidden h-lh w-3.5 dark:block" />
    </button>
  )
}

function Section({ title, children }) {
  return (
    <section className="mt-section first:mt-0">
      {title && <h2 className="mb-line">{title}</h2>}
      {children}
    </section>
  )
}

// 넘친 줄은 아이콘 오른쪽(14 + 8px)에 맞춰 들인다
function Entry({ types, type, children }) {
  const Icon = types[type]
  return (
    <div className="pl-5.5 -indent-5.5 not-last:mb-line">
      <Icon className={ICON} />
      {children}
    </div>
  )
}

function Legend({ types }) {
  return (
    <p className="mt-line space-x-4 text-sm text-ink-light capitalize">
      {Object.entries(types).map(([name, Icon]) => (
        <span key={name}>
          <Icon className={ICON} />
          {name}
        </span>
      ))}
    </p>
  )
}

function Publication({ paper }) {
  return (
    <Entry types={PUBLICATION_TYPES} type={paper.type}>
      {paper.name}
      <div className="indent-0 text-ink-light">{paper.authors}</div>
      <div className="indent-0 text-ink-light">
        {paper.publisher}
        {Object.entries({ Paper: paper.url, ...paper.links }).map(([label, href]) => (
          <span key={label}>
            {" · "}
            <a href={href} {...EXTERNAL}>
              {label}
            </a>
          </span>
        ))}
      </div>
    </Entry>
  )
}

function Home() {
  return (
    <>
      <div className="markdown">
        <Summary components={{ a: OrgLink }} />
      </div>
      <Section title="Publications">
        {publications.map((paper) => (
          <Publication key={paper.name} paper={paper} />
        ))}
        <Legend types={PUBLICATION_TYPES} />
        <div className="text-sm text-ink-light">
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
          <Entry key={award.title} types={AWARD_TYPES} type={award.type}>
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
          <Entry key={job.name} types={WORK_TYPES} type={job.type}>
            {job.position} @{" "}
            <OrgLink href={job.url} {...EXTERNAL}>
              {job.name}
            </OrgLink>
            <span className="text-ink-light"> · {period(job.startDate, job.endDate)}</span>
          </Entry>
        ))}
        <Legend types={WORK_TYPES} />
      </Section>
    </>
  )
}

const MENU = [
  { label: "Home", link: "/" },
  { label: "Blog", link: "/blog/" },
]

const tagLink = (tag) => (
  <a key={tag} href={`/blog/tags/${encodeURIComponent(tag)}/`}>
    #{tag}
  </a>
)

function BlogList({ tag }) {
  return (
    <Section title={tag && `#${tag}`}>
      {posts
        .filter((post) => !tag || post.tags.includes(tag))
        .map((post) => (
          <p key={post.slug} className="not-last:mb-line">
            <a href={`/blog/${post.slug}/`}>{post.title}</a>
            <span className="text-ink-light"> · {post.date}</span>
          </p>
        ))}
      {tag && (
        <p className="mt-line">
          <a href="/blog/">All posts</a>
        </p>
      )}
    </Section>
  )
}

// 글의 "# 제목" 바로 아래에 작성일과 태그를 붙인다
function Post({ post }) {
  const Title = ({ children }) => (
    <>
      <h1>{children}</h1>
      <p className="mb-[calc(var(--grid)*2)] space-x-2 text-ink-light">
        <span>{post.date}</span>
        {post.tags.map(tagLink)}
      </p>
    </>
  )
  return (
    <article className="markdown">
      <a href="/blog/" className="block w-fit">
        ← Blog
      </a>
      <post.Content components={{ a: OrgLink, h1: Title }} />
    </article>
  )
}

// 주소(path)로 쪽을 고른다. 빌드 때 미리 그릴 때도 같은 path 를 넘긴다
function pageOf(path, post) {
  const [, top, slug, tag] = path.split("/")
  if (top !== "blog") return <Home />
  if (slug === "tags") return <BlogList tag={decodeURIComponent(tag)} />
  return post ? <Post post={post} /> : <BlogList />
}

// 높이·간격은 모두 줄 격자(--grid)의 배수라 프로필과 본문의 줄이 맞는다
export default function App({ path }) {
  const post = posts.find((post) => path.startsWith(`/blog/${post.slug}/`))
  // 글 쪽에선 글 제목이 h1 이라 이름은 보통 글로
  const Name = post ? "p" : "h1"
  const current = path.startsWith("/blog") ? "/blog/" : "/"
  return (
    <div className="mx-auto max-w-5xl px-6 pb-page sm:px-8">
      <nav className="sticky top-0 z-10 flex items-center justify-between bg-paper py-line">
        <div className="space-x-4">
          {MENU.map(({ label, link }) =>
            link === current ? (
              <span key={label} aria-current="page">
                {label}
              </span>
            ) : (
              <a key={label} href={link}>
                {label}
              </a>
            ),
          )}
        </div>
        <ThemeToggle />
      </nav>
      <main className="mt-line grid grid-cols-4 gap-x-4 gap-y-section sm:grid-cols-12 sm:gap-x-6">
        <header className="col-span-full text-center lg:sticky lg:top-page lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:self-start lg:text-left">
          <img
            src={basics.image}
            alt={`Photo of ${basics.name}`}
            className="mx-auto aspect-4/5 h-[calc(var(--grid)*12)] rounded object-cover lg:mx-0"
          />
          <Name className="h2 my-line">{basics.name}</Name>
          {AFFILIATIONS.map(({ position, name, url }) => (
            <p key={name} className="text-ink-light">
              {position} @{" "}
              <OrgLink href={url} {...EXTERNAL}>
                {name}
              </OrgLink>
            </p>
          ))}
          <ul className="mt-line">
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

        <div className="col-span-full lg:col-span-8 lg:row-start-1">{pageOf(path, post)}</div>
      </main>

      <footer className="mt-page text-center">
        © {new Date().getFullYear()} {basics.name}
      </footer>
    </div>
  )
}
