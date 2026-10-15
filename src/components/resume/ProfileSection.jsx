import { Overstrike } from "@/components/ui/overstrike"
import { profile } from "@/data/profile"

export function ProfileSection() {
  return (
    // 사진도 줄 높이 6 칸에 맞춰, 아래 글들이 타자 줄 위에 그대로 놓이게 한다
    <header id="bio" className="flex flex-col px-5 pt-[calc(var(--spacing-line)*2)] pb-[calc(var(--spacing-line)*2)]">
      <img
        src={profile.image}
        alt=""
        className="mx-auto size-[calc(var(--spacing-line)*6)] rounded-base object-cover object-center"
      />
      <div className="h-line" />

      <Overstrike as="h1" className="text-center text-fg-strong">
        {profile.name}
      </Overstrike>
      {profile.affiliations.map((affiliation) => (
        <p key={affiliation} className="text-center text-fg-strong">
          {affiliation}
        </p>
      ))}
      <div className="h-line" />

      <div className="space-y-line break-keep text-fg-strong">
        <p>
          I am an Integrated M.S./Ph.D. Student at{" "}
          <a href="https://gsai.kaist.ac.kr/?lang=en">KAIST AI</a>, advised by{" "}
          <a href="https://hyunw.kim/">Hyunwoo Kim</a>.
        </p>

        <p>
          My research focuses on evaluating and enhancing the general reasoning
          capabilities of LLMs. Specifically, I investigate data-centric
          methodologies leveraging LLMs to synthesize and filter high-quality
          datasets to push model reasoning beyond existing capabilities. Beyond
          data curation, I study seemingly unmeasurable non-verifiable tasks,
          seeking out the measurable properties hidden within them and turning
          those properties into verifiable environments for LLM reasoning.
        </p>

        <p>
          Previously, I was a Research Intern at{" "}
          <a href="https://www.upstage.ai/">Upstage</a>, where I contributed to
          their Sovereign AI project. Working within the Coding Agent team, I
          helped develop the Solar Open2 and Solar Pro4 models.
        </p>
      </div>
    </header>
  )
}
