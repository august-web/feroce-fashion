import { Link } from 'react-router-dom'
import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from 'react'

type Variant = 'dark' | 'light' | 'outline' | 'text'
const styles: Record<Variant, string> = {
  dark: 'bg-ink text-white border-ink hover:bg-oxblood hover:border-oxblood',
  light: 'bg-white text-ink border-white hover:bg-bone hover:border-bone',
  outline: 'bg-transparent text-current border-current hover:bg-ink hover:text-white hover:border-ink',
  text: 'border-transparent px-0 underline underline-offset-8 decoration-1 hover:opacity-60',
}
const base = 'inline-flex min-h-11 items-center justify-center rounded-full border px-7 py-3 font-display text-[11px] font-semibold uppercase tracking-[.18em] transition duration-300 disabled:cursor-not-allowed disabled:opacity-40'

export function Button({ children, variant = 'dark', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; variant?: Variant }) {
  return <button className={`${base} ${styles[variant]} ${className}`} {...props}>{children}</button>
}
export function ButtonLink({ children, to, variant = 'dark', className = '', onClick }: { children: ReactNode; to: string; variant?: Variant; className?: string; onClick?: MouseEventHandler<HTMLAnchorElement> }) {
  return <Link onClick={onClick} className={`${base} ${styles[variant]} ${className}`} to={to}>{children}</Link>
}
