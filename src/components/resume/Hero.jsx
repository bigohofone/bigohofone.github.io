import { ArrowDownCircle, ArrowRightCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { profile } from "@/data/profile"
import { experience } from "@/data/experience"

export function Hero() {
  const current = experience.items[0]

  const scrollToContact = (e) => {
    e.preventDefault()
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-5">
        <img
          src={profile.image}
          alt={profile.name}
          className="size-24 shrink-0 rounded-xl object-cover"
        />
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{profile.name}</h1>
          {current && (
            <p className="text-sm text-muted-foreground">
              {current.role} · {current.organization}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          I am an incoming graduate student at KAIST, where I am a member of
          the COCOLab under the supervision of Prof. Hyonwoo Kim. I earned my
          B.S. from Korea University.
        </p>
        <p>
          My research adopts a data-centric approach across NLP and multimodal
          domains, specifically targeting bottlenecks in training paradigms
          like Supervised Fine-Tuning and Reinforcement Learning. Currently, I
          am working on data selection and filtering methods to enhance LLM
          reasoning capabilities.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <a href="#contact" onClick={scrollToContact}>
            Contact
            <ArrowRightCircle className="size-4" />
          </a>
        </Button>
        <Button asChild variant="outline">
          <a href="/assets/cv.pdf" download>
            Download CV
            <ArrowDownCircle className="size-4" />
          </a>
        </Button>
      </div>
    </div>
  )
}
