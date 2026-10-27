import type { ReactNode } from 'react'

// Abstract placeholder art. Every seed gives the same composition, so each piece keeps its look.
const PALETTE = ['#1f3fbf', '#141414', '#e9e7e0', '#d9a521', '#7f9488', '#8a8d92', '#c8ccd2']

function rng(seed: string) {
  let h = 2166136261
  for (const c of seed) {
    h ^= c.charCodeAt(0)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h += 0x6d2b79f5
    let t = Math.imul(h ^ (h >>> 15), 1 | h)
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function Art({ seed, ratio = 0.8 }: { seed: string; ratio?: number }) {
  const r = rng(seed)
  const pick = () => PALETTE[Math.floor(r() * PALETTE.length)]
  const W = 400
  const H = Math.round(W / ratio)
  const bg = r() < 0.5 ? '#e9e7e0' : pick()
  const kind = Math.floor(r() * 3)
  let shapes: ReactNode

  if (kind === 0) {
    // colour fields
    const a = pick()
    const b = pick()
    const split = 0.38 + r() * 0.2
    shapes = (
      <>
        <rect x={W * 0.1} y={H * 0.1} width={W * 0.8} height={H * split} fill={a} />
        <rect x={W * 0.1} y={H * (0.14 + split)} width={W * 0.8} height={H * (0.72 - split)} fill={b} />
      </>
    )
  } else if (kind === 1) {
    // circle, arc and a bar
    shapes = (
      <>
        <circle cx={W * (0.3 + r() * 0.4)} cy={H * (0.3 + r() * 0.2)} r={W * (0.18 + r() * 0.1)} fill={pick()} />
        <path d={`M ${W * 0.1} ${H * 0.85} A ${W * 0.4} ${W * 0.4} 0 0 1 ${W * 0.9} ${H * 0.85} Z`} fill={pick()} />
        <rect x={W * 0.1} y={H * 0.9} width={W * 0.8} height={H * 0.02} fill="#141414" />
      </>
    )
  } else {
    // diagonal bands
    shapes = (
      <>
        <polygon points={`0,${H * 0.7} ${W},${H * 0.3} ${W},${H * 0.55} 0,${H * 0.95}`} fill={pick()} />
        <polygon points={`0,${H * 0.2} ${W * 0.6},0 ${W},0 ${W},${H * 0.1} 0,${H * 0.4}`} fill={pick()} />
        <circle cx={W * 0.78} cy={H * 0.72} r={W * 0.07} fill="#f7f7f5" />
      </>
    )
  }

  return (
    <svg className="art" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width={W} height={H} fill={bg} />
      {shapes}
    </svg>
  )
}

export type FrameVariant = 'black' | 'steel' | 'canvas'

export function Frame({ children, onClick, label, variant = 'black' }: { children: ReactNode; onClick?: () => void; label?: string; variant?: FrameVariant }) {
  const body = <div className="mat">{children}</div>
  return (
    <figure className={`frame-art v-${variant}`}>
      {onClick ? (
        <button className="frame-btn" onClick={onClick} aria-label={label}>
          {body}
        </button>
      ) : (
        body
      )}
    </figure>
  )
}
