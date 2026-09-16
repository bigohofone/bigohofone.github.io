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
        <div className="space-y-2 mt-12">
          {Object.entries(metadata).map(([key, value]) => (
            <div
              key={key}
              className="flex gap-4 border-b border-gray-100 pb-2 first:pt-2 first:border-t first:border-gray-100"
            >
              <span className="w-32 shrink-0 text-xs font-medium text-gray-500 capitalize">{key}</span>
              <span className="text-xs font-medium text-gray-700">{String(value)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}