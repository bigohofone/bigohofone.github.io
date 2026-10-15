import { useState } from "react"
import { FileDown } from "lucide-react"
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi"

import { chipClass, chipIconClass } from "@/components/ui/chip"
import { cn } from "@/lib/utils"
import { GoogleScholarIcon, MailIcon } from "@/components/ui/icons"
import { downloadCV } from "@/components/cv/cvPDF"
import { contact } from "@/data/contact"

const contactClass = cn(chipClass, "h-line border-0 px-0 sm:h-line sm:px-0")

const ICON_MAP = {
  GitHub: FiGithub,
  "Google Scholar": GoogleScholarIcon,
  LinkedIn: FiLinkedin,
  "X (Twitter)": FiTwitter,
}

// 긴 이름은 줄이지 않고 짧은 표기로 바꾼다
const SHORT_LABEL = {
  "Google Scholar": "Scholar",
  "X (Twitter)": "X",
}

export function ContactSection() {
  const email = contact.items.find((item) => item.label === "Email")
  // Email 은 복사 버튼으로 따로 두고, ICON_MAP 에 있는 항목만 링크 칩으로 만든다
  const links = contact.items.filter((item) => ICON_MAP[item.label])
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    if (!email?.value) return
    try {
      await navigator.clipboard.writeText(email.value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (error) {
      console.error("Failed to copy email:", error)
    }
  }

  return (
    <section id="contact" className="px-5 pb-[calc(var(--spacing-line)*4)]">
      {/* 아이콘과 이름을 왼쪽에서 오른쪽으로 한 줄에, 좁으면 다음 줄로 */}
      <div className="flex flex-wrap justify-center gap-x-[2ch]">
        <button type="button" onClick={downloadCV} className={contactClass} aria-label="Download CV">
          <FileDown className={chipIconClass} aria-hidden="true" />
          CV
        </button>

        {email && (
          <button type="button" onClick={copyEmail} className={contactClass} aria-label="Copy email">
            <MailIcon className={chipIconClass} aria-hidden="true" />
            {copied ? "Copied!" : "Email"}
          </button>
        )}

        {links.map((item) => {
          const Icon = ICON_MAP[item.label]

          return (
            <a
              key={item.label}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className={contactClass}
              aria-label={item.label}
            >
              <Icon className={chipIconClass} aria-hidden="true" />
              {SHORT_LABEL[item.label] ?? item.label}
            </a>
          )
        })}
      </div>
    </section>
  )
}
