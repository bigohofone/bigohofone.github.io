import { awards, contact, education, experience, extracurricular, footnotes, profile, publications } from "./data"

// CV — 사이트 데이터로 LaTeX 문서를 만든다(vite-plugin-cv.js 가 Tectonic 으로 PDF 로).
// 양식은 hyunw.kim/CV/CV.pdf 를 따른다 — US Letter, Times 계열 세리프, 작은 대문자 섹션 이름 밑에 가는 줄,
// 항목은 왼쪽에 굵은 제목·기울인 부제, 같은 줄 오른쪽 끝에 장소·날짜

// 날짜("2026-03-30", "2026", 기간 "2026-03-30 ~ Present")를 "Mar. 2026 – Present" 처럼
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const monthYear = (date) => (/^\d{4}-\d{2}/.test(date) ? `${MONTHS[date.slice(5, 7) - 1]}. ${date.slice(0, 4)}` : date)
const period = (date) => date.split(" ~ ").map(monthYear).join(" – ")

// LaTeX 에서 뜻이 있는 글자를 글자 그대로
const tex = (text) =>
  String(text ?? "")
    .trim()
    .replace(/[\\{}&%$#_^~]/g, (c) => ({ "\\": "\\textbackslash{}", "^": "\\^{}", "~": "\\~{}" })[c] ?? `\\${c}`)

const PREAMBLE = String.raw`\documentclass[10pt]{article}
% 여백은 0.5인치 — 위만 이름 줄이 참고 CV(Word)와 같은 높이에 오게 4pt 더
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
% 섹션 이름 — 작은 대문자 11pt 밑에 가는 줄
\newcommand{\cvsection}[2]{\vspace{18pt}{\fontsize{11}{13}\selectfont\textsc{#1}}{\scriptsize\ #2}\par\vspace{-6pt}\rule{\linewidth}{0.4pt}\par\vspace{8pt}}
% 항목 한 줄 — 왼쪽 글(넘치면 왼쪽 칸 안에서 줄바꿈)과 오른쪽 끝에 붙는 글. 항목은 섹션 줄보다 양옆으로 6pt 들인다
\newlength{\rightcol}\setlength{\rightcol}{2.22in}
\newcommand{\cvrow}[2]{\parbox[t]{\dimexpr\linewidth-\rightcol}{\raggedright #1\strut}\hfill\parbox[t]{\rightcol}{\raggedleft #2\strut}\par\vspace{2pt}}
% 오른쪽 글이 없는 줄은 폭 전체를 쓴다
\newcommand{\cvline}[1]{{\raggedright #1\par}\vspace{2pt}}
\newenvironment{cventry}{\begin{list}{}{\leftmargin=6pt\rightmargin=6pt\itemsep=0pt\topsep=0pt\parsep=0pt\partopsep=0pt}\item\relax}{\end{list}\vspace{13pt}}
`

const row = (left, right) => (right ? `\\cvrow{${left}}{${right}}` : `\\cvline{${left}}`)
const entry = (rows) => `\\begin{cventry}\n${rows.filter(Boolean).join("\n")}\n\\end{cventry}`
const bold = (text) => `\\textbf{${tex(text)}}`
const italic = (text, small) => (small ? `{\\small\\textit{${tex(text)}}}` : `\\textit{${tex(text)}}`)
const section = (title, items, toEntry, note = "") =>
  items.length ? [`\\cvsection{${tex(title)}}{${note}}`, ...items.map(toEntry)].join("\n") : ""

// 저자 줄 — 내 이름에만 밑줄
const authors = (text) => tex(text).split(profile.name).join(`\\underline{${profile.name}}`)
const body = (text) => (text ? row(tex(text)) : "")

// 제목·날짜, 그 밑에 기울인 부제 — 수상·대외 활동
const titledEntry = (item) => entry([row(bold(item.title), italic(period(item.date), true)), row(italic(item.organization))])

// Research Interest — 사이트 소개 글(profile.md 본문)의 연구 문단을 그대로: "My research" 문단과 굵은 머리말(**…**)로 시작하는 연구 방향 문단
const researchParagraphs = () =>
  profile.body
    .split(/\n\s*\n/)
    .filter((text) => text.startsWith("My research") || text.startsWith("**"))
    .map((text) => `${tex(text).replace(/\*\*(.+?)\*\*/g, "\\textbf{$1}")}\\par\\vspace{4pt}`)

export function cvTex() {
  const website = contact.find((item) => item.label === "Website")
  const links = ["Google Scholar", "LinkedIn", "GitHub", "Email"]
    .map((label) => contact.find((item) => item.label === label))
    .map((item) => `\\link{${tex(item.link)}}{${tex(item.label.toLowerCase())}}`)
    .join(" | ")

  return [
    PREAMBLE,
    "\\begin{document}",
    // 머리 — 큰 이름과 소속, 그 밑에 웹사이트와 링크
    `{\\fontsize{18}{20}\\selectfont\\textbf{${tex(profile.name)}}}\\hfill ${tex(profile.affiliations[0])}\\par`,
    `{\\fontsize{11}{13}\\selectfont\\link{${tex(website.link)}}{${tex(website.value)}}\\hfill ${links}}\\par`,

    `\\cvsection{Research Interest}{}`,
    ...researchParagraphs(),

    section("Education", education, (item) =>
      entry([row(bold(item.organization), tex(item.location)), row(italic(item.major), italic(period(item.date), true)), body(item.body)])
    ),
    section("Experience", experience, (item) =>
      entry([row(bold(item.organization), tex(item.location)), row(italic(item.role), italic(period(item.date), true)), body(item.body)])
    ),
    section(
      "Publications",
      publications,
      (item) => entry([row(bold(item.title), italic(item.venue)), row(authors(item.authors))]),
      `(${footnotes.map(({ mark, text }) => `${mark} ${text}`).join(", ")})`
    ),

    // 수상부터는 둘째 페이지에
    "\\newpage",
    section("Awards & Honors", awards.filter((item) => item.type === "Honor"), titledEntry),
    section("Competitions", awards.filter((item) => item.type === "Competition"), titledEntry),
    section("Extracurricular Activities", extracurricular, titledEntry),
    "\\end{document}",
  ]
    .filter(Boolean)
    .join("\n")
}
