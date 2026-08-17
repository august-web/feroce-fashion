import { Minus, Plus } from 'lucide-react'
import { useState, type ReactNode } from 'react'

export function Accordion({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open,setOpen]=useState(defaultOpen)
  return <div className="border-t border-black/15"><button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between py-5 text-left text-[10px] font-medium uppercase tracking-[.18em]" aria-expanded={open}>{title}{open?<Minus size={15}/>:<Plus size={15}/>}</button>{open&&<div className="pb-6 text-sm leading-6 text-black/60 animate-fade-up">{children}</div>}</div>
}
