import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import rehypeSanitize from "rehype-sanitize"
import remarkGfm from "remark-gfm"

import { datePillClass } from "@/components/ui/row-styles"
import { formatDateEndpoints } from "@/utils/date"
import { parseMarkdownWithYaml } from "@/utils/markdown"

import "highlight.js/styles/github.css"

// 항목 종류에 따라 제목/부제목으로 쓸 값이 다르다 (수상은 title, 학력·경력은 organization)
function headerOf(metadata) {
  const { title, organization, major, role, venue, date } = metadata
  const { start, end } = formatDateEndpoints(date)

  return {
    title: title ?? organization,
    subtitle: major ?? role ?? venue ?? (title ? organization : undefined),
    period: end ? `${start} – ${end}` : start,
  }
}

export function MarkdownRenderer({ content }) {
  const { metadata = {}, content: markdown = "" } = parseMarkdownWithYaml(content) || {}
  const { title, subtitle, period } = headerOf(metadata)

  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col">
        {period && <small className={`${datePillClass} mb-4 self-start`}>{period}</small>}
        {title && (
          <h2 className="mb-2 text-[20px]/normal font-medium text-fg-strong sm:text-[24px]/normal">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-sm/normal font-normal text-fg-strong sm:text-[16px]/normal">
            {subtitle}
          </p>
        )}
      </header>

      <div
        className="prose prose-sm max-w-none font-normal text-fg-strong prose-headings:font-medium prose-headings:text-fg-strong prose-p:text-fg-strong prose-a:text-inherit prose-a:underline hover:prose-a:text-blue-500 prose-strong:text-fg-strong prose-li:text-fg-strong sm:prose-base dark:prose-invert"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          // rehypeSanitize 를 먼저 태워 원본을 걸러낸 뒤 하이라이트한다
          rehypePlugins={[rehypeSanitize, rehypeHighlight]}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </article>
  )
}
