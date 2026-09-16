import { FiMail, FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi"
import { Button } from "@/components/ui/button"
import { contact } from "@/data/contact"


import * as React from "react"

export const GoogleScholarIcon = React.forwardRef(
  (
    {
      size = 24,
      strokeWidth = 2,
      stroke = "currentColor",
      fill = "none",
      className = "",
      ...props
    },
    ref
  ) => {
    // 겹치는 부위를 잘라낼 고유 Mask ID 생성
    const maskId = React.useId()

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        <defs>
          {/* 마름모의 테두리 영역만큼 하단 원을 비워두는(잘라내는) 마스크 */}
          <mask id={maskId}>
            {/* 기본적으로 전체를 보이게 함 */}
            <rect x="0" y="0" width="24" height="24" fill="white" />
            {/* 마름모가 지나는 자리를 검은색 두꺼운 선으로 덮어 마스킹(잘라냄) 처리 */}
            <circle cx="12" cy="16" r="6"
              fill="black"stroke="black"
              strokeWidth={strokeWidth*2} // 갈라지는 갭(Gap) 두께 조절
            />
          </mask>
        </defs>

        {/* 1. 상단 마름모 (점 4개) */}
        <polygon points="12 2 22 8 12 16 2 8" mask={`url(#${maskId})`} />

        {/* 2. 하단 원 (마스크가 적용되어 마름모와 만나는 위쪽이 뚫려있음) */}
        <circle cx="12" cy="16" r="6" />
      </svg>
    )
  }
)

GoogleScholarIcon.displayName = "GoogleScholarIcon"

export const MailIcon = React.forwardRef(
  (
    {
      size = 24,
      strokeWidth = 2,
      stroke = "currentColor",
      fill = "none",
      className = "",
      ...props
    },
    ref
  ) => {
    // 겹치는 부위를 잘라낼 고유 Mask ID 생성
    const maskId = React.useId()

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        <defs>
          {/* V자 플랩이 지나는 자리를 검은색 선으로 덮어 봉투 몸통을 갈라놓는 마스크 */}
          <mask id={maskId}>
            <rect x="0" y="0" width="24" height="24" fill="white" />
            <polyline
              points="0 3 12 12 24 3"
              fill="none"
              stroke="black"
              strokeWidth={strokeWidth} // 갈라지는 여백(Gap) 두께
            />
          </mask>
        </defs>

        {/* 1. 편지봉투 외곽 사각형 (마스킹으로 V자 라인과 격리됨) */}
        <rect x="2" y="4" width="20" height="16" rx="2" mask={`url(#${maskId})`} />
      </svg>
    )
  }
)

MailIcon.displayName = "MailIcon"


const ICON_MAP = {
  Email: MailIcon,
  GitHub: FiGithub,
  "Google Scholar": GoogleScholarIcon,
  "X (Twitter)": FiTwitter,
  LinkedIn: FiLinkedin,
}

export function Contact() {
  const emailItem = contact.items.find((item) => item.label === "Email")

  const handleCopyEmail = async () => {
    if (!emailItem?.value) return
    try {
      await navigator.clipboard.writeText(emailItem.value)
      alert(`Copied "${emailItem.value}" to clipboard!`)
    } catch (error) {
      console.error("Failed to copy email:", error)
    }
  }

  const socialItems = contact.items.filter((item) => item.label !== "Email")

  return (
    <>
      {emailItem && (
        <Button
          key="email-copy"
          variant="secondary"
          size="lg"
          className="size-12 p-0 flex items-center justify-center"
          onClick={handleCopyEmail}
          aria-label="Copy Email"
        >
          <MailIcon className="size-5 stroke-1 fill-gray-500" aria-hidden="true" />
        </Button>
      )}

      {socialItems.map((item) => {
        const Icon = ICON_MAP[item.label]
        if (!Icon) return null

        return (
          <Button
            key={item.label}
            variant="secondary"
            size="lg"
            className="size-12 p-0 flex items-center justify-center"
            onClick={() => window.open(item.link, "_blank", "noopener,noreferrer")}
            aria-label={item.label}
          >
            <Icon className="size-5 stroke-1 fill-gray-500" aria-hidden="true" />
          </Button>
        )
      })}
    </>
  )
}