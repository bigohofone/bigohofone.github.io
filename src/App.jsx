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

// 사이트에선 selected: false 인 상을 뺀다(CV 에는 모두)
const SHOWN_AWARDS = awards.filter((award) => award.selected !== false)

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

// 아이콘은 줄 높이 그대로 두고 줄 가운데보다 0.5px 올린다
const ICON_BOX = "relative -top-[0.5px] h-lh w-icon"
const ICON = `${ICON_BOX} mr-gap inline-block align-top`

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
              className="size-icon bg-current"
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
      <Icons.Moon className={`${ICON_BOX} dark:hidden`} />
      <Icons.Sun className={`${ICON_BOX} hidden dark:block`} />
    </button>
  )
}

function Entry({ types, type, children }) {
  const Icon = types[type]
  return (
    <div className="pl-hang -indent-hang">
      <Icon className={ICON} />
      {children}
    </div>
  )
}

function Legend({ types, children }) {
  return (
    <div className="text-sm text-ink-light">
      <p className="space-x-4 capitalize">
        {Object.entries(types).map(([name, Icon]) => (
          <span key={name}>
            <Icon className={ICON} />
            {name}
          </span>
        ))}
      </p>
      {children}
    </div>
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
      <Summary components={{ a: OrgLink }} />

      <h2>Publications</h2>
      {publications.map((paper) => (
        <Publication key={paper.name} paper={paper} />
      ))}
      <Legend types={PUBLICATION_TYPES}>
        {footnotes.map(({ mark, text }) => (
          <p key={mark} className="pl-hang -indent-hang">
            <span className="mr-gap inline-block w-icon indent-0 text-center">{mark}</span>
            {text}
          </p>
        ))}
      </Legend>

      <h2>Awards</h2>
      {byType(AWARD_TYPES, SHOWN_AWARDS).map((award) => (
        <Entry key={award.title} types={AWARD_TYPES} type={award.type}>
          {award.title}
          <span className="text-ink-light">
            {" "}
            · {award.awarder} · {award.date.slice(0, 4)}
          </span>
        </Entry>
      ))}
      <Legend types={AWARD_TYPES} />

      <h2>Work</h2>
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
    </>
  )
}

const MENU = [
  { label: "About Me", link: "/" },
  { label: "Blog", link: "/blog/" },
]

const tagLink = (tag) => (
  <a key={tag} href={`/blog/tags/${encodeURIComponent(tag)}/`}>
    #{tag}
  </a>
)

function BlogList({ tag }) {
  return (
    <>
      <h1>{tag ? `#${tag}` : "Blog"}</h1>
      {posts
        .filter((post) => !tag || post.tags.includes(tag))
        .map((post) => (
          <p key={post.slug}>
            <a href={`/blog/${post.slug}/`}>{post.title}</a>
            <span className="text-ink-light">
              {" "}
              · {post.date} · <Icons.Stopwatch className={ICON} />
              {post.minutes} min
            </span>
          </p>
        ))}
      {tag && (
        <p>
          <a href="/blog/">All posts</a>
        </p>
      )}
    </>
  )
}

// 글의 "# 제목" 바로 아래에 작성일과 태그를 붙인다
function Post({ post }) {
  const Title = ({ children }) => (
    <>
      <h1>{children}</h1>
      <p className="space-x-2 text-ink-light">
        <span>{post.date}</span>
        {post.tags.map(tagLink)}
      </p>
    </>
  )
  return (
    <article className="flow">
      <post.Content components={{ a: OrgLink, h1: Title }} />
    </article>
  )
}

// 주소로 쪽을 고른다. 빌드 때 쪽마다 미리 그릴 때도 같은 path 를 넘긴다
function pageOf(onBlog, slug, tag, post) {
  if (!onBlog) return <Home />
  if (slug === "tags" && tag) return <BlogList tag={decodeURIComponent(tag)} />
  return post ? <Post post={post} /> : <BlogList />
}

// 높이·간격은 모두 줄 격자(--grid)의 배수라 프로필과 본문의 줄이 맞는다.
// 쪽마다 h1 은 그 쪽의 제목 하나(About Me, Blog, #태그, 글 제목)이고 프로필의 이름은 어디서나 h2
export default function App({ path }) {
  const [, top, slug, tag] = path.split("/")
  const onBlog = top === "blog"
  const post = onBlog && posts.find((post) => post.slug === slug)
  return (
    <div className="mx-auto max-w-5xl px-6 pb-page sm:px-8">
      <nav className="sticky top-0 z-10 flex items-center justify-between bg-paper py-line">
        <div className="space-x-4">
          {MENU.map(({ label, link }) => (
            <a key={label} href={link} aria-current={link === path ? "page" : undefined}>
              {label}
            </a>
          ))}
        </div>
        <ThemeToggle />
      </nav>
      <main className="mt-line grid grid-cols-4 gap-x-4 gap-y-section sm:grid-cols-12 sm:gap-x-6">
        {/* 블로그에선 화면이 좁아 프로필이 글 위로 쌓일 때 프로필을 숨긴다 */}
        <header
          className={`${onBlog ? "max-lg:hidden" : ""} col-span-full text-center lg:sticky lg:top-page lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:self-start lg:text-left`}
        >
          <img
            src={basics.image}
            alt={`Photo of ${basics.name}`}
            className="mx-auto aspect-4/5 h-[calc(var(--grid)*12)] rounded object-cover lg:mx-0"
          />
          <h2 className="my-line">{basics.name}</h2>
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

        <div className="flow col-span-full lg:col-span-8 lg:row-start-1">{pageOf(onBlog, slug, tag, post)}</div>
      </main>

      <footer className="mt-page text-center">
        © {new Date().getFullYear()} {basics.name}
      </footer>
    </div>
  )
}
