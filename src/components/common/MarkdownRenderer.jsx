import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { colors } from "@toss/tds-colors"

export function MarkdownRenderer({ children, className = "" }) {
  if (!children) return null

  return (
    <div className={`w-full text-[15px] leading-[22.5px] ${className}`} style={{ color: colors.grey700 }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1
              className="text-xl font-bold mt-4 mb-2 tracking-tight"
              style={{ color: colors.grey900 }}
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="text-lg font-bold mt-3 mb-2 tracking-tight"
              style={{ color: colors.grey800 }}
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="text-[16px] font-semibold mt-2.5 mb-1.5"
              style={{ color: colors.grey800 }}
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <p className="my-2 leading-[22.5px] text-[15px]" style={{ color: colors.grey600 }} {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="my-2 ml-5 list-disc space-y-1 text-[15px]" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="my-2 ml-5 list-decimal space-y-1 text-[15px]" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="leading-[22.5px]" style={{ color: colors.grey600 }} {...props} />
          ),
          a: ({ node, ...props }) => (
            <a
              className="font-medium underline transition-opacity hover:opacity-80"
              style={{ color: colors.blue500 }}
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="my-3 border-l-4 pl-3.5 italic"
              style={{ borderColor: colors.grey300, color: colors.grey500 }}
              {...props}
            />
          ),
          code: ({ node, className, children, ...props }) => {
            // In react-markdown v10, `inline` prop was removed.
            // Inline code has no parent <pre>; block code is inside <pre>.
            const isBlock = node?.position?.start?.line !== node?.position?.end?.line || className?.startsWith("language-")
            if (isBlock) {
              return (
                <pre
                  className="my-3 overflow-x-auto rounded-[8px] p-3 font-mono text-[13px]"
                  style={{ backgroundColor: colors.grey100, color: colors.grey800 }}
                >
                  <code className={className} {...props}>{children}</code>
                </pre>
              )
            }
            return (
              <code
                className="rounded px-1.5 py-0.5 font-mono text-[13px]"
                style={{ backgroundColor: colors.grey100, color: colors.grey800 }}
                {...props}
              >
                {children}
              </code>
            )
          },

          hr: ({ node, ...props }) => (
            <hr className="my-4 border-t" style={{ borderColor: colors.grey200 }} {...props} />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
