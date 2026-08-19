interface ShopHeaderProps {
  title: string
  intro?: string
  count: number
}

export function ShopHeader({ title, intro, count }: ShopHeaderProps) {
  return (
    <div className="mb-8 sm:mb-10 md:mb-12">
      <p className="label mb-3 text-navy/40">{count} {count === 1 ? 'product' : 'products'}</p>
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-navy md:text-5xl">
        {title}
      </h1>
      {intro && (
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-navy/50">
          {intro}
        </p>
      )}
      <div className="mt-5 h-px w-16 bg-gold/40" />
    </div>
  )
}
