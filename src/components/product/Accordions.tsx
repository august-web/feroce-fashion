'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

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
    <div className="space-y-2.5 pt-2">
      {items.map((item, i) => {
        const isOpen = openIdx === i
        return (
          <div
            key={i}
            className="rounded-[20px] bg-[#F6F6F8] border border-gray-100 overflow-hidden transition-all duration-200"
          >
            <button
              onClick={() => setOpenIdx(isOpen ? null : i)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <span className="text-xs sm:text-sm font-bold text-navy tracking-tight">{item.title}</span>
              <ChevronDown
                className={`w-4 h-4 text-navy/50 transition-transform duration-300 ${
                  isOpen ? 'rotate-180 text-navy' : ''
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 px-5 ${
                isOpen ? 'max-h-60 pb-4 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="text-xs leading-relaxed text-navy/70 font-normal">{item.content}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
