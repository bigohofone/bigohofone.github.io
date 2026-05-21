import { motion } from "framer-motion"
import { ArrowRight, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { profile } from "@/data/profile"
import { experience } from "@/data/experience"
import { education } from "@/data/education"

const enter = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  }),
}

export function Hero() {
  const current = experience.items[0]
  const school = education.items[0]

  const scrollToContact = (e) => {
    e.preventDefault()
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <motion.section
      initial="hidden"
      animate="show"
      className="mx-auto flex w-full max-w-2xl flex-col items-start gap-10 py-4"
    >
      <motion.div
        variants={enter}
        custom={0}
        className="flex w-full flex-col items-start gap-10 md:flex-row md:items-center md:gap-5"
      >
        <img
          src={profile.image}
          alt={profile.name}
          className="size-36 shrink-0 rounded-xl object-cover md:order-2"
        />
        <div className="space-y-2 md:order-1 md:flex-1">
          <h1 className="text-2xl font-medium tracking-tight md:text-4xl">
            {profile.name}
          </h1>
          {current && (
            <p className="text-sm text-muted-foreground">
              {current.role} · {current.organization}
            </p>
          )}
        </div>
      </motion.div>

      <motion.div
        variants={enter}
        custom={1}
        className="space-y-4 text-base leading-relaxed text-foreground/90 md:text-lg"
      >
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
      </motion.div>

      <motion.div
        variants={enter}
        custom={3}
        className="flex flex-wrap items-center gap-3"
      >
        <Button
          asChild
          size="lg"
          className="h-10 rounded-full px-16 text-base"
        >
          <a href="#contact" onClick={scrollToContact}>
            Contact
            <ArrowRight className="size-4" />
          </a>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="lg"
          className="h-10 rounded-full px-6 text-base"
        >
          <a href="/assets/cv.pdf" download>
            Download CV
            <Download className="size-4" />
          </a>
        </Button>
      </motion.div>
    </motion.section>
  )
}
