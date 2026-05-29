export function SnapSection({ id, title, filter, children }) {
  return (
    <section id={id} className="snap-start h-dvh flex flex-col">
      <div className="mx-auto flex h-full w-full max-w-4xl flex-col gap-8 px-4 pt-24 pb-6">
        <div className="flex shrink-0 items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          {filter}
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-6">
          {children}
        </div>
      </div>
    </section>
  )
}
