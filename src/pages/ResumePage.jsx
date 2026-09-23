import { ContactSection } from "@/components/resume/ContactSection"
import { ProfileSection } from "@/components/resume/ProfileSection"
import { ResumeSection } from "@/components/resume/ResumeSection"
import { BackToTop } from "@/components/ui/back-to-top"
import { NewsRow } from "@/components/ui/news-row"
import { PublicationRow } from "@/components/ui/publication-row"
import { TimelineRow } from "@/components/ui/timeline-row"
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
  authors: it.authors,
  image: it.image,
}))

const awardItems = toRowItems(awards.items, (it) => ({
  title: it.title,
  subtitle: `${formatDateLabel(it.date)} · ${it.organization}`,
}))

// Education 과 Experience 는 폴더를 따로 두고 관리하되, 화면에서는 한 줄기 타임라인으로 합친다
const vitaeItems = [
  ...toRowItems(education.items, (it) => ({
    title: it.organization,
    subtitle: it.major,
    ...formatDateEndpoints(it.date),
  })),
  ...toRowItems(experience.items, (it) => ({
    title: it.organization,
    subtitle: it.role,
    ...formatDateEndpoints(it.date),
  })),
]

const publicationsFootnote = (
  <>
    <p>* denotes co-first authors, who contributed equally to the work.</p>
    <p>
      † denotes corresponding authors, who supervised the work and handle inquiries about the paper.
    </p>
  </>
)

export default function ResumePage() {
  // 데스크톱에서도 최대 폭 768px까지만 — 모바일과 같은 한 줄 레이아웃
  return (
    <div className="mx-auto w-full max-w-[768px]">
      <ProfileSection />
      <ContactSection />

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

      <ResumeSection id="vitae" title="Vitae" items={vitaeItems} Row={TimelineRow} extraTitleGap />

      <BackToTop />
    </div>
  )
}
