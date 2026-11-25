// 48×48 격자에 그리고 가운데 40×40(4~44)만 보여 상자를 꽉 채운다. 가장자리 선이 반쯤 잘리지 않게 overflow 는 보인다
const Icon = ({ children, ...props }) => (
  <svg
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

const book = (letter) => (props) => (
  <Icon {...props}>
    <rect x="6" y="4" width="36" height="40" rx="4" />
    <path d="M14 4v40" />
    <path d={letter} strokeLinecap="round" />
  </Icon>
)
export const Conference = book("M32.5 17.88A7 8 0 1 0 32.5 30.12")
export const Journal = book("M33 16v11a5 5 0 0 1-10 0")
export const Preprint = book("M23 32V16h6a4.5 4.5 0 0 1 0 9h-6")
export const TechReport = book("M22.5 16h11M28 16v16")

export const Certificate = (props) => (
  <Icon {...props}>
    <path d="M26 42H8a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4h32a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4h-4" />
    <path d="M12 15h24M12 24h8M12 33h8" strokeLinecap="round" />
    <circle cx="31" cy="28.5" r="6" />
    <path d="M27 32.98V44l4-3 4 3v-11.02A6 6 0 0 1 27 32.98z" fill="currentColor" />
  </Icon>
)

export const Medal = (props) => (
  <Icon {...props}>
    <path d="M11.54 18.62L9.2 16.28C4.8 11.88 3.8 4 12 4H36C44.2 4 43.2 11.88 38.8 16.28L36.46 18.62" />
    <path d="M20 12.92 17.6 10.52Q16 8.92 16.6 7.2M28 12.92l2.4-2.4Q32 8.92 31.4 7.2" strokeLinecap="round" />
    <path d="M24 12.68A7.16 7.16 0 0 1 31.66 14.74A7.16 7.16 0 0 1 37.26 20.34A7.16 7.16 0 0 1 39.32 28A7.16 7.16 0 0 1 37.26 35.66A7.16 7.16 0 0 1 31.66 41.26A7.16 7.16 0 0 1 24 43.32A7.16 7.16 0 0 1 16.34 41.26A7.16 7.16 0 0 1 10.74 35.66A7.16 7.16 0 0 1 8.68 28A7.16 7.16 0 0 1 10.74 20.34A7.16 7.16 0 0 1 16.34 14.74A7.16 7.16 0 0 1 24 12.68z" />
    <circle cx="24" cy="28" r="9" />
  </Icon>
)

export const Trophy = (props) => (
  <Icon {...props}>
    <path d="M12 6h24v10a12 12 0 0 1-24 0z" />
    <path d="M12 10H4v2a10 10 0 0 0 9.2 10M36 10h8v2a10 10 0 0 1-9.2 10M24 28v8" />
    <rect x="14" y="36" width="20" height="8" rx="2" />
  </Icon>
)

export const Stopwatch = (props) => (
  <Icon {...props}>
    <circle cx="24" cy="27" r="17" />
    <path d="M19 4h10M24 4v6M24 27V18" strokeLinecap="round" />
  </Icon>
)

export const Briefcase = (props) => (
  <Icon {...props}>
    <rect x="4" y="14" width="40" height="28" rx="4" />
    <path d="M17 14V9a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v5M4 26h40" />
  </Icon>
)

export const Flask = (props) => (
  <Icon {...props}>
    <path d="M18 4h12M20 4v14L6 40a3 3 0 0 0 2.6 4h30.8a3 3 0 0 0 2.6-4L28 18V4M11 32h26" />
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
