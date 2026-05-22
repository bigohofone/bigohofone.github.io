import { Hero } from "@/components/resume/Hero"
import { EducationList } from "@/components/resume/EducationList"
import { ExperienceList } from "@/components/resume/ExperienceList"
import { PublicationList } from "@/components/resume/PublicationList"
import { AwardList } from "@/components/resume/AwardList"
import { TalkList } from "@/components/resume/TalkList"
import { ExtracurricularList } from "@/components/resume/ExtracurricularList"
import { Section } from "@/components/resume/Section"
import { SectionIndex } from "@/components/layout/SectionIndex"

const snapSection =
  "flex min-h-[100dvh] snap-start flex-col px-4 pt-[calc(6rem+env(safe-area-inset-top))] pb-[calc(2.5rem+env(safe-area-inset-bottom))] md:px-8"

const SECTIONS = [
  { id: "intro", label: "Intro" },
  { id: "background", label: "Background" },
  { id: "publications", label: "Publications" },
  { id: "awards", label: "Awards" },
  { id: "activities", label: "Activities" },
  { id: "contact", label: "Contact" },
]

export default function ResumePage() {
  return (
    <>
      <SectionIndex items={SECTIONS} />
      <main className="mx-auto w-full max-w-6xl">
        <section
          id="intro"
          className={`${snapSection} md:justify-center md:!pt-0 md:!pb-0`}
        >
          <Hero />
        </section>
        <section id="background" className={snapSection}>
          <Section title="Background">
            <div className="flex flex-1 flex-col gap-16">
              <div className="space-y-3">
                <h3 className="text-sm text-muted-foreground">
                  Experience
                </h3>
                <ExperienceList />
              </div>
              <div className="space-y-3">
                <h3 className="text-sm text-muted-foreground">
                  Education
                </h3>
                <EducationList />
              </div>
            </div>
          </Section>
        </section>
        <section id="publications" className={snapSection}>
          <PublicationList />
        </section>
        <section id="awards" className={snapSection}>
          <AwardList />
        </section>
        <section id="activities" className={snapSection}>
          <Section title="Activities">
            <div className="flex flex-1 flex-col gap-16">
              <div className="space-y-3">
                <h3 className="text-sm text-muted-foreground">Talks</h3>
                <TalkList />
              </div>
              <div className="space-y-3">
                <h3 className="text-sm text-muted-foreground">
                  Extracurricular
                </h3>
                <ExtracurricularList />
              </div>
            </div>
          </Section>
        </section>
      </main>
    </>
  )
}
