'use client'

import { useState } from 'react'

interface AccordionItem {
  title: string
  content: string
}

interface AccordionsProps {
  items: AccordionItem[]
}

export function Accordions({ items }: AccordionsProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <div className="border-t border-line">
      {items.map((item, i) => (
        <div key={i} className="border-b border-line">
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="flex w-full items-center justify-between py-4 text-left min-h-[48px]"
          >
            <span className="font-serif text-sm font-medium text-navy">{item.title}</span>
            <span className={`text-lg text-navy/40 transition-transform duration-300 ${
              openIdx === i ? 'rotate-45' : ''
            }`}>
              +
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-400 ${
              openIdx === i ? 'max-h-40 pb-4 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="text-xs leading-relaxed text-navy/60">{item.content}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
