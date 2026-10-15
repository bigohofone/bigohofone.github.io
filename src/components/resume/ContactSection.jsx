import { useState } from "react"
import { FileDown } from "lucide-react"
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi"

import { chipClass, chipIconClass } from "@/components/ui/chip"
import { cn } from "@/lib/utils"
import { GoogleScholarIcon, MailIcon } from "@/components/ui/icons"
import { downloadCV } from "@/components/cv/cvPDF"
import { contact } from "@/data/contact"

const contactClass = cn(chipClass, "h-line border-0 px-0 sm:h-line sm:px-0")

// 상자 폭(글자 수) — 휴대폰 폭에도 들어가고, 모서리가 글자 칸에 딱 맞도록 정수 글자로 잡는다
const BOX_WIDTH = 32
const BOX_EDGE = `+${"-".repeat(BOX_WIDTH - 2)}+`

const ICON_MAP = {
  GitHub: FiGithub,
  "Google Scholar": GoogleScholarIcon,
  LinkedIn: FiLinkedin,
  "X (Twitter)": FiTwitter,
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
      {/* 타자로 친 아스키 상자 안에 — CV 만 글자를 두고 나머지는 아이콘만, 왼쪽에서 오른쪽으로 한 줄에 */}
      <div className="mx-auto whitespace-pre text-fg-strong" style={{ width: `${BOX_WIDTH}ch` }}>
        <p aria-hidden>{BOX_EDGE}</p>
        <div className="flex">
          <p aria-hidden>|</p>
          <div className="flex flex-1 justify-evenly">
            <button
              type="button"
              onClick={downloadCV}
              className={contactClass}
              aria-label="Download CV"
            >
              <FileDown className={chipIconClass} aria-hidden="true" />
              CV
            </button>

            {email && (
              <button
                type="button"
                onClick={copyEmail}
                className={contactClass}
                aria-label="Copy email"
              >
                <MailIcon className={chipIconClass} aria-hidden="true" />
                {copied && "Copied!"}
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
                </a>
              )
            })}
          </div>
          <p aria-hidden>|</p>
        </div>
        <p aria-hidden>{BOX_EDGE}</p>
      </div>
    </section>
  )
}
