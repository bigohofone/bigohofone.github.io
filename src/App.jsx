import { footnotes, period } from "./format"
import { posts } from "./blog"
import * as Icons from "./icons"
import resume from "./resume"
import Summary from "./resume/summary.md"

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
  conference: Icons.Conference,
  journal: Icons.Journal,
  preprint: Icons.Preprint,
  "tech report": Icons.TechReport,
}
const AWARD_TYPES = { honor: Icons.Certificate, award: Icons.Trophy, competition: Icons.Medal }
const WORK_TYPES = { industry: Icons.Briefcase, academia: Icons.Flask }
// 이름 아래 소속: 직함(label)과 지금 다니는 곳(endDate 없음)
const [labelPosition, labelName] = basics.label.split(" @ ")
const AFFILIATIONS = [{ position: labelPosition, name: labelName }, ...work.filter((job) => !job.endDate)]

// 사이트에선 selected: false 인 상을 뺀다(CV 에는 모두)
const SHOWN_AWARDS = awards.filter((award) => award.selected !== false)

const byType = (types, items) => Object.keys(types).flatMap((type) => items.filter((item) => item.type === type))

// 기관 링크는 기관 색으로. 대비는 라이트 4.5:1, 다크 7:1 로 맞춘 값
const ORG_COLORS = {
  "gsai.kaist.ac.kr": "text-[#2070d6] dark:text-[#86b5ee]",
  "www.upstage.ai": "text-[#7958e7] dark:text-[#b7a7f2]",
  "www.korea.edu": "text-[#db2158] dark:text-[#f098b2]",
  "miil.korea.ac.kr": "text-[#db2158] dark:text-[#f098b2]",
  "www.nvidia.com": "text-[#567d12] dark:text-[#86c31c]",
}

// 아이콘은 줄 높이 그대로 두고 줄 가운데보다 0.5px 올린다
const ICON = "relative -top-[0.5px] mr-gap inline-block h-lh w-icon align-top"

// 모든 단추가 같이 쓰는 Material 3 모양(높이 40px, 둥글게, 14px). 누를 곳은 after 로 48px 까지 넓히고(WCAG AAA 44px 이상),
// 단추 사이를 8px 두어 서로 겹치지 않는다
const BUTTON =
  "relative flex h-10 items-center justify-center gap-2 rounded-full text-sm font-normal text-ink no-underline after:absolute after:-inset-1"
const TEXT_BUTTON = `${BUTTON} px-4 hover:bg-tint`

function OrgLink({ href, ...props }) {
  return <a href={href} {...props} className={ORG_COLORS[href.split("/")[2]]} />
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
      className={`${BUTTON} -mr-2 w-10 cursor-pointer hover:bg-tint`}
    >
      <Icons.Moon className="size-6 dark:hidden" />
      <Icons.Sun className="hidden size-6 dark:block" />
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

// 첫 쪽의 목록 섹션: 항목 사이 16px, 아래에 종류 범례(폰에선 세로로, 넓은 화면에선 한 줄로)와 주석.
// 마크다운이 아니라 prose 모양은 뺀다
function Section({ title, types, notes, children }) {
  return (
    <>
      <h2>{title}</h2>
      <div className="not-prose">
        <div className="space-y-4">{children}</div>
        <div className="mt-6 text-sm leading-6 text-ink-light">
          <p className="flex flex-col capitalize sm:flex-row sm:gap-x-4">
            {Object.entries(types).map(([name, Icon]) => (
              <span key={name} className="whitespace-nowrap">
                <Icon className={ICON} />
                {name}
              </span>
            ))}
          </p>
          {notes?.map(({ mark, text }) => (
            <p key={mark} className="pl-hang -indent-hang">
              <span className="mr-gap inline-block w-icon indent-0 text-center">{mark}</span>
              {text}
            </p>
          ))}
        </div>
      </div>
    </>
  )
}

function Publication({ paper }) {
  return (
    <Entry types={PUBLICATION_TYPES} type={paper.type}>
      {paper.name}
      <div className="indent-0 text-sm leading-6 text-ink-light">
        <p>{paper.authors}</p>
        <p>
          {paper.publisher}
          {Object.entries({ Paper: paper.url, ...paper.links }).map(([label, href]) => (
            <span key={label}>
              {" · "}
              <a href={href} {...EXTERNAL}>
                {label}
              </a>
            </span>
          ))}
        </p>
      </div>
    </Entry>
  )
}

function Home() {
  return (
    <>
      <Summary components={{ a: OrgLink }} />
      <Section title="Publications" types={PUBLICATION_TYPES} notes={footnotes}>
        {publications.map((paper) => (
          <Publication key={paper.name} paper={paper} />
        ))}
      </Section>
      <Section title="Awards" types={AWARD_TYPES}>
        {byType(AWARD_TYPES, SHOWN_AWARDS).map((award) => (
          <Entry key={award.title} types={AWARD_TYPES} type={award.type}>
            {award.title}
            <span className="text-ink-light">
              {" "}
              · {award.awarder} · {award.date.slice(0, 4)}
            </span>
          </Entry>
        ))}
      </Section>
      <Section title="Work" types={WORK_TYPES}>
        {work.map((job) => (
          <Entry key={job.name} types={WORK_TYPES} type={job.type}>
            {job.position} @{" "}
            <OrgLink href={job.url} {...EXTERNAL}>
              {job.name}
            </OrgLink>
            <span className="text-ink-light"> · {period(job.startDate, job.endDate)}</span>
          </Entry>
        ))}
      </Section>
    </>
  )
}

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

// 글 위에 블로그 목록으로 돌아가는 링크, "# 제목" 바로 아래에 작성일과 태그를 붙인다
function Post({ post }) {
  const Title = ({ children }) => (
    <>
      <h1>{children}</h1>
      <p className="space-x-2 text-ink-light">
        <span>{post.date}</span>
        {post.tags.map((tag) => (
          <a key={tag} href={`/blog/tags/${encodeURIComponent(tag)}/`}>
            #{tag}
          </a>
        ))}
      </p>
    </>
  )
  return (
    <article className="*:first:mt-0">
      <p>
        <a href="/blog/" className={`${TEXT_BUTTON} -ml-4 w-fit`}>
          <span aria-hidden="true">← </span>Blog
        </a>
      </p>
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

// 간격은 8px 단위: 항목 안 4·8px < 항목 사이 16px < 덩어리 사이 24px < 섹션 사이 64px.
// h1 은 쪽마다 하나: 첫 쪽은 프로필의 이름, 블로그는 쪽 제목(이름은 h2)
export default function App({ path }) {
  const [, top, slug, tag] = path.split("/")
  const onBlog = top === "blog"
  const post = onBlog && posts.find((post) => post.slug === slug)
  const Name = onBlog ? "h2" : "h1"
  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 sm:px-8">
      <div className="flex h-16 items-center justify-end">
        <ThemeToggle />
      </div>
      <main className="grid gap-y-8 lg:grid-cols-12 lg:gap-x-6">
        {/* 넓은 화면에선 왼쪽 Material 3 filled card, 좁은 화면에선 카드 없이 본문 위 가운데에. 사진은 여권 비율(7:9).
            간격으로 위계를 준다: 이름–소속 4px < 단추 사이 8px < 사진–이름 16px < 소개–바로가기 24px = 카드 안쪽 24px */}
        <header className="col-span-full self-start lg:sticky lg:top-8 lg:col-span-4 lg:rounded-xl lg:bg-tint lg:p-6">
          <div className="mx-auto max-w-80 text-center lg:max-w-none">
            <img
              src={basics.image}
              alt={`Photo of ${basics.name}`}
              className="aspect-7/9 w-full rounded-lg object-cover"
            />
            <Name className="mt-4 mb-1 text-2xl font-semibold">{basics.name}</Name>
            {AFFILIATIONS.map(({ position, name }) => (
              <p key={name} className="text-sm text-ink-light">
                {position} <span className="whitespace-nowrap">@ {name}</span>
              </p>
            ))}
            <ul className="mt-6 flex flex-wrap justify-center gap-2">
              {CONTACTS.map(({ label, link, Icon }) => (
                <li key={label}>
                  <a
                    href={link}
                    {...(link.startsWith("mailto:") ? {} : EXTERNAL)}
                    className={`${BUTTON} bg-white px-4 hover:shadow-sm dark:bg-ink dark:text-paper`}
                  >
                    <Icon className="size-icon" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </header>

        {/* 본문은 한 줄 65자 폭이라, 프로필이 위로 쌓이는 좁은 화면에선 가운데에 둔다 */}
        <div className={`${onBlog ? "" : "home"} prose col-span-full mx-auto w-full lg:col-span-8 lg:mx-0`}>
          {pageOf(onBlog, slug, tag, post)}
        </div>
      </main>

      <footer className="mt-24 text-center">
        © {new Date().getFullYear()} {basics.name}
      </footer>
    </div>
  )
}
