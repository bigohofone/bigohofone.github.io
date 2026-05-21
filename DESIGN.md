---
version: 1.0
name: wonjunoh-cv-design
description: "Minimal academic CV site for wonjunoh.com. Built on shadcn/ui primitives with a neutral palette, Inter Variable, scroll-snap sections, and subtle framer-motion. Light and dark modes share the same shadcn semantic token contract; dark mode uses a pure black canvas with slightly lifted card surfaces."

theme:
  baseColor: neutral (shadcn)
  font: Inter Variable / Inter (rsms.me/inter)
  radius: 0.625rem (Tailwind v4 --radius)
  modes: [light (default), dark]

colors:
  light:
    background: "oklch(1 0 0)"
    foreground: "oklch(0.145 0 0)"
    card: "oklch(1 0 0)"
    muted: "oklch(0.97 0 0)"
    muted-foreground: "oklch(0.556 0 0)"
    border: "oklch(0.922 0 0)"
    primary: "oklch(0.205 0 0)"
    primary-foreground: "oklch(0.985 0 0)"
    accent: "oklch(0.97 0 0)"
    ring: "oklch(0.708 0 0)"
  dark:
    background: "oklch(0 0 0)"
    foreground: "oklch(0.985 0 0)"
    card: "oklch(0.15 0 0)"
    popover: "oklch(0.15 0 0)"
    muted: "oklch(0.269 0 0)"
    muted-foreground: "oklch(0.708 0 0)"
    border: "rgba(255,255,255,0.1)"
    input: "rgba(255,255,255,0.15)"
    primary: "oklch(0.985 0 0)"
    primary-foreground: "oklch(0.205 0 0)"
    ring: "oklch(0.556 0 0)"
  accents:
    highlight-bg: "amber-200 (#fde68a)"
    highlight-fg: "yellow-700 (#a16207)"

typography:
  body: Inter Variable / Inter
  scale: Tailwind defaults (text-xs … text-7xl)
  weights: font-medium (500) for headings, default for body
  hierarchy:
    - hero-name: text-2xl md:text-4xl font-medium tracking-tight
    - section-title: text-2xl md:text-4xl font-medium tracking-[-0.03em]
    - sub-header: text-sm text-muted-foreground
    - row-title: text-base font-medium
    - meta / date: text-sm text-muted-foreground
    - caption / labels: text-xs

spacing:
  base: 4px (Tailwind defaults; no custom 5px grid)
  section-gap: gap-12 inside Section (header → content)
  sub-group-gap: gap-16 between Experience/Education or Talks/Extracurricular
  inter-row: h-16 list rows, divide-y separators
  card-padding: py-5 px-5 (shadcn Card overridden)

radius:
  cards: rounded-md (default)
  badges: rounded-md (overridden from rounded-full default)
  avatars: rounded-xl (Hero photo) / not full circle
  pill-buttons: rounded-full (Contact CTA)
  popovers / dialogs: rounded-lg (shadcn default)

components:
  - shadcn/ui Card (border + bg-card, no shadow)
  - shadcn/ui Button (default / outline / ghost variants; pill via rounded-full + h-10)
  - shadcn/ui Badge (outline + rounded-md)
  - shadcn/ui Dialog (sm:max-w-2xl modal popups for row details)
  - shadcn/ui Pagination (visible even on a single page)
  - shadcn/ui Select (border-0 bg-transparent ghost trigger; popper-aligned content)
  - shadcn/ui Switch (unused in this version; removed from Awards toolbar)
  - shadcn/ui Separator
  - shadcn/ui Collapsible (mobile "Show all" expander inside PaginatedGrid)
  - Custom: SectionIndex (fixed left dot+label nav at 2xl+, scrollspy via IntersectionObserver)
  - Custom: ThemeToggle (Sun/Moon, localStorage-persisted)

motion:
  library: framer-motion
  entrance: { opacity: 0 → 1, y: 12–18 → 0, easeOutExpo [0.16, 1, 0.3, 1] }
  list-stagger: AnimatePresence + layout + mode="popLayout"
  scroll-snap: html { scroll-snap-type: y mandatory; scroll-behavior: smooth; }

layout:
  container: max-w-6xl mx-auto (max-w-2xl for Hero)
  snap-section: min-h-screen snap-start flex-col px-4 pt-24 pb-10 md:px-8
  hero-snap-section: snap-section + md:justify-center + md:!pt-0 md:!pb-0
  responsive: mobile-first; lg+ for sticky SectionIndex (actually 2xl)

sections:
  intro:
    layout: avatar (md:order-2 right) + name/role (md:order-1 left, items-center group)
    elements: profile photo (size-36 rounded-xl), name, role · org, bio (2 paragraphs), Contact pill, Download CV ghost
  background:
    children:
      - sub-header "Experience" + ExperienceList (rows: logo box, organization main, role md+, date, status cdot)
      - sub-header "Education" + EducationList (same row pattern with major)
  publications:
    grid: md:grid-cols-2 md:auto-rows-fr
    card: bg-muted/dark:bg-[oklch(0.15)] border rounded-md
    badges: venue (default) + tags (outline) with rounded-md
    title/authors: line-clamp-3 / line-clamp-2 with reserved min-height
    links row: paper / GitHub underlined text-primary
    year filter: ghost Select + count
  awards:
    layout: list (divide-y border-y, h-16 rows)
    row: title main · organization (md+) · date
    pagination: shadcn Pagination always rendered (≥1 page)
    year filter at top
    dialog: type Badge + title + organization + date + description
  activities:
    children: sub-header "Talks" + TalkList, sub-header "Extracurricular" + ExtracurricularList
  contact (footer):
    location: footer (outside main, snap-start)
    layout: section header + Card containing contact rows (h-16 px-4)
    bottom: copyright + last-updated

interaction:
  list-row hover: bg-accent/30
  card hover (Pubs): dark:hover:bg-[oklch(0.2)] (subtle lift via color)
  link hover: hover:text-primary or hover:text-foreground
  buttons: no shadow; pill primary or ghost variants
  focus: ring-ring with sky-tinted offset

icons:
  library: lucide-react
  weights: strokeWidth={1.5} for decorative; default for inline
  examples: ArrowRight (CTA), ArrowUpRight (links), Download (CV), ChevronDown (collapsible)

dos:
  - Use shadcn semantic tokens (bg-card, border, text-muted-foreground) — never raw hex
  - Keep card chrome minimal: border + bg, no shadow
  - Single column lists with divide-y for tabular data
  - Hero centered vertically on desktop, top-aligned on mobile
  - Animation: large y + blur entrance for sections, small y for rows
  - All sections wrap in snap-start so users can scroll-jog through

donts:
  - No box-shadow on cards
  - No B2B-style hero (large display headlines, status badges with ping dots, stats grids)
  - No accent colors outside shadcn semantic tokens, except amber-200/yellow-700 for "highlight" affordance
  - No gradient atmosphere panels or marketing chrome
  - No multi-color brand palette — neutral + foreground accent only
---

## Overview

`wonjunoh.com` is a single-page academic CV for Wonjun Oh, an incoming
M.S./Ph.D. student at KAIST (COCOLab). The site reads top-to-bottom as a
series of full-viewport snap-scrolled sections, each rendering a compact
chrome of shadcn/ui primitives: rounded cards, dense list rows, a clean
left-side dot nav at very wide viewports, and pill-shaped CTAs.

There is no decorative imagery beyond a single profile photo in the
intro; the rest of the page is type, dividers, and badge chips. Color
work is intentionally muted — the entire surface is neutral grayscale,
with `amber-200`/`yellow-700` used sparingly to mark a small set of
"highlight" awards.

## Modes

The site initializes from `localStorage.theme` and falls back to
`prefers-color-scheme`. A `Sun`/`Moon` toggle in the top nav writes back
to `localStorage`. shadcn semantic tokens are the contract: every
component reads `bg-background`, `bg-card`, `text-foreground`,
`text-muted-foreground`, `border`, `ring` — never hex.

**Dark mode** uses `oklch(0)` as the page background (true black) and
`oklch(0.15)` for cards/popovers; a small group of feature cards
(Publication tiles, Footer contact list) opt into the same `oklch(0.15)`
explicitly via `dark:bg-[oklch(0.15)]` so they don't drift if the card
token shifts.

**Light mode** uses pure white background with `oklch(0.97)` for muted
surfaces. Cards inherit `bg-card` (white) with the default border.

## Typography

Inter Variable is loaded from `rsms.me/inter/inter.css` and substituted
into `body` via `font-family: "Inter var", system-ui, sans-serif` inside
a `@supports (font-variation-settings: normal)` guard. The OpenType
character-variant block from the earlier Framer-inspired iteration was
dropped — the current voice is plain Inter at default features.

Font-size hierarchy uses Tailwind's defaults — no custom scale. Headings
land at `text-2xl` (mobile) / `text-4xl` (desktop) with `font-medium`
weight and a tightened `-0.03em` letter-spacing. The hero name shares
that exact pair so its visual weight equals a section title — the
homepage avoids a marketing-scale display headline by design.

## Layout

A single `max-w-6xl` container holds the whole page. Each section is a
`min-h-screen snap-start` block; the Hero adds `md:justify-center` and
overrides `pt`/`pb` to land the avatar precisely in the desktop
viewport center (mobile keeps the standard top padding so the nav
doesn't cover the photo).

Section content is wrapped in a small `Section` component that supplies
a `font-medium tracking-[-0.03em]` h2, an optional one-line description,
and a `gap-12` between header and children. The Background section nests
two sub-blocks (Experience, Education) inside that wrapper with a
`gap-16` between them; Activities mirrors the same pattern for Talks /
Extracurricular.

## Components & Patterns

- **PaginatedGrid** (used by older drafts; currently only Publications
  uses a static grid) — measures the first card and viewport to derive
  page size automatically. AwardList now ships its own pagination
  because it doesn't need the responsive grid logic.
- **List rows** (`ExperienceList`, `EducationList`, `AwardList`,
  `TalkList`, `ExtracurricularList`, footer `ContactList`) — `divide-y
  border-y` with a fixed `h-16` row, `px-1` to `px-4` interior padding,
  `hover:bg-accent/30` interaction.
- **Cards** — shadcn `Card` with the base shadow stripped; everything
  is `border + bg-card`. Publication cards intentionally use a darker
  muted background to read as a "feature" surface in dark mode.
- **Dialogs** — every row that ships a `description` opens a
  `sm:max-w-2xl` modal with `DialogHeader` (badge/logo + title + role)
  and a body paragraph.
- **SectionIndex** — fixed left rail at `2xl+` (≥1536px). At narrower
  widths the rail is hidden so it never overlaps the `max-w-6xl` main
  column. Active section is computed with an `IntersectionObserver`
  watching every section `id`.
- **Motion** — every list uses `AnimatePresence mode="popLayout"` so
  filtering / pagination reorders smoothly; entrance variants use the
  same `easeOutExpo` curve (`[0.16, 1, 0.3, 1]`) across the site.

## Do's

- Reach for shadcn primitives first. The toolbox is intentionally
  narrow: Card, Button, Dialog, Badge, Pagination, Select, Separator,
  Collapsible.
- Keep card chrome to a single border. No shadows.
- Use `text-muted-foreground` for meta and `text-foreground` for
  emphasis — there are only two text colors by design.
- Treat `amber-200 / yellow-700` as a single "highlight" affordance.
  Use it on selected items, not as a brand color.
- Wrap heavy content in `divide-y` lists rather than grids of cards
  when the data is tabular.

## Don'ts

- No B2B-marketing-style hero. The site is a personal CV — no large
  display headlines, ping dots, stat grids, or gradient atmosphere
  panels.
- No accent colors beyond the shadcn semantic palette + the highlight
  amber.
- No box-shadows on cards or buttons.
- Do not introduce custom spacing/radius tokens; the site standardized
  on Tailwind defaults.
- Do not embed brand iconography in the nav — the wordmark + theme
  toggle is intentionally minimal.
