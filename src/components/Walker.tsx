import { forwardRef } from 'react'

// Line-drawn figure and dog. Gallery sets its position and --step (stride angle) on scroll.
export const Walker = forwardRef<HTMLDivElement, { dark: boolean }>(function Walker({ dark }, ref) {
  return (
    <div ref={ref} className={dark ? 'walker dark' : 'walker'} aria-hidden="true">
      <svg viewBox="0 0 160 92" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="30" cy="12" r="8" />
        <path d="M30 20V52" />
        <path className="leg-a" d="M30 52L30 88" />
        <path className="leg-b" d="M30 52L30 88" />
        <path className="arm" d="M30 28L30 46" />
        <path d="M30 28L46 40L126 50" strokeWidth="1.5" />
        <path className="tail" d="M100 58L92 46" />
        <path d="M100 58H130" />
        <circle cx="138" cy="52" r="7" />
        <path d="M134 46L132 40" />
        <path className="paw-a" d="M104 58V80" />
        <path className="paw-b" d="M104 58V80" />
        <path className="paw-c" d="M126 58V80" />
        <path className="paw-d" d="M126 58V80" />
      </svg>
    </div>
  )
})
