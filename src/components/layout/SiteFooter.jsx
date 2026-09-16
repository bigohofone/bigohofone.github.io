import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FaGoogleScholar } from "react-icons/fa6";
import { FiMail, FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi"
import { colors } from "@toss/tds-colors"
import { Link } from "react-router-dom"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown"
import { contact } from "@/data/contact"

import { Contact } from "@/components/common/contact"

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
    <footer className="text-sm" style={{ backgroundColor: colors.grey100 }}>
      <div className="mx-auto w-full max-w-3xl px-6 pt-36 pb-18" style={{ color: colors.grey700 }}>
        <nav className="flex flex-col items-start gap-2" aria-label="Site map">
          <div className="font-bold" style={{ color: colors.grey700 }}>Site Map</div>
          <Link to="/" className="" style={{ color: colors.grey700 }}>About</Link>
          <Link to="/blog" className="" style={{ color: colors.grey700 }}>Blog</Link>
        </nav>

        <div className="mt-12">
          <p className="!text-sm !font-bold" style={{ color: colors.grey700 }}>ⓒ Wonjun Oh. All Rights Reserved</p>
        </div>

        <div className="mt-12 flex flex-wrap">
          <Contact></Contact>
        </div>
      </div>
    </footer>
  )
}
