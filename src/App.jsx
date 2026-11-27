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

// 아이콘 단추는 Material 3 기준: 아이콘 24px, 누를 곳 48px(WCAG 2.5.5 AAA 44px 이상), 누를 곳 사이 8px. 아이콘 사이는 32px
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
      <div className="not-prose space-y-4">{children}</div>
    </>
  )
}

// 목록 한 항목: 제목 아래에 작은 글씨로 설명, 날짜, 링크
function Item({ title, sub, date, links = {} }) {
  return (
    <div>
      <p>{title}</p>
      <div className="text-sm">
        <p className="text-ink-light">
          {sub}
          <br />
          {date}
        </p>
        <p className="space-x-4">
          {Object.entries(links).map(([label, url]) => (
            <a key={label} href={url}>
              {label}
            </a>
          ))}
        </p>
      </div>
    </div>
  )
}

function Home() {
  return (
    <>
      <Summary components={{ a: OrgLink }} />
      <Section title="Publications">
        {publications.map((paper) => (
          <Item
            key={paper.name}
            title={paper.name}
            sub={paper.authors}
            date={paper.publisher}
            links={{ Paper: paper.url, ...paper.links }}
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
              · {post.date} · {post.minutes} min
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

// "# 제목" 바로 아래에 작성일과 태그를 붙인다
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
    <>
      <p>
        <a href="/blog/">← Blog</a>
      </p>
      <post.Content components={{ a: OrgLink, h1: Title }} />
    </>
  )
}

// 주소로 쪽을 고른다. 빌드 때 쪽마다 미리 그릴 때도 같은 path 를 넘긴다
function pageOf(path) {
  const [, top, slug, tag] = path.split("/")
  if (top !== "blog") return <Home />
  if (slug === "tags" && tag) return <BlogList tag={decodeURIComponent(tag)} />
  const post = posts.find((post) => post.slug === slug)
  return post ? <Post post={post} /> : <BlogList />
}

// h1 은 쪽마다 하나: 첫 쪽은 이름, 블로그는 쪽 제목(이름은 h2)
export default function App({ path }) {
  const Name = path.startsWith("/blog") ? "h2" : "h1"
  return (
    <div className="px-6 pb-24">
      <div className="flex justify-end py-2">
        <ThemeToggle />
      </div>
      <main className="prose mx-auto">
        <header className="text-center">
          <img
            src={basics.image}
            alt={`Photo of ${basics.name}`}
            className="mx-auto aspect-4/5 w-60 rounded-sm object-cover"
          />
          <Name>{basics.name}</Name>
          <p>
            {AFFILIATIONS.map(({ position, name, url }) => (
              <span key={name} className="block">
                {position} @ <OrgLink href={url}>{name}</OrgLink>
              </span>
            ))}
          </p>
          <ul className="not-prose mt-8 flex justify-center gap-2">
            {CONTACTS.map(({ label, link, Icon }) => (
              <li key={label}>
                <a href={link} aria-label={label} title={label} className={ICON_BUTTON}>
                  <Icon />
                </a>
              </li>
            ))}
          </ul>
        </header>
        <hr />
        {pageOf(path)}
      </main>
      <footer className="mt-24 text-center">
        © {new Date().getFullYear()} {basics.name}
      </footer>
    </div>
  )
}
