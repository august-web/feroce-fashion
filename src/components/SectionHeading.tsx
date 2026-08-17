import type { ReactNode } from 'react'

export function SectionHeading({ eyebrow, children, align = 'left', aside }: { eyebrow: string; children: ReactNode; align?: 'left'|'center'; aside?: ReactNode }) {
  return <div className={`mb-10 flex flex-col gap-5 md:mb-14 ${align === 'center' ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'}`}>
    <div><p className="text-[9px] uppercase tracking-luxury text-black/50">{eyebrow}</p><h2 className="mt-4 font-display text-4xl leading-none sm:text-5xl md:text-6xl">{children}</h2></div>{aside && <div>{aside}</div>}
  </div>
}
