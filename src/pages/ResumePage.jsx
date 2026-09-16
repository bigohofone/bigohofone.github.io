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

import { Contact } from "@/components/common/contact"

function ProfileBox() {
  return (
    <div id="bio" className="pt-16 pb-24 flex flex-col">
      <div className={`size-32 overflow-hidden rounded-xl`}>
        <img
          src={profile.image}
          alt={profile.name}
          className="size-full object-cover"
        />
      </div>
      <div className={`mt-8`}>
        <h1 className="text-2xl font-bold text-gray-700">
          {profile.name}
        </h1>

        <p className="mt-2 text-base font-medium text-gray-500">
          M.S./Ph.D. Student, KAIST AI
        </p>

        <h2 className="mt-6 text-xl font-bold text-gray-700">
          About Me
        </h2>

        <p className="mt-2 text-base font-medium text-gray-500">
          Hi, I'm Wonjun Oh! I am an Integrated M.S./Ph.D. Student at{" "}
          <a href="https://gsai.kaist.ac.kr/?lang=en">KAIST AI</a>, advised by{" "}
          <a href="https://hyunw.kim/">Hyunwoo Kim</a>.
        </p>

        <p className="mt-2 text-base font-medium text-gray-500">
          My research focuses on evaluating and enhancing the general reasoning
          capabilities of LLMs. Specifically, I investigate data-centric
          methodologies leveraging LLMs to synthesize and filter high-quality
          datasets to push model reasoning beyond existing capabilities. Beyond
          data curation, I am deeply interested in extending LLM reasoning to
          non-verifiable tasks where deterministic verification signals are
          absent.
        </p>

        <p className="mt-2 text-base font-medium text-gray-500">
          Previously, I was a Research Intern at{" "}
          <a href="https://www.upstage.ai/">Upstage</a>, where I contributed to
          their Sovereign AI project. Working within the Coding Agent team, I
          helped develop the Solar Open2 and Solar Pro4 models.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mt-12">
        {/* <Button variant="secondary" size="lg" onClick={handleCopyEmail}>
          <span className="flex size-6 shrink-0 items-center justify-center">
            <FiMail className="size-5 stroke-2" aria-hidden="true" />
          </span>
          Mail
        </Button> */}
        <Contact />

        <Button variant="default" size="lg" onClick={downloadCV}>
          <span className="flex size-6 shrink-0 items-center justify-center">
            <FiDownload className="size-5 stroke-2" aria-hidden="true" />
          </span>
          CV
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
    subtitle: it.authors,
    date: it.date,
    selected: it.selected,
    md: it.md,
  }))

  return (
    <Box
      id="publications"
      title={publications.title}
      items={items}
      useCount
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
      useCount
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
      useCount
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