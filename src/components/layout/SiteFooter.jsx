import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub, faGoogleScholar, faLinkedinIn, faXTwitter } from "@fortawesome/free-brands-svg-icons"
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"
import { colors } from "@toss/tds-colors"
import { Link } from "react-router-dom"
import { contact } from "@/data/contact"

const contactIcons = {
  Email: faEnvelope,
  GitHub: faGithub,
  "Google Scholar": faGoogleScholar,
  "X (Twitter)": faXTwitter,
  LinkedIn: faLinkedinIn,
}

const resumeSections = [
  ["Bio", "bio"],
  ["Education", "education"],
  ["Experience", "experience"],
  ["Publications", "publications"],
  ["Awards", "awards"],
  ["Activities", "activities"],
]

export function SiteFooter() {
  return (
    <footer className="py-[72px]" style={{ backgroundColor: colors.grey100 }}>
      <div className="mx-auto flex w-full max-w-3xl flex-col items-start gap-12 px-8 text-sm" style={{ color: colors.grey700 }}>
        <nav className="flex flex-col items-start gap-2 text-sm" aria-label="Site map">
          <Link to="/" className="font-bold" style={{ color: colors.grey700 }}>About</Link>
          <div className="flex flex-col items-start gap-2">
            {resumeSections.map(([label, id]) => (
              <a key={id} href={`/#${id}`} className="font-normal" style={{ color: colors.grey700 }}>{label}</a>
            ))}
          </div>
          <Link to="/blog" className="mt-6 font-bold" style={{ color: colors.grey700 }}>Blog</Link>
        </nav>
        <div className="text-sm">
          <p className="font-bold" style={{ color: colors.grey700 }}>Wonjun Oh&apos;s Website</p>
          <p className="font-bold" style={{ color: colors.grey700 }}>Copyright ⓒ Wonjun Oh. All Rights Reserved</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {contact.items.filter((item) => item.label !== "Website").map((item) => {
            const Icon = contactIcons[item.label]
            return (
              <a
                key={item.label}
                href={item.link}
                target={item.link.startsWith("http") ? "_blank" : undefined}
                rel={item.link.startsWith("http") ? "noreferrer" : undefined}
                aria-label={`${item.label}: ${item.value}`}
                className="flex size-9 items-center justify-center rounded-full transition-colors"
                style={{ backgroundColor: colors.grey400, color: colors.grey100 }}
                onMouseEnter={(event) => { event.currentTarget.style.backgroundColor = colors.grey500 }}
                onMouseLeave={(event) => { event.currentTarget.style.backgroundColor = colors.grey400 }}
              >
                <FontAwesomeIcon icon={Icon} className="size-6" aria-hidden="true" />
              </a>
            )
          })}
        </div>
      </div>
    </footer>
  )
}
