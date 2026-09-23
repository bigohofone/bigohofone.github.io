import { useId } from "react"

// react-icons / lucide 와 같은 규칙(24 그리드, currentColor, round cap)으로 그린 아이콘들

function IconBase({ size = 24, strokeWidth = 2, className = "", children, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {children}
    </svg>
  )
}

// 위쪽 마름모(모자)와 아래쪽 원(책)이 만나는 자리를 마스크로 비워 둔다
export function GoogleScholarIcon({ strokeWidth = 2, ...props }) {
  const maskId = useId()

  return (
    <IconBase strokeWidth={strokeWidth} {...props}>
      <defs>
        <mask id={maskId}>
          <rect x="0" y="0" width="24" height="24" fill="white" />
          <circle
            cx="12"
            cy="16"
            r="6"
            fill="black"
            stroke="black"
            strokeWidth={strokeWidth * 2}
          />
        </mask>
      </defs>
      <polygon points="12 2 22 8 12 16 2 8" mask={`url(#${maskId})`} />
      <circle cx="12" cy="16" r="6" />
    </IconBase>
  )
}

export function MailIcon(props) {
  return (
    <IconBase {...props}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 5L2 7" />
    </IconBase>
  )
}
