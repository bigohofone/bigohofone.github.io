import { Hero } from "@/components/resume/Hero"
import { SnapSection } from "@/components/layout/SnapSection"
import { PaginatedList } from "@/components/resume/PaginatedList"
import { ExperienceRow } from "@/components/resume/ExperienceList"
import { EducationRow } from "@/components/resume/EducationList"
import { TalkRow } from "@/components/resume/TalkList"
import { ExtraRow } from "@/components/resume/ExtracurricularList"
import { AwardList } from "@/components/resume/AwardList"
import { PublicationList } from "@/components/resume/PublicationList"
import { experience } from "@/data/experience"
import { education } from "@/data/education"
import { talks } from "@/data/talks"
import { extracurricular } from "@/data/extracurricular"

export default function ResumePage() {
  return (
    <>
      <section id="intro" className="snap-start h-dvh flex flex-col justify-center px-4 pt-14">
        <div className="mx-auto w-full max-w-4xl">
          <Hero />
        </div>
      </section>

      <SnapSection id="background" title="Background">
        <PaginatedList
          label="Experience"
          items={experience.items}
          renderRow={(it) => <ExperienceRow item={it} />}
          getKey={(it, i) => `${it.role}-${it.organization}-${i}`}
        />
        <PaginatedList
          label="Education"
          items={education.items}
          renderRow={(it) => <EducationRow item={it} />}
          getKey={(it, i) => `${it.major}-${it.organization}-${i}`}
        />
      </SnapSection>

      <PublicationList />
      <AwardList />

      <SnapSection id="activities" title="Activities">
        <PaginatedList
          label="Talks"
          items={talks.items}
          renderRow={(it) => <TalkRow item={it} />}
          getKey={(it, i) => `${it.title}-${i}`}
        />
        <PaginatedList
          label="Extracurricular"
          items={extracurricular.items}
          renderRow={(it) => <ExtraRow item={it} />}
          getKey={(it, i) => `${it.title}-${i}`}
        />
      </SnapSection>
    </>
  )
}
