import { Download } from "lucide-react"
import { Box, BoxTitle, Row, RowTitle, LinkAll, LogoTile, Details, PresentPill } from "@/components/bento/Bento"
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

// Renders "Apr. 2026 – Present" with the trailing "Present" as an outline
// badge so ongoing entries stand out inside plain date text.
function DateText({ date }) {
  if (!isOngoing(date)) return date
  const prefix = String(date).replace(/(now|present)\s*$/i, "").trimEnd()
  return (
    <>
      {prefix}{" "}
      <PresentPill />
    </>
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

function ProfileBox() {
  return (
    <Box delay={0.15}>
      <div className="flex items-center">
        <div className="mr-6 size-[92px] min-w-[92px] overflow-hidden rounded-full">
          <img src={profile.image} alt={profile.name} className="size-full object-cover" />
        </div>
        <div>
          <h1 className="text-sm font-normal leading-6 text-heading">{profile.name}</h1>
          <p className="text-sm leading-6">Incoming M.S./Ph.D. Student at KAIST</p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="mb-2 text-sm font-normal leading-6 text-heading">About</h2>
        <p className="text-sm leading-6">
          Hey, I'm Wonjun, an incoming M.S./Ph.D. student at COCO Lab, KAIST, currently
          interning at Upstage on LLM post-training. My research focuses on data-centric
          methods for LLM reasoning, fine-tuning, and inference — scalable and efficient
          learning through data synthesis, selection, and curriculum.
        </p>
        <p className="mt-6">
          <button
            type="button"
            onClick={downloadCV}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-accent px-5 text-sm text-white transition-opacity hover:opacity-80 dark:text-[#121212]"
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
    <Box delay={0.15}>
      <BoxTitle>{experience.title}</BoxTitle>
      {experience.items.map((it) => (
        <Row
          key={`${it.role}-${it.organization}`}
          left={<LogoTile src={it.logo} alt={it.organization} />}
        >
          <LinkAll href={it.link}>{it.organization}</LinkAll>
          <p className="text-sm leading-6">{it.role}</p>
          <p className="text-sm leading-6">
            <DateText date={it.date} /> · {it.location}
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
    <Box delay={0.4}>
      <BoxTitle>{education.title}</BoxTitle>
      {education.items.map((it) => (
        <Row key={it.major} left={<LogoTile src={it.logo} alt={it.organization} />}>
          <LinkAll href={it.link}>{it.organization}</LinkAll>
          <p className="text-sm leading-6">
            {it.major}
            <br />
            <DateText date={it.date} />
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
    <Box delay={0.4}>
      <BoxTitle>{publications.title}</BoxTitle>
      {publications.items.map((pub) => (
        <Row
          key={pub.title}
          year={pub.venue ? startYear(pub.venue) : "Soon"}
          present={!pub.venue}
        >
          <LinkAll href={pub.links?.find((l) => l.label === "Paper")?.url}>
            {pub.title}
          </LinkAll>
          <p className="text-sm leading-6">{renderAuthors(pub.authors)}</p>
          {pub.venue && (
            <p className="text-sm leading-6">
              {pub.venue}
              {pub.tags?.length ? ` · ${pub.tags.join(" · ")}` : ""}
            </p>
          )}
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
    <Box delay={0.4}>
      <BoxTitle>{awards.title} (Selected)</BoxTitle>
      {items.map((it, i) => (
        <Row key={`${it.title}-${i}`} year={startYear(it.date)}>
          <RowTitle>{it.title}</RowTitle>
          <p className="text-sm leading-6">
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
    <Box delay={0.65}>
      <BoxTitle>{contact.title}</BoxTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-3">
        {contact.items.map((it) => (
          <div key={it.label} className="mt-6">
            <LinkAll href={it.link} download={it.download}>{it.label}</LinkAll>
            <p className="text-sm leading-6">{it.value}</p>
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
    <Box delay={0.65}>
      <BoxTitle>Activities</BoxTitle>
      {items.map((it) => (
        <Row key={it.title} year={startYear(it.date)}>
          <RowTitle>{it.title}</RowTitle>
          <p className="text-sm leading-6">
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
          <AwardsBox />
        </div>
        <div className="flex flex-col gap-4">
          <ExperienceBox />
          <EducationBox />
          <PublicationsBox />
          <ActivitiesBox />
        </div>
      </div>
      <div className="mt-4">
        <ContactBox />
      </div>
    </div>
  )
}
