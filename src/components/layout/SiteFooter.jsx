import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FaGoogleScholar } from "react-icons/fa6";
import { FiMail, FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi"
import { colors } from "@toss/tds-colors"
import { Link } from "react-router-dom"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown"
import { contact } from "@/data/contact"

const contactIcons = {
  Email: FiMail,
  GitHub: FiGithub,
  "Google Scholar": FaGoogleScholar,
  "X (Twitter)": FiTwitter,
  LinkedIn: FiLinkedin,
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Link to="/" className="font-bold outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-[4px]" style={{ color: colors.grey700 }}>Shortcut</Link>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-fit">
              {resumeSections.map(([label, id]) => (
                <DropdownMenuItem key={id}>
                  <a href={`/#${id}`} className="text-sm" style={{ color: colors.grey700 }}>{label}</a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex flex-col items-start gap-2">
            {resumeSections.map(([label, id]) => (
              <a key={id} href={`/#${id}`} className="font-normal outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-[4px]" style={{ color: colors.grey700 }}>{label}</a>
            ))}
          </div>
          {/* <Link to="/blog" className="mt-6 font-bold outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-[4px]" style={{ color: colors.grey700 }}>Blog</Link> */}
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
                className="flex size-11 items-center justify-center rounded-[12px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                style={{ backgroundColor: colors.grey400, color: colors.grey100 }}
                onMouseEnter={(event) => { event.currentTarget.style.backgroundColor = colors.grey500 }}
                onMouseLeave={(event) => { event.currentTarget.style.backgroundColor = colors.grey400 }}
              >
                <Icon className="size-5 stroke-2" aria-hidden="true" />
              </a>
            )
          })}
        </div>
      </div>
    </footer>
  )
}
