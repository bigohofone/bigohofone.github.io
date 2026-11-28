import { Fragment, useEffect, useState } from "react"
import { period } from "./format"
import { posts } from "./blog"
import * as Icons from "./icons"
import resume from "./resume"
import Summary from "./resume/summary.md"

const { basics, education, work, awards, publications } = resume

const PROFILE_ICONS = {
  GitHub: Icons.GitHub,
  "Google Scholar": Icons.GoogleScholar,
  LinkedIn: Icons.LinkedIn,
  X: Icons.X,
}
const CONTACTS = [
  { label: "Email", link: `mailto:${basics.email}`, Icon: Icons.Mail },
  { label: "CV", link: "/Wonjun_Oh_CV.pdf", Icon: Icons.Cv },
  ...basics.profiles.map(({ network, url }) => ({ label: network, link: url, Icon: PROFILE_ICONS[network] })),
]

// 이름 아래 소속: label 의 직함과 지금 다니는 학교, 그리고 지금 다니는 회사
const [labelPosition, labelName] = basics.label.split(" @ ")
const AFFILIATIONS = [
  { position: labelPosition, name: labelName, url: education.find((school) => !school.endDate).url },
  ...work.filter((job) => !job.endDate),
]

// 기관 링크는 기관 색으로(값은 vite-plugin-colors.js)
const ORG_COLORS = {
  "gsai.kaist.ac.kr": "text-kaist",
  "www.upstage.ai": "text-upstage",
  "www.korea.edu": "text-korea",
  "miil.korea.ac.kr": "text-korea",
  "www.nvidia.com": "text-nvidia",
}

function OrgLink({ href, ...props }) {
  return <a href={href} {...props} className={ORG_COLORS[href.split("/")[2]]} />
}

// 아이콘 단추는 아이콘 20px 를 48×48 상자 가운데에(누를 곳 48px, WCAG 2.5.5 AAA 44px 이상)
const ICON_BUTTON = "grid size-12 place-items-center"

// 빌드 때 HTML 로 미리 그려 두므로 상태 없이 CSS(dark:)로 아이콘을 고른다
function ThemeToggle() {
  const toggle = () => {
    const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark"
    document.documentElement.dataset.theme = theme
    localStorage.setItem("theme", theme)
  }
  return (
    <button type="button" onClick={toggle} aria-label="Toggle dark mode" className={`${ICON_BUTTON} cursor-pointer`}>
      <Icons.Moon className="dark:hidden" />
      <Icons.Sun className="hidden dark:block" />
    </button>
  )
}

function Section({ title, children }) {
  return (
    <>
      <hr />
      <h2>{title}</h2>
      <ul className="not-prose space-y-4">{children}</ul>
    </>
  )
}

// 섹션 목록(ul)의 한 항목: 제목 아래에 작은 글씨로 설명, 날짜
function Item({ title, sub, date }) {
  return (
    <li>
      <p>{title}</p>
      <p className="text-sm text-ink-light">
        {sub}
        <br />
        {date}
      </p>
    </li>
  )
}

function Home() {
  return (
    <>
      <Profile />
      <hr />
      <Summary components={{ a: OrgLink }} />
      <Section title="Publications">
        {publications.map((paper) => (
          <Item
            key={paper.name}
            title={<a href={paper.url}>{paper.name}</a>}
            sub={paper.authors}
            date={paper.publisher}
          />
        ))}
      </Section>
      <Section title="Awards">
        {awards.map((award) => (
          <Item key={award.title} title={award.title} sub={award.awarder} date={award.date.slice(0, 4)} />
        ))}
      </Section>
      <Section title="Work">
        {work.map((job) => (
          <Item
            key={job.name}
            title={<OrgLink href={job.url}>{job.name}</OrgLink>}
            sub={job.position}
            date={period(job.startDate, job.endDate)}
          />
        ))}
      </Section>
    </>
  )
}

// 글 목록: 글마다 제목(h2)과 그 아래 읽는 시간 · 작성일. 크기와 간격은 typography 기본값.
// 쪽 제목이 글 쪽의 제목과 같은 높이에 오도록 위에 태그 줄(28px)과 그 아래 여백(20px)만큼 빈 칸을 둔다
function BlogList({ tag }) {
  return (
    <>
      <div className="h-12" />
      <h1>{tag ? `#${tag}` : "Blog"}</h1>
      {posts
        .filter((post) => !tag || post.tags.includes(tag))
        .map((post) => (
          <Fragment key={post.slug}>
            <h2>
              <a href={`/blog/${post.slug}/`}>{post.title}</a>
            </h2>
            <p className="text-ink-light">
              {post.minutes} min read · <time dateTime={post.date}>{post.date}</time>
            </p>
          </Fragment>
        ))}
      {tag && (
        <p>
          <a href="/blog/">All posts</a>
        </p>
      )}
    </>
  )
}

// 글 머리(Medium 처럼): 위에 태그(#태그), "# 제목", 아래 한 줄에 사진·이름(누르면 첫 쪽으로) · 읽는 시간 · 작성일.
// 글쓴이 줄 위아래 여백은 h1 크기만큼
function Post({ post }) {
  const Title = ({ children }) => (
    <>
      <p className="not-prose mb-5">
        {post.tags.map((tag, i) => (
          <Fragment key={tag}>
            {i > 0 && " · "}
            <a href={`/blog/tags/${encodeURIComponent(tag)}/`}>#{tag}</a>
          </Fragment>
        ))}
      </p>
      <h1>{children}</h1>
      <div className="not-prose my-(--h1) flex items-center gap-1">
        <a href="/" className="flex items-center gap-3">
          <img src={basics.image} alt="" className="size-10 rounded-full object-cover object-top" />
          {basics.name}
        </a>
        <span className="text-ink-light">
          · {post.minutes} min read · {post.date}
        </span>
      </div>
    </>
  )
  return <post.Content components={{ a: OrgLink, h1: Title }} />
}

const NAV = [
  { label: "Home", link: "/" },
  { label: "Blog", link: "/blog/" },
]
// 지금 보는 쪽의 메뉴: Blog 는 블로그 아래 모든 쪽에서
const onPage = (path, link) => (link === "/" ? path === "/" : path.startsWith(link))

// 주소로 쪽을 고른다. 빌드 때 쪽마다 미리 그릴 때도 같은 path 를 넘긴다
function pageOf(path) {
  const [, top, slug, tag] = path.split("/")
  if (top !== "blog") return <Home />
  if (slug === "tags" && tag) return <BlogList tag={decodeURIComponent(tag)} />
  const post = posts.find((post) => post.slug === slug)
  return post ? <Post post={post} /> : <BlogList />
}

// 첫 쪽의 프로필: 가운데에 사진, 이름(쪽의 h1), 소속, 바로가기
function Profile() {
  return (
    <header className="text-center">
      <img
        src={basics.image}
        alt={`Photo of ${basics.name}`}
        className="mx-auto aspect-4/5 w-60 rounded-sm object-cover"
      />
      <h1 className="mb-6">{basics.name}</h1>
      <p>
        {AFFILIATIONS.map(({ position, name, url }) => (
          <span key={name} className="block">
            {position} @ <OrgLink href={url}>{name}</OrgLink>
          </span>
        ))}
      </p>
      <ul className="not-prose mt-8 flex flex-wrap justify-center">
        {CONTACTS.map(({ label, link, Icon }) => (
          <li key={label}>
            <a href={link} aria-label={label} title={label} className={ICON_BUTTON}>
              <Icon />
            </a>
          </li>
        ))}
      </ul>
    </header>
  )
}

// 위에 붙은 메뉴. 맨 위에선 밑줄이 없다가 스크롤하면 본문과 갈라 주는 선(7:1)이 생긴다
function Nav({ path }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 0)
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])
  return (
    <nav
      className={`sticky top-0 z-10 -mx-6 flex items-center justify-between bg-paper px-6 py-2 ${scrolled ? "shadow-[0_var(--stroke)_var(--color-ink)]" : ""}`}
    >
      <ul className="flex gap-4">
        {NAV.map(({ label, link }) => (
          <li key={label}>
            <a
              href={link}
              aria-current={onPage(path, link) ? "page" : undefined}
              className="no-underline hover:underline aria-[current]:underline"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
      <ThemeToggle />
    </nav>
  )
}

export default function App({ path }) {
  return (
    <div className="px-6 pb-24">
      <Nav path={path} />
      <main className="prose mx-auto">{pageOf(path)}</main>
      <footer className="mt-24 text-center">
        © {new Date().getFullYear()} {basics.name}
      </footer>
    </div>
  )
}
