import { ProfileSection } from "@/components/resume/ProfileSection"
import { ResumeSection } from "@/components/resume/ResumeSection"
import { VitaeSection } from "@/components/resume/VitaeSection"
import { BackToTop } from "@/components/ui/back-to-top"
import { NewsRow } from "@/components/ui/news-row"
import { PublicationRow } from "@/components/ui/publication-row"
import { awards, education, experience, news, publications } from "@/data/loader"
import { formatDateEndpoints, formatDateLabel, formatMonthYear } from "@/utils/date"

// 마크다운에서 읽은 항목을 행이 쓰는 모양으로 옮긴다.
// id·date·selected·md 는 섹션(정렬·필터·모달)이 쓰므로 언제나 함께 넘긴다.
function toRowItems(items, toRow) {
  return items.map((item) => ({
    id: item.id,
    date: item.date,
    selected: item.selected,
    md: item.md,
    ...toRow(item),
  }))
}

const newsItems = toRowItems(news.items, (it) => ({
  title: it.title,
  leading: formatMonthYear(it.date),
}))

const publicationItems = toRowItems(publications.items, (it) => ({
  title: it.title,
  venue: it.venue,
  authors: it.authors,
  link: it.arxiv, // 논문은 모달 대신 arXiv 로 보낸다
}))

const awardItems = toRowItems(awards.items, (it) => ({
  title: it.title,
  subtitle: `${formatDateLabel(it.date)} · ${it.organization}`,
}))

// logo 는 지점 액자에 넣을 기관 로고
const educationItems = toRowItems(education.items, (it) => ({
  title: it.organization,
  subtitle: it.major,
  logo: it.logo,
  ...formatDateEndpoints(it.date),
}))

const experienceItems = toRowItems(experience.items, (it) => ({
  title: it.organization,
  subtitle: it.role,
  logo: it.logo,
  ...formatDateEndpoints(it.date),
}))

const publicationsFootnote = (
  <>
    <p>* denotes co-first authors, who contributed equally to the work.</p>
    <p>
      † denotes corresponding authors, who supervised the work and handle inquiries about the paper.
    </p>
  </>
)

export default function ResumePage() {
  // 본문 폭은 격자 100 칸(w-frame) — 데스크톱은 첫 화면 경계 원의 지름, 모바일은 화면 전체 폭
  return (
    <div className="mx-auto w-frame overflow-x-clip">
      <ProfileSection />

      <ResumeSection
        id="news"
        title={news.title}
        items={newsItems}
        Row={NewsRow}
        usePagination
      />

      <ResumeSection
        id="publications"
        title={publications.title}
        items={publicationItems}
        Row={PublicationRow}
        usePagination
        footnote={publicationsFootnote}
      />

      <ResumeSection id="awards" title={awards.title} items={awardItems} usePagination />

      <VitaeSection id="experience" title="Work Experience" items={experienceItems} />
      <VitaeSection id="education" title="Education" items={educationItems} />

      <BackToTop />
    </div>
  )
}
