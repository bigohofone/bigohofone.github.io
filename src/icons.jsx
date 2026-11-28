// 48×48 격자에 그리고 가운데 40×40(4~44)만 보여 20px 상자를 꽉 채운다. 가장자리 선이 반쯤 잘리지 않게 overflow 는 보인다
const Icon = ({ children, className = "", ...props }) => (
  <svg
    className={`size-5 ${className}`}
    viewBox="4 4 40 40"
    overflow="visible"
    fill="none"
    stroke="currentColor"
    strokeLinecap="square"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    {children}
  </svg>
)

// 선 끝이 테두리 밖으로 삐져나오지 않게 butt 로 끝내는 선들이 있다
export const Mail = (props) => (
  <Icon {...props}>
    <rect x="4" y="6" width="40" height="36" rx="4" />
    <path d="M5.18 7.18 24 24l18.82-16.82" strokeLinecap="butt" />
  </Icon>
)

export const Cv = (props) => (
  <Icon {...props}>
    <path d="M34 4H10a4 4 0 0 0-4 4v32a4 4 0 0 0 4 4h28a4 4 0 0 0 4-4V12z" />
    <path d="M34 4v8h8M12 44a12 12 0 0 1 24 0" strokeLinecap="butt" />
    <circle cx="24" cy="21" r="7" />
  </Icon>
)

export const GitHub = (props) => (
  <Icon {...props}>
    <path
      transform="matrix(2.2222 0 0 2.2189 -3.7778 1.8405)"
      strokeLinecap="butt"
      d="M16 19v-.87A3.37 3.37 0 0 0 15.06 15.52C18.2 15.17 21.5 13.98 21.5 8.52A5.44 5.44 0 0 0 20 4.77A5.07 5.07 0 0 0 19.91 1C19.91 1 18.73 .65 16 2.48A13.38 13.38 0 0 0 9 2.48C6.27 .65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77A5.44 5.44 0 0 0 3.5 8.52C3.5 13.98 6.8 15.17 9.94 15.52A3.37 3.37 0 0 0 9 18.13V19"
    />
  </Icon>
)

// 원 안으로 들어간 마름모만 가려 마름모 선이 원 테두리에 닿아 이어진다
export const GoogleScholar = (props) => (
  <Icon {...props}>
    <mask id="scholar-mask">
      <rect width="48" height="48" fill="white" />
      <circle cx="24" cy="31" r="13" fill="black" />
    </mask>
    <polygon points="24 4 44 18 24 32 4 18" mask="url(#scholar-mask)" />
    <circle cx="24" cy="31" r="13" />
  </Icon>
)

export const LinkedIn = (props) => (
  <Icon {...props}>
    <path d="M32 16a12 12 0 0 1 12 12v16h-8v-16a4 4 0 0 0-4-4 4 4 0 0 0-4 4v16h-8v-16a12 12 0 0 1 12-12zM4 18h8v26H4z" />
    <circle cx="8" cy="8" r="4" />
  </Icon>
)

export const X = (props) => (
  <Icon {...props}>
    <path d="M6 6l26.4 36H42L15.6 6z" />
    <path d="m6 42 15.228-15.228m5.536-5.536L42 6" strokeLinecap="butt" />
  </Icon>
)

export const Sun = (props) => (
  <Icon {...props}>
    <circle cx="24" cy="24" r="7" />
    <path
      d="M38 24L42.2 24M33.9 33.9L36.87 36.87M24 38L24 42.2M14.1 33.9L11.13 36.87M10 24L5.8 24M14.1 14.1L11.13 11.13M24 10L24 5.8M33.9 14.1L36.87 11.13"
      strokeLinecap="round"
    />
  </Icon>
)

export const Moon = (props) => (
  <Icon {...props}>
    <path d="M44 25.76A20 20 0 1 1 22.24 4 15.56 15.56 0 0 0 44 25.76z" />
  </Icon>
)
