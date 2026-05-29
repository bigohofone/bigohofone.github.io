export function Section({ title, description, children }) {
  return (
    <div className="flex flex-col gap-8">
      <header className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </header>
      <div>{children}</div>
    </div>
  )
}
