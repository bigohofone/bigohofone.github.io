import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  Footer,
  LineRuleType,
  Packer,
  PageNumber,
  Paragraph,
  Table,
  TableBorders,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  VerticalAlignTable,
  WidthType,
} from "docx"

import { awards, contact, education, experience, extracurricular, profile, publicationList, publications, talks } from "@/data"
import { formatDateEndpoints } from "@/lib/date"

// 양식은 hyunw.kim/CV/CV.pdf 를 따른다 — US Letter, 세리프 글씨, 작은 대문자 섹션 이름 밑에 가는 줄,
// 항목은 왼쪽에 굵은 제목·기울인 부제, 같은 줄 오른쪽 끝에 장소·날짜.
// Word 는 길이를 twip(1/1440 인치), 글씨 크기를 반 포인트로 받는다
const LETTER = { width: 12240, height: 15840 }
// 여백은 위·아래·좌우 0.5인치, 쪽 번호는 바닥에서 0.27인치
const MARGIN = { top: 720, right: 720, bottom: 720, left: 720, footer: 392 }
const TEXT_WIDTH = LETTER.width - MARGIN.left - MARGIN.right
// 항목은 섹션 이름보다 양옆으로 조금 들이고, 오른쪽 칸(장소·날짜)은 2.2인치
const INSET = 120
const RIGHT_WIDTH = 3200
const LINK_COLOR = "2B5CB8"

const period = (date) => {
  const { start, end } = formatDateEndpoints(date)
  return end ? `${start} – ${end}` : start
}

// 머리의 웹사이트·링크 — 본문보다 한 단계 큰 11pt
const link = (text, href) => new ExternalHyperlink({ link: href, children: [new TextRun({ text, color: LINK_COLOR, size: 22 })] })

// pageBreakBefore 면 새 페이지에서 시작한다
const sectionTitle = (title, { note, pageBreakBefore } = {}) =>
  new Paragraph({
    pageBreakBefore,
    children: [
      new TextRun({ text: title, smallCaps: true, size: 22 }),
      ...(note ? [new TextRun({ text: `  ${note}`, size: 16 })] : []),
    ],
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: "000000", space: 2 } },
    spacing: { before: 360, after: 200 },
  })

// 왼쪽 글과 오른쪽 끝에 붙는 글을 한 줄에 — 오른쪽 맞춤 탭은 Word 밖(Pages·미리보기 등)에서 무시되기도 해, 테두리 없는 두 칸 표로 놓는다.
// 오른쪽 글이 없는 줄은 두 칸을 합친다
// 칸 폭은 고정 — 안 그러면 글 길이에 맞춰 칸이 줄어든다
// 한 항목은 페이지를 넘어가며 쪼개지지 않게 마지막 줄 말고는 다음 줄과 붙인다(keepNext)
const cell = (runs, width, { alignment, columnSpan, keepNext, verticalAlign, spacing = { after: 40 } } = {}) =>
  new TableCell({
    width: { size: width, type: WidthType.DXA },
    columnSpan,
    verticalAlign,
    children: [new Paragraph({ children: runs, alignment, keepNext, spacing })],
  })
// rowSpacing 은 줄마다 문단 간격(없으면 기본)
const table = (rows, width, { indent = 0, rightWidth = RIGHT_WIDTH, verticalAlign, rowSpacing = [] } = {}) =>
  new Table({
    width: { size: width, type: WidthType.DXA },
    columnWidths: [width - rightWidth, rightWidth],
    layout: TableLayoutType.FIXED,
    indent: { size: indent, type: WidthType.DXA },
    borders: TableBorders.NONE,
    margins: { left: 0, right: 0 },
    rows: rows.map(([left, right = []], i) => {
      const keepNext = i < rows.length - 1
      const spacing = rowSpacing[i]
      return new TableRow({
        cantSplit: true,
        children: right.length
          ? [
              cell(left, width - rightWidth, { keepNext, verticalAlign, spacing }),
              cell(right, rightWidth, { alignment: AlignmentType.RIGHT, keepNext, verticalAlign, spacing }),
            ]
          : [cell(left, width, { columnSpan: 2, keepNext, verticalAlign, spacing })],
      })
    }),
  })
// 항목 하나 — 표 뒤에 12pt 빈 줄을 둬 항목 사이를 16pt 쯤 띄운다(맞붙은 표는 Word 가 하나로 합치기도 해서)
const entry = (rows) => [
  table(rows, TEXT_WIDTH - INSET * 2, { indent: INSET }),
  new Paragraph({ spacing: { line: 240, lineRule: LineRuleType.EXACT, after: 0 } }),
]

const bold = (text) => new TextRun({ text, bold: true })
const italic = (text, size) => new TextRun({ text, italics: true, size })

// 섹션 — 항목이 없으면 제목도 뺀다
const section = ({ title, items }, toRows, titleOptions) =>
  items.length ? [sectionTitle(title, titleOptions), ...items.flatMap(toRows)] : []

// 저자 줄 — 내 이름에만 밑줄
const authorRuns = (authors) =>
  String(authors)
    .split(profile.name)
    .flatMap((part, i) => [...(i > 0 ? [new TextRun({ text: profile.name, underline: {} })] : []), new TextRun(part)])

const bodyLines = (body) => (body ? body.trim().split(/\n\s*\n/) : [])

// 제목·날짜, 그 밑에 기울인 부제 — 수상·발표·대외 활동
const titledEntry = (item) => entry([[[bold(item.title)], [italic(period(item.date), 18)]], [[italic(item.organization)]]])

function cvDocument() {
  const website = contact.items.find((item) => item.label === "Website")
  const links = ["Google Scholar", "LinkedIn", "GitHub", "Email"].map((label) =>
    contact.items.find((item) => item.label === label)
  )

  return new Document({
    creator: profile.name,
    title: `${profile.name} — CV`,
    // 줄 간격 1.15 — Word 는 240 을 한 줄로 친다
    styles: { default: { document: { run: { font: "Times New Roman", size: 20 }, paragraph: { spacing: { line: 276 } } } } },
    sections: [
      {
        properties: { page: { size: LETTER, margin: MARGIN } },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ children: [PageNumber.CURRENT, " of ", PageNumber.TOTAL_PAGES] })],
              }),
            ],
          }),
        },
        children: [
          table(
            [
              [[new TextRun({ text: profile.name, bold: true, size: 36 })], [new TextRun(profile.affiliations[0])]],
              [
                [link(website.value, website.link)],
                links.flatMap((item, i) => [
                  ...(i > 0 ? [new TextRun({ text: " | ", size: 22 })] : []),
                  link(item.label.toLowerCase(), item.link),
                ]),
              ],
            ],
            TEXT_WIDTH,
            // 머리 오른쪽 칸(소속·링크)은 한 줄에 들게 넓게, 큰 이름 옆 소속은 아래에 붙여 밑줄 링크와 이어지게.
            // 줄 높이는 참고 CV 처럼 낮게 딱 정한다 — 이름 줄은 18pt 글씨가 잘리지 않는 20pt, 링크 줄은 13.4pt
            {
              rightWidth: 6000,
              verticalAlign: VerticalAlignTable.BOTTOM,
              rowSpacing: [
                { line: 400, lineRule: LineRuleType.EXACT, after: 0 },
                { line: 268, lineRule: LineRuleType.EXACT, after: 0 },
              ],
            }
          ),

          sectionTitle("Research Interest"),
          new Paragraph({
            children: [bold(`${profile.research_interest.title}. `), new TextRun(profile.research_interest.text)],
            alignment: AlignmentType.JUSTIFIED,
          }),

          ...section(education, (item) =>
            entry([
              [[bold(item.organization)], [new TextRun(item.location)]],
              [[italic(item.major)], [italic(period(item.date), 18)]],
              ...bodyLines(item.body).map((text) => [[new TextRun({ text, size: 20 })]]),
            ])
          ),

          ...section(experience, (item) =>
            entry([
              [[bold(item.organization)], [new TextRun(item.location)]],
              [[italic(item.role)], [italic(period(item.date), 18)]],
              ...bodyLines(item.body).map((text) => [[new TextRun({ text, size: 20 })]]),
            ])
          ),

          ...section(
            publications,
            (item) =>
              entry([
                [[bold(item.title)], [italic(item.venue)]],
                [authorRuns(item.authors), item.tags?.length ? [italic(item.tags.join(", "), 18)] : []],
              ]),
            { note: `(${publicationList.footnotes.map(({ mark, text }) => `${mark} ${text}`).join(", ")})` }
          ),

          // 수상부터는 둘째 페이지에
          ...section({ title: awards.title, items: awards.items.filter((item) => item.type === "Honor") }, titledEntry, {
            pageBreakBefore: true,
          }),
          ...section({ title: "Competitions", items: awards.items.filter((item) => item.type === "Competition") }, titledEntry),
          ...section(talks, titledEntry),
          ...section(extracurricular, titledEntry),
        ],
      },
    ],
  })
}

// 빌드 때 vite-plugin-cv.js 가 불러 Word 파일로 쓰고, PDF 로 바꾼다
export const cvDocx = () => Packer.toBuffer(cvDocument())
