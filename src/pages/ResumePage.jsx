import { Download } from "lucide-react"
import { Box, Row, RowTitle, LinkAll, Details } from "@/components/bento/Bento"
import { downloadCV } from "@/components/cv/cvPDF"
import { profile } from "@/data/profile"
import { experience } from "@/data/experience"
import { education } from "@/data/education"
import { publications } from "@/data/publications"
import { awards } from "@/data/awards"
import { talks } from "@/data/talks"
import { extracurricular } from "@/data/extracurricular"
import { contact } from "@/data/contact"

const isOngoing = (date) => /now|present/i.test(String(date ?? ""))
const startYear = (date) => String(date ?? "").match(/\d{4}/)?.[0] ?? date
const endYear = (date) => String(date ?? "").match(/\d{4}/g)?.at(-1) ?? date

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

function ProfileBox() {
  return (
    <Box delay={0.15}>
      <div className="flex items-center">
        <div className="mr-6 size-[92px] min-w-[92px] overflow-hidden">
          <img src={profile.image} alt={profile.name} className="size-full object-cover" />
        </div>
        <div>
          <h1 className="text-sm font-normal leading-[22px] text-heading">{profile.name}</h1>
          <p className="text-sm leading-[22px]">M.S./Ph.D. Student at KAIST</p>
        </div>
      </div>
      <div className="mt-5">
        {/* Same header-strip treatment as titled boxes; -mx-5 runs the rules
            edge to edge across the box padding. */}
        <h2 className="-mx-5 border-y border-faint/40 px-5 py-3 font-mono text-sm font-normal uppercase leading-[22px] tracking-wide text-heading">
          About
        </h2>
        <p className="mt-5 text-sm leading-[22px]">
          Hey, I'm Wonjun, an M.S./Ph.D. student at KAIST, advised by Hyunwoo Kim.
          I'm interested in non-verifiable RL and pluralism / human alignment.
          Previously, I worked at Upstage on a sovereign AI project, improving LLM
          aesthetic capabilities such as frontend coding and SVG generation.
        </p>
        <p className="mt-6">
          <button
            type="button"
            onClick={downloadCV}
            className="inline-flex h-10 cursor-pointer items-center gap-2 bg-accent px-5 font-mono text-sm uppercase tracking-wide text-white transition-opacity hover:opacity-80 dark:text-[#121212]"
          >
            Download CV
            <Download className="size-4" />
          </button>
        </p>
      </div>
    </Box>
  )
}

function ExperienceBox() {
  return (
    <Box delay={0.15} title={experience.title}>
      {experience.items.map((it) => (
        <Row
          key={`${it.role}-${it.organization}`}
          year={isOngoing(it.date) ? undefined : endYear(it.date)}
          present={isOngoing(it.date)}
        >
          <LinkAll href={it.link}>{it.organization}</LinkAll>
          <p className="text-sm leading-[22px]">
            {it.role}
            {it.description && (
              <>
                {" "}
                <Details
                  logo={it.logo}
                  title={it.organization}
                  subtitle={it.role}
                  meta={`${it.date} · ${it.location}`}
                >
                  {it.description}
                </Details>
              </>
            )}
          </p>
        </Row>
      ))}
    </Box>
  )
}

function EducationBox() {
  return (
    <Box delay={0.4} title={education.title}>
      {education.items.map((it) => (
        <Row
          key={it.major}
          year={isOngoing(it.date) ? undefined : endYear(it.date)}
          present={isOngoing(it.date)}
        >
          <LinkAll href={it.link}>{it.organization}</LinkAll>
          <p className="text-sm leading-[22px]">
            {it.major}
            {it.description && (
              <>
                {" "}
                <Details logo={it.logo} title={it.organization} subtitle={it.major} meta={it.date}>
                  {it.description}
                </Details>
              </>
            )}
          </p>
        </Row>
      ))}
    </Box>
  )
}

function PublicationsBox() {
  return (
    <Box delay={0.4} title={publications.title}>
      {publications.items.map((pub) => (
        <Row key={pub.title} year={pub.venue ?? "Soon"} present={!pub.venue}>
          <LinkAll href={pub.links?.find((l) => l.label === "Paper")?.url}>
            {pub.title}
          </LinkAll>
          <p className="text-sm leading-[22px]">{renderAuthors(pub.authors)}</p>
        </Row>
      ))}
    </Box>
  )
}

function AwardsBox() {
  const items = awards.items
    .filter((it) => !it.hidden)
    .sort((a, b) => Number(startYear(b.date)) - Number(startYear(a.date)))
  return (
    <Box delay={0.4} title={`${awards.title} (Selected)`}>
      {items.map((it, i) => (
        <Row key={`${it.title}-${i}`} year={startYear(it.date)}>
          <RowTitle>{it.title}</RowTitle>
          <p className="text-sm leading-[22px]">
            {it.organization}
            {it.description && (
              <>
                {" "}
                <Details title={it.title} subtitle={it.organization} meta={it.date}>
                  {it.description}
                </Details>
              </>
            )}
          </p>
        </Row>
      ))}
    </Box>
  )
}

function ContactBox() {
  return (
    <Box delay={0.65} title={contact.title}>
      <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-3">
        {contact.items.map((it) => (
          <div key={it.label}>
            <LinkAll href={it.link} download={it.download}>{it.label}</LinkAll>
            <p className="text-sm leading-[22px]">{it.value}</p>
          </div>
        ))}
      </div>
    </Box>
  )
}

function ActivitiesBox() {
  const items = [...extracurricular.items, ...talks.items].sort(
    (a, b) => Number(startYear(b.date)) - Number(startYear(a.date))
  )
  return (
    <Box delay={0.65} title="Activities (Selected)">
      {items.map((it) => (
        <Row key={it.title} year={startYear(it.date)}>
          <RowTitle>{it.title}</RowTitle>
          <p className="text-sm leading-[22px]">
            {it.organization}
            {it.description && (
              <>
                {" "}
                <Details title={it.title} subtitle={it.organization} meta={it.date}>
                  {it.description}
                </Details>
              </>
            )}
          </p>
        </Row>
      ))}
    </Box>
  )
}

export default function ResumePage() {
  return (
    <div className="mx-auto w-full max-w-[1080px] px-5 pt-6">
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[53fr_47fr]">
        <div className="flex flex-col gap-4">
          <ProfileBox />
          <EducationBox />
          <ExperienceBox />
        </div>
        <div className="flex flex-col gap-4">
          <PublicationsBox />
          <AwardsBox />
          <ActivitiesBox />
        </div>
      </div>
      <div className="mt-4">
        <ContactBox />
      </div>
    </div>
  )
}
