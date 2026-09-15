import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { parseMarkdownWithYaml } from "@/utils/markdown"

export function MarkdownRenderer({ content }) {
  const { metadata, content: markdown } =
    parseMarkdownWithYaml(content)

  return (
    <div className="space-y-8">
      {/* Metadata */}
      <div className="space-y-3">
        {Object.entries(metadata).map(([key, value]) => (
          <div
            key={key}
            className="flex gap-4 border-b border-gray-100 pb-2"
          >
            <span className="w-32 shrink-0 text-sm font-medium text-gray-500">
              {key}
            </span>

            <span className="text-sm text-gray-800">
              {Array.isArray(value)
                ? value.join(", ")
                : String(value)}
            </span>
          </div>
        ))}
      </div>

      {/* Markdown */}
      <div className="prose max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  )
}
