import { colors } from "@toss/tds-colors"
import { Box } from "@/components/bento/Bento"
import { downloadCV } from "@/components/cv/cvPDF"

import { profile } from "@/data/profile"
import { contact } from "@/data/contact"
import { experience } from "@/data/experience"
import { education } from "@/data/education"
import { publications } from "@/data/publications"
import { awards } from "@/data/awards"
import { talks } from "@/data/talks"
import { extracurricular } from "@/data/extracurricular"

import { Button } from "@/components/ui/button"
import { FiMail, FiDownload } from "react-icons/fi"


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


const EMAIL =
  contact.items.find((item) => item.label === "Email")?.value ?? ""


async function handleCopyEmail() {
  try {
    await navigator.clipboard.writeText(EMAIL)
    alert(`Copied "${EMAIL}" to clipboard!`)
  } catch (error) {
    console.error("Failed to copy email:", error)
  }
}


function ProfileBox() {
  return (
    <div id="bio" className="pt-12 pb-18 flex flex-col">
      <div className={`size-32 overflow-hidden rounded-xl`}>
        <img
          src={profile.image}
          alt={profile.name}
          className="size-full object-cover"
        />
      </div>
      <div className={`mt-8`}>
        <h1>
          {profile.name}
        </h1>

        <p>
          M.S./Ph.D. Student, KAIST AI
        </p>

        <h2>
          About Me
        </h2>

        <p>
          Hi, I'm Wonjun Oh! I am an Integrated M.S./Ph.D. Student at{" "}
          <a href="https://gsai.kaist.ac.kr/?lang=en">KAIST AI</a>, advised by{" "}
          <a href="https://hyunw.kim/">Hyunwoo Kim</a>.
        </p>

        <p>
          My research focuses on evaluating and enhancing the general reasoning
          capabilities of LLMs. Specifically, I investigate data-centric
          methodologies leveraging LLMs to synthesize and filter high-quality
          datasets to push model reasoning beyond existing capabilities. Beyond
          data curation, I am deeply interested in extending LLM reasoning to
          non-verifiable tasks where deterministic verification signals are
          absent.
        </p>

        <p>
          Previously, I was a Research Intern at{" "}
          <a href="https://www.upstage.ai/">Upstage</a>, where I contributed to
          their Sovereign AI project. Working within the Coding Agent team, I
          helped develop the Solar Open2 and Solar Pro4 models.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 mt-12">
        <Button variant="secondary" size="md" onClick={handleCopyEmail}>
          <span className="flex size-6 shrink-0 items-center justify-center">
            <FiMail className="size-5 stroke-2" aria-hidden="true" />
          </span>
          Mail
        </Button>

        <Button variant="default" size="md" onClick={downloadCV}>
          <span className="flex size-6 shrink-0 items-center justify-center">
            <FiDownload className="size-5 stroke-2" aria-hidden="true" />
          </span>
          Curriculum Vitae
        </Button>
      </div>
    </div>
  )
}


function BentoSeparator() {
  return (
    <div
      className="relative left-1/2 h-4 w-screen -translate-x-1/2 md:hidden"
      style={{ backgroundColor: colors.grey100 }}
      aria-hidden="true"
    />
  )
}


function EducationBox() {
  const items = education.items.map((it) => ({
    title: it.organization,
    subtitle: it.major,
    date: it.date,
    selected: it.selected,
    md: it.md,
  }))

  return (
    <Box
      id="education"
      title={education.title}
      items={items}
    />
  )
}


function ExperienceBox() {
  const items = experience.items.map((it) => ({
    title: it.organization,
    subtitle: it.role,
    date: it.date,
    selected: it.selected,
    md: it.md,
  }))

  return (
    <Box
      id="experience"
      title={experience.title}
      items={items}
    />
  )
}


function PublicationsBox() {
  const items = publications.items.map((it) => ({
    title: it.title,
    subtitle: renderAuthors(it.authors),
    date: it.date,
    selected: it.selected,
    md: it.md,
  }))

  return (
    <Box
      id="publications"
      title={publications.title}
      items={items}
      useYearFilter
      useSelectedFilter
      usePagination
      pageSize={10}
    />
  )
}


function AwardsBox() {
  const items = awards.items.map((it) => ({
    title: it.title,
    subtitle: it.organization,
    date: it.date,
    selected: it.selected,
    md: it.md,
  }))

  return (
    <Box
      id="awards"
      title={awards.title}
      items={items}
      useYearFilter
      useSelectedFilter
      usePagination
      pageSize={10}
    />
  )
}


function ActivitiesBox() {
  const items = [...extracurricular.items, ...talks.items].map((it) => ({
    title: it.title,
    subtitle: it.organization,
    date: it.date,
    selected: it.selected,
    md: it.md,
  }))

  return (
    <Box
      id="activities"
      title="Activities"
      items={items}
      useYearFilter
      useSelectedFilter
      usePagination
      pageSize={10}
    />
  )
}

export default function ResumePage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 pb-18">
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