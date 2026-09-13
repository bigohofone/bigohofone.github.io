import { useState } from "react"
import { colors } from "@toss/tds-colors"
import { Box, Row, RowTitle, Details, LINE } from "@/components/bento/Bento"
import { downloadCV } from "@/components/cv/cvPDF"
import { profile } from "@/data/profile"
import { contact } from "@/data/contact"
import { experience } from "@/data/experience"
import { education } from "@/data/education"
import { publications } from "@/data/publications"
import { awards } from "@/data/awards"
import { talks } from "@/data/talks"
import { extracurricular } from "@/data/extracurricular"
import { FiMail, FiDownload } from "react-icons/fi";
import { getYearsInRange, compareItemsByDateThenAlphabetical, startYear, endYear, parseDateRange } from "@/utils/date"

const isOngoing = (date) => parseDateRange(date).isPresent


function SelectionToggle({ showSelected, onToggle }) {
  return (
    <button
      type="button"
      aria-pressed={showSelected}
      onClick={onToggle}
      className="mt-6 block cursor-pointer rounded-[12px] px-4 py-2.5 text-sm font-bold leading-6 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      style={{
        backgroundColor: colors.grey100,
        color: colors.grey700,
      }}
      onMouseEnter={(event) => { event.currentTarget.style.backgroundColor = colors.grey200 }}
      onMouseLeave={(event) => { event.currentTarget.style.backgroundColor = colors.grey100 }}
    >
      {showSelected ? "Selected" : "All"}
    </button>
  )
}

function YearIndicator({ checked }) {
  return (
    <span
      className="flex size-6 shrink-0 items-center justify-center rounded-[4px] border-2"
      style={{
        borderColor: checked ? colors.blue500 : colors.grey300,
        backgroundColor: checked ? colors.blue500 : colors.white,
      }}
    >
      {checked && (
        <svg className="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8 6.5 11.5 13 4.5" stroke={colors.white} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  )
}

function YearSelect({ years, selectedYears, onToggleYear, onToggleAll }) {
  const [open, setOpen] = useState(false)
  const allSelected = selectedYears.length === years.length

  return (
    <div
      className="relative mt-6"
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation()
          setOpen(false)
        }
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex cursor-pointer items-center gap-1 rounded-[12px] px-4 py-2.5 text-sm font-bold leading-6 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        style={{ backgroundColor: colors.grey100, color: colors.grey700 }}
        onMouseEnter={(event) => { event.currentTarget.style.backgroundColor = colors.grey200 }}
        onMouseLeave={(event) => { event.currentTarget.style.backgroundColor = colors.grey100 }}
      >
        Years
        <span className="flex size-6 shrink-0 items-center justify-center">
          <svg className="size-4 shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 5.5 8 10.5 13 5.5" stroke={colors.grey300} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-10 mt-3 min-w-32 rounded-[12px] p-2 shadow-[0_4px_16px_rgba(0,0,0,0.12)]" style={{ backgroundColor: colors.white }}>
          <button
            type="button"
            role="checkbox"
            aria-checked={allSelected}
            onClick={onToggleAll}
            className="flex w-full cursor-pointer items-center gap-2 rounded-[8px] px-4 py-2.5 text-left text-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            style={{ backgroundColor: colors.white, color: colors.grey700 }}
            onMouseEnter={(event) => { event.currentTarget.style.backgroundColor = colors.grey100 }}
            onMouseLeave={(event) => { event.currentTarget.style.backgroundColor = colors.white }}
          >
            <YearIndicator checked={allSelected} />
            All
          </button>
          {years.map((year) => {
            const checked = selectedYears.includes(year)
            return (
              <button
                key={year}
                type="button"
                role="checkbox"
                aria-checked={checked}
                onClick={() => onToggleYear(year)}
                className="flex w-full cursor-pointer items-center gap-2 rounded-[8px] px-4 py-2.5 text-left text-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                style={{ backgroundColor: colors.white, color: colors.grey700 }}
                onMouseEnter={(event) => { event.currentTarget.style.backgroundColor = colors.grey100 }}
                onMouseLeave={(event) => { event.currentTarget.style.backgroundColor = colors.white }}
              >
                <YearIndicator checked={checked} />
                {year}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function SectionControls({ showSelected, onToggle, years, selectedYears, onToggleYear, onToggleAll }) {
  return (
    <div className="flex items-start justify-start gap-2">
      <SelectionToggle showSelected={showSelected} onToggle={onToggle} />
      <YearSelect years={years} selectedYears={selectedYears} onToggleYear={onToggleYear} onToggleAll={onToggleAll} />
    </div>
  )
}

// Authors come as "{Name, Name}* , Name, {Name}†" — a braced group shares one
// marker, rendered once as a superscript after the group. All names stay in
// the body color; only the publication title uses the heading color.
function renderAuthors(authors) {
  const parts = authors.split(/({[^}]+}[*†]?)/g).filter(Boolean)
  return parts.map((part, i) => {
    const match = part.match(/^{([^}]+)}([*†]?)$/)
    if (!match) return <span key={i}>{part}</span>
    const [, names, marker] = match
    if (!marker) return <span key={i}>{names}</span>
    const splitAt = names.lastIndexOf(", ")
    const head = splitAt >= 0 ? names.slice(0, splitAt + 2) : ""
    const tail = splitAt >= 0 ? names.slice(splitAt + 2) : names
    return (
      <span key={i}>
        {head}
        <span className="whitespace-nowrap">
          {tail}
          <sup className="ml-0.5">{marker}</sup>
        </span>
      </span>
    )
  })
}

const EMAIL = contact.items.find((item) => item.label === "Email")?.value ?? ""

const handleCopyEmail = async () => {
  try {
    await navigator.clipboard.writeText(EMAIL);
    alert(`Copied "${EMAIL}" to clipboard!`);
  } catch (err) {
    console.error('Failed to copy email:', err);
  }
};

function ProfileBox() {
  return (
    <Box id="bio">
      <div className="size-32 overflow-hidden rounded-[12px]">
        <img src={profile.image} alt={profile.name} className="size-full object-cover" />
      </div>
      <h1 className={`mt-9 text-xl font-bold ${LINE}`} style={{ color: colors.grey800 }}>{profile.name}</h1>
      <p className={`mt-3 text-sm ${LINE}`}>
        M.S./Ph.D. Student, KAIST AI
      </p>
      <h2 className={`mt-5 text-base font-semibold ${LINE} tracking-wide`} style={{ color: colors.grey800 }}>
        About Me
      </h2>
      <p className={`mt-3 text-sm ${LINE}`}>
        Hi, I'm Wonjun Oh!
      </p>
      <p className={`mt-3 text-sm ${LINE}`}>
        I am an M.S./Ph.D. Student at <a href="https://gsai.kaist.ac.kr/?lang=en">KAIST AI</a> advised by <a href="https://hyunw.kim/">Hyunwoo Kim</a>. My research focuses on evaluating and enhancing the general reasoning capabilities of LLMs. Specifically, I investigate data-centric methodologies leveraging LLMs to synthesize and filter high-quality datasets to push model reasoning beyond existing capabilities. Beyond data curation, I am deeply interested in extending LLM reasoning to non-verifiable tasks where deterministic verification signals are absent.
      </p>
      <p className={`mt-3 text-sm ${LINE}`}>
        Previously, I was a Research Intern at <a href="https://www.upstage.ai/">Upstage</a>, where I contributed to their Sovereign AI project. Working within the Coding Agent team, I helped develop the Solar Open2 and Solar Pro4 models.
      </p>
      <p className="mt-7 gap-2 flex flex-wrap">
        <button
          type="button"
          onClick={handleCopyEmail}
          className="inline-flex cursor-pointer items-center gap-1 rounded-[12px] px-4 py-2.5 text-sm font-bold transition-opacity hover:opacity-80 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          style={{ backgroundColor: colors.grey100, color: colors.grey700 }}
        >
          Mail 
          <span className="flex size-6 shrink-0 items-center justify-center">
            <FiMail className="size-4 stroke-2" aria-hidden="true" />
          </span>
        </button>
        <button
          type="button"
          onClick={downloadCV}
          className="inline-flex cursor-pointer items-center gap-1 rounded-[12px] px-4 py-2.5 text-sm font-bold transition-opacity hover:opacity-80 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          style={{ backgroundColor: colors.blue500, color: colors.white }}
        >
          Curriculum Vitae
          <span className="flex size-6 shrink-0 items-center justify-center">
            <FiDownload className="size-4 stroke-2" aria-hidden="true" />
          </span>
        </button>
      </p>
    </Box>
  )
}

function BentoSeparator() {
  return (
    <div
      className="relative left-1/2 h-2 w-screen -translate-x-1/2"
      style={{ backgroundColor: colors.grey100 }}
      aria-hidden="true"
    />
  )
}

function ExperienceBox() {
  return (
    <Box id="experience" title={experience.title}>
      {experience.items.map((it) => (
        <Row
          key={`${it.role}-${it.organization}`}
          year={isOngoing(it.date) ? undefined : endYear(it.date)}
          present={isOngoing(it.date)}
          description={it.role}
        >
          {it.markdownContent || it.description ? (
            <Details
              logo={it.logo}
              title={it.organization}
              subtitle={it.role}
              meta={`${it.date} · ${it.location}`}
              trigger={it.organization}
            >
              {it.markdownContent || it.description}
            </Details>
          ) : (
            <RowTitle>{it.organization}</RowTitle>
          )}
        </Row>
      ))}
    </Box>
  )
}

function EducationBox() {
  return (
    <Box id="education" title={education.title}>
      {education.items.map((it) => (
        <Row
          key={it.major}
          year={isOngoing(it.date) ? undefined : endYear(it.date)}
          present={isOngoing(it.date)}
          description={it.major}
        >
          {it.markdownContent || it.description ? (
            <Details logo={it.logo} title={it.organization} subtitle={it.major} meta={it.date} trigger={it.organization}>
              {it.markdownContent || it.description}
            </Details>
          ) : (
            <RowTitle>{it.organization}</RowTitle>
          )}
        </Row>
      ))}
    </Box>
  )
}

function PublicationsBox() {

  const [showSelected, setShowSelected] = useState(true)

  // Year filter is based on `date` field, not `venue`
  const years = [...new Set(publications.items.map((item) => startYear(item.date)))].filter((y) => /^\d{4}$/.test(y)).sort().reverse()
  const [selectedYears, setSelectedYears] = useState(years)

  const items = publications.items
    .filter((item) => (!showSelected || item.selected !== false) && selectedYears.includes(startYear(item.date)))
    .sort(compareItemsByDateThenAlphabetical)

  return (
    <Box
      id="publications"
      title={publications.title}
      count={publications.items.length}
      controls={<SectionControls showSelected={showSelected} onToggle={() => setShowSelected((v) => !v)} years={years} selectedYears={selectedYears} onToggleYear={(year) => setSelectedYears((v) => v.includes(year) ? v.filter((y) => y !== year) : [...v, year])} onToggleAll={() => setSelectedYears((v) => v.length === years.length ? [] : years)} />}
    >
      {items.map((pub) => {
        const arxivUrl = pub.links?.find((l) => l.url.includes("arxiv.org"))?.url
        return (
          <Row
            key={pub.title}
            year={pub.venue ?? startYear(pub.date) ?? "Soon"}
            present={!pub.venue && !pub.date}
            description={renderAuthors(pub.authors)}
            onClick={arxivUrl ? () => window.open(arxivUrl, "_blank", "noopener,noreferrer") : undefined}
          >
            <RowTitle>{pub.title}</RowTitle>
          </Row>
        )
      })}
    </Box>
  )
}


function AwardsBox() {
  const [showSelected, setShowSelected] = useState(true)

  const itemsWithYears = awards.items.map((item) => ({
    ...item,
    years: getYearsInRange(item.date),
  }))

  const years = [...new Set(itemsWithYears.flatMap((item) => item.years))]
    .sort()
    .reverse()

  const [selectedYears, setSelectedYears] = useState(years)

  const filteredItems = itemsWithYears
    .filter((item) =>
      (!showSelected || item.selected !== false) &&
      item.years.some((year) => selectedYears.includes(year))
    )
    .sort(compareItemsByDateThenAlphabetical)

  return (
    <Box
      id="awards"
      title={awards.title}
      count={filteredItems.length}
      controls={
        <SectionControls
          showSelected={showSelected}
          onToggle={() => setShowSelected((v) => !v)}
          years={years}
          selectedYears={selectedYears}
          onToggleYear={(year) =>
            setSelectedYears((v) =>
              v.includes(year) ? v.filter((y) => y !== year) : [...v, year]
            )
          }
          onToggleAll={() =>
            setSelectedYears((v) => (v.length === years.length ? [] : years))
          }
        />
      }
    >
      {filteredItems.map((it, i) => (
        <Row
          key={`${it.title}-${i}`}
          year={it.years[it.years.length - 1] ?? ""}
          description={it.organization}
        >
          {it.markdownContent || it.description ? (
            <Details
              title={it.title}
              subtitle={it.organization}
              meta={it.date}
              trigger={it.title}
            >
              {it.markdownContent || it.description}
            </Details>
          ) : (
            <RowTitle>{it.title}</RowTitle>
          )}
        </Row>
      ))}
    </Box>
  )
}


function ActivitiesBox() {
  const [showSelected, setShowSelected] = useState(true)
  const items = [...extracurricular.items, ...talks.items]
  const years = [...new Set(items.map((item) => startYear(item.date)))].filter((item) => /^\d{4}$/.test(item)).sort().reverse()
  const [selectedYears, setSelectedYears] = useState(years)
  const visibleItems = items
    .filter((item) => (!showSelected || item.selected !== false) && selectedYears.includes(startYear(item.date)))
    .sort(compareItemsByDateThenAlphabetical)

  return (
    <Box
      id="activities"
      title="Activities"
      count={items.length}
      controls={<SectionControls showSelected={showSelected} onToggle={() => setShowSelected((value) => !value)} years={years} selectedYears={selectedYears} onToggleYear={(year) => setSelectedYears((value) => value.includes(year) ? value.filter((item) => item !== year) : [...value, year])} onToggleAll={() => setSelectedYears((value) => value.length === years.length ? [] : years)} />}
    >
      {visibleItems.map((it) => (
        <Row key={it.title} year={startYear(it.date)} description={it.organization}>
          {it.markdownContent || it.description ? (
            <Details title={it.title} subtitle={it.organization} meta={it.date} trigger={it.title}>
              {it.markdownContent || it.description}
            </Details>
          ) : (
            <RowTitle>{it.title}</RowTitle>
          )}
        </Row>
      ))}
    </Box>
  )
}

export default function ResumePage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6">
      <div className="flex flex-col">
        <ProfileBox />
        <BentoSeparator />
        <EducationBox />
        <BentoSeparator />
        <ExperienceBox />
        <BentoSeparator />
        <PublicationsBox />
        <BentoSeparator /> 
        <AwardsBox />
        <BentoSeparator />
        <ActivitiesBox />
      </div>
    </div>
  )
}
