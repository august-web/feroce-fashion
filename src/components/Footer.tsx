import { Link } from 'react-router-dom'
import { detail, handoff } from '../data/site'

const groups = [
  { title: 'Client services', links: [['Contact','/contact'],['Shipping & returns','/shipping-returns'],['Care guide','/care-guide']] },
  { title: 'The house', links: [['Our story','/about'],['Collections','/collections'],['Journal','/journal'],['Admin portal','/admin']] },
  { title: 'Legal', links: [['Privacy','/privacy'],['Terms','/terms'],['Accessibility','/accessibility'],['Cookies','/cookies']] },
]
export function Footer() {
  return <footer className="border-t border-black/[.07] bg-paper px-5 pb-8 pt-16 text-ink sm:px-8 md:pt-24">
    <div className="mx-auto max-w-7xl"><div className="grid gap-12 border-b border-black/10 pb-16 md:grid-cols-[1.5fr_2fr]">
      <div><Link to="/" className="font-display text-3xl font-semibold tracking-[.1em]">FÉROCE</Link><p className="mt-4 text-[9px] uppercase tracking-[.28em] text-black/45">The new designer bags · Women + Men</p><p className="mt-10 max-w-xs text-sm leading-6 text-black/55">Féroce — the new designer bags for women and men. Designed in-house, made to be worn every day and made to be seen.</p></div>
      <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">{groups.map(g => <div key={g.title}><h3 className="text-[9px] font-semibold uppercase tracking-luxury text-black/45">{g.title}</h3><ul className="mt-5 space-y-3">{g.links.map(([label,path]) => <li key={label}><Link className="text-xs text-black/70 transition hover:text-oxblood" to={path}>{label}</Link></li>)}</ul></div>)}</div>
    </div><div className="flex flex-col gap-4 pt-7 text-[9px] uppercase tracking-[.16em] text-black/40 sm:flex-row sm:justify-between"><span>© 2026 FÉROCE · {detail(handoff.legalLine)}</span><span>Ghana / GHS</span></div></div>
  </footer>
}
