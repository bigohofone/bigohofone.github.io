import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import rehypeSanitize from "rehype-sanitize"
import { parseMarkdownWithYaml } from "@/utils/markdown"

import "highlight.js/styles/github.css"

export function MarkdownRenderer({ content }) {
  const { metadata = {}, content: markdown = "" } = parseMarkdownWithYaml(content) || {}

  return (
    <div className="space-y-8">
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          // 2. 순서 변경: rehypeSanitize를 rehypeHighlight보다 앞에 배치
          rehypePlugins={[rehypeSanitize, rehypeHighlight]}
        >
          {markdown}
        </ReactMarkdown>
      </div>

      {/* Metadata */}
      {Object.keys(metadata).length > 0 && (
        <dl className="mt-12 space-y-2">
          {Object.entries(metadata).map(([key, value]) => (
            <div
              key={key}
              className="flex gap-4 border-b border-border pb-2 first:border-t first:border-border first:pt-2"
            >
              <dt className="w-32 shrink-0 capitalize">{key}</dt>
              <dd>{String(value)}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}