import { memo, useMemo } from 'react'
import { PAINT } from '../layout'

// The canvas on the easel: an impressionist landscape built from a few base shapes
// plus ~1,300 short "brush dabs", so it stays sharp at any zoom level.

type Dab = { x1: number; y1: number; x2: number; y2: number; w: number; c: string }
type Rand = () => number

function mulberry32(seed: number): Rand {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type DabSpec = {
  box: [number, number, number, number] // x, y, w, h
  count: number
  len: [number, number]
  width: [number, number]
  angle: number // degrees
  spread: number // degrees of randomness around angle
  color: (x: number, y: number, r: Rand) => string
}

function makeDabs(r: Rand, s: DabSpec): Dab[] {
  const out: Dab[] = []
  for (let i = 0; i < s.count; i++) {
    const x = s.box[0] + r() * s.box[2]
    const y = s.box[1] + r() * s.box[3]
    const len = s.len[0] + r() * (s.len[1] - s.len[0])
    const ang = ((s.angle + (r() - 0.5) * 2 * s.spread) * Math.PI) / 180
    out.push({
      x1: x - (Math.cos(ang) * len) / 2,
      y1: y - (Math.sin(ang) * len) / 2,
      x2: x + (Math.cos(ang) * len) / 2,
      y2: y + (Math.sin(ang) * len) / 2,
      w: s.width[0] + r() * (s.width[1] - s.width[0]),
      c: s.color(x, y, r),
    })
  }
  return out
}

const jit = (r: Rand, amt: number) => (r() - 0.5) * 2 * amt
const hsl = (h: number, s: number, l: number) => `hsl(${h.toFixed(0)} ${s.toFixed(0)}% ${l.toFixed(0)}%)`

const P = PAINT
const SKY = `M${P.x},${P.y} H${P.x + P.w} V${P.y + 260} H${P.x} Z`
const MOUNTAINS = 'M520,345 L600,292 L680,330 L770,278 L860,336 L960,302 L1080,348 L1080,420 L520,420 Z'
const MEADOW = 'M520,388 C600,348 700,352 820,398 C862,414 884,436 884,540 L520,540 Z'
const LAKE = 'M520,458 C600,444 720,448 806,474 L806,540 L520,540 Z'
const RIGHT_HILL = 'M812,436 C900,388 1000,384 1080,404 L1080,540 L800,540 Z'

const layers = [
  {
    id: 'sky',
    d: SKY,
    fill: 'url(#skyG)',
    dabs: {
      box: [P.x, P.y, P.w, 262] as DabSpec['box'],
      count: 380,
      len: [18, 36] as [number, number],
      width: [6, 11] as [number, number],
      angle: -3,
      spread: 9,
      color: (_x: number, y: number, r: Rand) => {
        // blend blue -> peach -> cream in RGB (going through hue would pass through green)
        const t = Math.min(1, Math.max(0, (y - P.y) / 262))
        const stops = [[118, 160, 200], [240, 198, 160], [250, 228, 184]]
        const [a, b, u] = t < 0.6 ? [stops[0], stops[1], t / 0.6] : [stops[1], stops[2], (t - 0.6) / 0.4]
        const j = jit(r, 16)
        const c = a.map((v, k) => Math.round(Math.min(255, Math.max(0, v + (b[k] - v) * u + j))))
        return `rgb(${c[0]} ${c[1]} ${c[2]})`
      },
    },
  },
  {
    id: 'mountains',
    d: MOUNTAINS,
    fill: '#8f88b8',
    dabs: {
      box: [520, 270, 560, 150] as DabSpec['box'],
      count: 150,
      len: [12, 24] as [number, number],
      width: [5, 9] as [number, number],
      angle: 62,
      spread: 30,
      color: (_x: number, _y: number, r: Rand) => hsl(256 + jit(r, 10), 24 + jit(r, 8), 58 + jit(r, 9)),
    },
  },
  {
    id: 'meadow',
    d: MEADOW,
    fill: '#8fb36a',
    dabs: {
      box: [520, 345, 370, 200] as DabSpec['box'],
      count: 320,
      len: [12, 26] as [number, number],
      width: [5, 9] as [number, number],
      angle: 8,
      spread: 26,
      color: (_x: number, _y: number, r: Rand) => hsl(96 + jit(r, 12), 40 + jit(r, 8), 52 + jit(r, 10)),
    },
  },
  {
    id: 'rhill',
    d: RIGHT_HILL,
    fill: '#628f4b',
    dabs: {
      box: [800, 385, 280, 160] as DabSpec['box'],
      count: 210,
      len: [12, 24] as [number, number],
      width: [5, 9] as [number, number],
      angle: -12,
      spread: 26,
      color: (_x: number, _y: number, r: Rand) => hsl(108 + jit(r, 10), 34 + jit(r, 8), 38 + jit(r, 8)),
    },
  },
  {
    id: 'lake',
    d: LAKE,
    fill: '#5f95ad',
    dabs: {
      box: [520, 444, 290, 100] as DabSpec['box'],
      count: 230,
      len: [16, 32] as [number, number],
      width: [4, 7] as [number, number],
      angle: 0,
      spread: 4,
      color: (_x: number, _y: number, r: Rand) => hsl(196 + jit(r, 8), 40 + jit(r, 8), 52 + jit(r, 12)),
    },
  },
]

function PaintingImpl() {
  const rendered = useMemo(() => {
    const r = mulberry32(7)
    const clouds = [
      ...makeDabs(r, {
        box: [570, 180, 130, 36],
        count: 46,
        len: [14, 26],
        width: [6, 10],
        angle: -2,
        spread: 8,
        color: (_x, _y, rr) => hsl(18 + jit(rr, 10), 70, 90 + jit(rr, 4)),
      }),
      ...makeDabs(r, {
        box: [690, 232, 110, 28],
        count: 34,
        len: [14, 24],
        width: [5, 9],
        angle: -2,
        spread: 8,
        color: (_x, _y, rr) => hsl(20 + jit(rr, 10), 75, 92 + jit(rr, 3)),
      }),
    ]
    return layers.map((l) => ({ ...l, list: makeDabs(r, l.dabs) })).concat([{ id: 'clouds', d: '', fill: '', dabs: layers[0].dabs, list: clouds }])
  }, [])

  return (
    <g>
      <defs>
        <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7ea6c9" />
          <stop offset="0.6" stopColor="#f0c9a2" />
          <stop offset="1" stopColor="#f8e3b6" />
        </linearGradient>
        <radialGradient id="sunHalo">
          <stop offset="0" stopColor="#fff6c8" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#ffe7a0" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ffe7a0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="windowGlow">
          <stop offset="0" stopColor="#ffd37a" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffd37a" stopOpacity="0" />
        </radialGradient>
        {layers.map((l) => (
          <clipPath id={`clip-${l.id}`} key={l.id}>
            <path d={l.d} />
          </clipPath>
        ))}
        <clipPath id="clip-paint">
          <rect x={P.x} y={P.y} width={P.w} height={P.h} />
        </clipPath>
      </defs>

      <g clipPath="url(#clip-paint)">
        {rendered.map((l) => (
          <g key={l.id} clipPath={l.d ? `url(#clip-${l.id})` : undefined}>
            {l.d && <path d={l.d} fill={l.fill} />}
            {l.list.map((d, i) => (
              <line key={i} x1={d.x1} y1={d.y1} x2={d.x2} y2={d.y2} stroke={d.c} strokeWidth={d.w} strokeLinecap="round" opacity="0.88" />
            ))}
          </g>
        ))}

        {/* sun */}
        <circle cx="838" cy="212" r="62" fill="url(#sunHalo)" />
        <circle cx="838" cy="212" r="24" fill="#fff3bd" />

        {/* Qualcomm: a radio tower on the far ridge, sending out signal */}
        <g stroke="#3e3a55" strokeWidth="2.4" strokeLinecap="round" fill="none">
          <path d="M980 304 L988 262 L996 304 M983 292 H993 M985 278 H991" />
        </g>
        <g stroke="#fffaf0" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.85">
          <path d="M1004 252 A 22 22 0 0 1 1004 272" />
          <path d="M1014 244 A 34 34 0 0 1 1014 280" />
          <path d="M1024 236 A 46 46 0 0 1 1024 288" />
          <path d="M972 252 A 22 22 0 0 0 972 272" />
          <path d="M962 244 A 34 34 0 0 0 962 280" />
          <path d="M952 236 A 46 46 0 0 0 952 288" />
        </g>

        {/* Matcha Flow: terraced tea rows */}
        <g fill="none" stroke="#4f7d3a" strokeLinecap="round" opacity="0.8">
          <path d="M530 410 C600 386 700 388 812 424" strokeWidth="3" />
          <path d="M530 428 C610 404 706 408 830 446" strokeWidth="3.4" />
          <path d="M530 448 C620 426 716 430 846 470" strokeWidth="3.8" />
          <path d="M530 470 C630 448 730 454 860 496" strokeWidth="4.2" />
        </g>
        <g fill="#cfe5a3" opacity="0.9">
          <ellipse cx="640" cy="418" rx="8" ry="3" />
          <ellipse cx="720" cy="426" rx="8" ry="3" />
          <ellipse cx="650" cy="444" rx="9" ry="3.4" />
          <ellipse cx="748" cy="452" rx="9" ry="3.4" />
        </g>

        {/* Soundry AI: ripples spreading across the lake, a little boat */}
        <g fill="none" stroke="#e9f6fb" strokeLinecap="round" opacity="0.8">
          <ellipse cx="650" cy="498" rx="22" ry="5" strokeWidth="2" />
          <ellipse cx="650" cy="498" rx="46" ry="10" strokeWidth="2" opacity="0.75" />
          <ellipse cx="650" cy="498" rx="76" ry="16" strokeWidth="2" opacity="0.5" />
          <ellipse cx="650" cy="498" rx="108" ry="22" strokeWidth="2" opacity="0.3" />
        </g>
        <path d="M728 484 h34 l-6 9 h-22 z" fill="#8a4b34" />
        <path d="M745 460 V484 L762 484 Z" fill="#fff6e4" />

        {/* Insulet: a house on the hill with a lit window and a quiet pulse of light */}
        <ellipse cx="985" cy="482" rx="58" ry="9" fill="#3f6a33" opacity="0.5" />
        <rect x="960" y="442" width="50" height="38" fill="#ead7b4" />
        <path d="M950 444 L985 416 L1020 444 Z" fill="#b5533c" />
        <circle cx="974" cy="460" r="22" fill="url(#windowGlow)" />
        <rect x="968" y="453" width="13" height="13" fill="#ffd37a" />
        <path d="M968 459.500 H981 M974.500 453 V466" stroke="#b5533c" strokeWidth="1.2" />
        <rect x="992" y="458" width="10" height="22" fill="#8b5a3c" />
        <path d="M884 520 H920 L928 504 L938 534 L946 512 H1000" fill="none" stroke="#ffe3a3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />

        {/* the artist's signature */}
        <text x="944" y="528" fontFamily="'Caveat', 'Snell Roundhand', cursive" fontSize="24" fill="#2b2118" transform="rotate(-4 944 528)">
          Chitraksha
        </text>
        <path d="M944 534 q40 -5 90 -1" stroke="#2b2118" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.7" transform="rotate(-4 944 528)" />
      </g>
      {/* inner shadow so the canvas reads as a real object */}
      <rect x={P.x} y={P.y} width={P.w} height={P.h} fill="none" stroke="#1c1208" strokeOpacity="0.28" strokeWidth="5" />
    </g>
  )
}

export const Painting = memo(PaintingImpl)
