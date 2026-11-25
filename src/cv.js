import { footnotes, period } from "./format"
import resume from "./resume"
import { readFileSync } from "node:fs"

const { basics, work, volunteer, education, awards, publications } = resume
// 사이트에선 summary.md 가 컴포넌트로 바뀌므로 CV 는 원문을 직접 읽는다(빌드 때 Node 에서만 돈다)
const summary = readFileSync("src/resume/summary.md", "utf8")

// 양식은 hyunw.kim/CV/CV.pdf 를 따른다. vite-plugin-cv.js 가 Tectonic 으로 PDF 로 만든다

const tex = (text) =>
  String(text ?? "")
    .trim()
    .replace(/[\\{}&%$#_^~]/g, (c) => ({ "\\": "\\textbackslash{}", "^": "\\^{}", "~": "\\~{}" })[c] ?? `\\${c}`)

const PREAMBLE = String.raw`\documentclass[10pt]{article}
\usepackage[letterpaper,margin=0.5in,top=\dimexpr0.5in+4pt\relax,footskip=0.23in]{geometry}
\usepackage{fontspec}
\setmainfont{texgyretermes}[Extension=.otf,UprightFont=*-regular,BoldFont=*-bold,ItalicFont=*-italic,BoldItalicFont=*-bolditalic]
\usepackage{xcolor}
\definecolor{link}{HTML}{2B5CB8}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr,lastpage}
\pagestyle{fancy}\fancyhf{}\renewcommand{\headrulewidth}{0pt}
\cfoot{\thepage\ of \pageref*{LastPage}}
\setlength{\parindent}{0pt}\setlength{\parskip}{0pt}
\linespread{1.06}
\newcommand{\link}[2]{\href{#1}{\color{link}#2}}
\newcommand{\cvsection}[2]{\vspace{18pt}{\fontsize{11}{13}\selectfont\textsc{#1}}{\scriptsize\ #2}\par\vspace{-6pt}\rule{\linewidth}{0.4pt}\par\vspace{8pt}}
\newlength{\rightcol}\setlength{\rightcol}{2.22in}
\newcommand{\cvrow}[2]{\parbox[t]{\dimexpr\linewidth-\rightcol}{\raggedright #1\strut}\hfill\parbox[t]{\rightcol}{\raggedleft #2\strut}\par\vspace{2pt}}
\newcommand{\cvline}[1]{{\raggedright #1\par}\vspace{2pt}}
\newenvironment{cventry}{\begin{list}{}{\leftmargin=6pt\rightmargin=6pt\itemsep=0pt\topsep=0pt\parsep=0pt\partopsep=0pt}\item\relax}{\end{list}\vspace{13pt}}
`

const row = (left, right) => (right ? `\\cvrow{${left}}{${right}}` : `\\cvline{${left}}`)
const entry = (rows) => `\\begin{cventry}\n${rows.filter(Boolean).join("\n")}\n\\end{cventry}`
const bold = (text) => `\\textbf{${tex(text)}}`
const italic = (text, small) => (small ? `{\\small\\textit{${tex(text)}}}` : `\\textit{${tex(text)}}`)
const section = (title, items, toEntry, note = "") =>
  items.length ? [`\\cvsection{${tex(title)}}{${note}}`, ...items.map(toEntry)].join("\n") : ""

const authors = (text) => tex(text).split(basics.name).join(`\\underline{${basics.name}}`)
const body = (text) => (text ? row(tex(text)) : "")

const titledEntry = (title, date, org) => entry([row(bold(title), italic(date, true)), row(italic(org))])
const placeEntry = (place, title, item) =>
  entry([
    row(bold(place), tex(item.location)),
    row(italic(title), italic(period(item.startDate, item.endDate), true)),
    body(item.summary),
  ])

// Research Interest 는 사이트 소개 글의 "My research" 문단과 그 아래 목록을 그대로 쓴다
const researchParagraphs = () =>
  summary
    .split(/\n\s*\n/)
    .flatMap((text) => text.split(/\n(?=- )/))
    .filter((text) => text.startsWith("My research") || text.startsWith("- "))
    .map((text) => {
      const item = text.startsWith("- ")
      const line = tex(item ? text.slice(2) : text).replace(/\*\*(.+?)\*\*/g, "\\textbf{$1}")
      return `${item ? "\\textbullet\\ " : ""}${line}\\par\\vspace{4pt}`
    })

export function cvTex() {
  const links = [
    ...["Google Scholar", "LinkedIn", "GitHub"].map((network) => basics.profiles.find((p) => p.network === network)),
    { network: "Email", url: `mailto:${basics.email}` },
  ]
    .map(({ network, url }) => `\\link{${tex(url)}}{${tex(network.toLowerCase())}}`)
    .join(" | ")

  return [
    PREAMBLE,
    "\\begin{document}",
    `{\\fontsize{18}{20}\\selectfont\\textbf{${tex(basics.name)}}}\\hfill ${tex(basics.label)}\\par`,
    `{\\fontsize{11}{13}\\selectfont\\link{${tex(basics.url)}}{${tex(basics.url.replace("https://", ""))}}\\hfill ${links}}\\par`,

    `\\cvsection{Research Interest}{}`,
    ...researchParagraphs(),

    section("Education", education, (item) =>
      placeEntry(
        item.institution,
        `${item.studyType} in ${item.area}${item.score ? `; GPA: ${item.score}` : ""}`,
        item,
      ),
    ),
    section("Work", work, (item) => placeEntry(item.name, item.position, item)),
    section(
      "Publications",
      publications,
      (item) => entry([row(bold(item.name), italic(item.publisher)), row(authors(item.authors))]),
      `(${footnotes.map(({ mark, text }) => `${mark} ${text}`).join(", ")})`,
    ),

    // 수상부터는 둘째 페이지에
    "\\newpage",
    section(
      "Awards",
      ["honor", "award", "competition"].flatMap((type) => awards.filter((item) => item.type === type)),
      (item) => titledEntry(item.title, item.date, item.awarder),
    ),
    section("Volunteer", volunteer, (item) =>
      titledEntry(item.position, period(item.startDate, item.endDate), item.organization),
    ),
    "\\end{document}",
  ]
    .filter(Boolean)
    .join("\n")
}
