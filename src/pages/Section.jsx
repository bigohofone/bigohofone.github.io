import { Fragment } from "react"
import { Link } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import rehypeSanitize from "rehype-sanitize"
import remarkGfm from "remark-gfm"

export default function Section({ section }) {
  return (
    <>
      <Link to="/">Home</Link>

      <section id={section.path}>
        <h2 className="mb-12 text-center font-sans text-sm font-normal">{section.title}</h2>
        {/* 목록이 여러 개인 섹션(예: Background 의 경력·학력)은 groups 로, 하나면 entries 로 온다 */}
        {(section.groups ?? [{ entries: section.entries }]).map((group) => (
          <Fragment key={group.title ?? section.path}>
            {group.title && <h3 className="mb-12 text-center font-sans text-sm font-normal">{group.title}</h3>}
            <ul>
              {group.entries.map((entry) => (
                <li key={entry.id}>
                  <h3 className="m-0 text-base">
                    {entry.link ? (
                      <a href={entry.link} target="_blank" rel="noopener noreferrer">
                        {entry.title}
                      </a>
                    ) : (
                      entry.title
                    )}
                  </h3>
                  {entry.image && <img src={entry.image} alt="" />}
                  {entry.lines.map((line) => (
                    <p key={line} className="m-0 text-sm">
                      {line}
                    </p>
                  ))}
                  {entry.body && (
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                      {entry.body}
                    </ReactMarkdown>
                  )}
                </li>
              ))}
            </ul>
          </Fragment>
        ))}

        {section.footnotes?.map((footnote) => (
          <p key={footnote}>{footnote}</p>
        ))}
      </section>
    </>
  )
}
