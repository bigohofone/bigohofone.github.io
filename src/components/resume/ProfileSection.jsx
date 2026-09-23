import { profile } from "@/data/profile"

export function ProfileSection() {
  return (
    <header id="bio" className="flex flex-col px-5 pt-15 pb-20">
      <img
        src={profile.image}
        alt=""
        className="mx-auto aspect-square w-40 rounded-base object-cover object-center"
      />
      <div className="h-5" />

      <h1 className="text-center text-[28px] font-medium sm:text-[32px] text-fg-strong">{profile.name}</h1>
      <div className="h-2" />

      <div>
        {profile.affiliations.map((affiliation) => (
          <p key={affiliation} className="text-center text-base font-normal text-fg-strong">
            {affiliation}
          </p>
        ))}
      </div>
      <div className="h-10" />

      <div className="space-y-[18px] break-keep text-base/[1.8] font-normal sm:text-lg/[1.8] text-fg-strong">
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
    </header>
  )
}
