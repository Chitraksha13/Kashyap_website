import { forwardRef, memo } from 'react'
import { projects } from '../content'
import { imagesIn } from '../lib/assets'
import {
  CANVAS_FRAME,
  PER_PAGE,
  PHOTO_CELL_H,
  PHOTO_CELL_W,
  PHOTO_COLS,
  PROJ_STEP,
  PROJ_X0,
  type Layout,
} from '../layout'
import { Painting } from './Painting'

type Props = { layout: Layout; onOpen: (images: string[], index: number) => void }

const FLOOR_Y = 706
const EDGE = 4000

// The whole site is one big SVG "world". The scroll camera animates its viewBox.
const WorldImpl = forwardRef<SVGSVGElement, Props>(function World({ layout, onOpen }, ref) {
  const W = layout.worldW
  const photoSlots = Math.max(PER_PAGE * layout.pages, PER_PAGE)

  return (
    <svg ref={ref} className="world" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" role="img" aria-label="An artist's studio and gallery">
      <defs>
        <linearGradient id="wallG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4e9d4" />
          <stop offset="1" stopColor="#e4d0ae" />
        </linearGradient>
        <linearGradient id="floorG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a97c53" />
          <stop offset="1" stopColor="#6f4c31" />
        </linearGradient>
        <linearGradient id="woodG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#85583a" />
          <stop offset="0.5" stopColor="#a06b46" />
          <stop offset="1" stopColor="#6e4630" />
        </linearGradient>
        <linearGradient id="winG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9d3e8" />
          <stop offset="1" stopColor="#fbf0d0" />
        </linearGradient>
        <linearGradient id="beamG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff3c4" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff3c4" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="coneG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff3c4" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fff3c4" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="brassG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e6c677" />
          <stop offset="1" stopColor="#b48f45" />
        </linearGradient>
      </defs>

      {/* wall and floor */}
      {/* (drawn well past the visible edges so zoomed-out views never show a gap) */}
      <rect x={-EDGE} y={-EDGE} width={W + EDGE * 2} height={FLOOR_Y + EDGE} fill="url(#wallG)" />
      <rect x={-EDGE} y="672" width={W + EDGE * 2} height="40" fill="#dcc7a2" />
      <rect x={-EDGE} y="706" width={W + EDGE * 2} height={194 + EDGE} fill="url(#floorG)" />
      {[742, 786, 842, 1000, 1200].map((y) => (
        <rect key={y} x={-EDGE} y={y} width={W + EDGE * 2} height="2" fill="#000" opacity="0.14" />
      ))}

      {/* window and light */}
      <g>
        <rect x="80" y="110" width="280" height="350" fill="#7b5238" />
        <rect x="96" y="126" width="248" height="318" fill="url(#winG)" />
        <path d="M220 126 V444 M96 285 H344" stroke="#7b5238" strokeWidth="9" />
        <rect x="68" y="460" width="304" height="16" fill="#8d6244" />
        <polygon points="96,444 344,444 800,830 420,860" fill="url(#beamG)" />
      </g>

      {/* easel */}
      <g stroke="#6b4a2f" strokeWidth="16" strokeLinecap="round">
        <line x1="690" y1="540" x2="610" y2="830" />
        <line x1="910" y1="540" x2="990" y2="830" />
        <line x1="800" y1="520" x2="800" y2="790" stroke="#5a3d27" strokeWidth="12" />
      </g>
      <ellipse cx="800" cy="842" rx="260" ry="14" fill="#000" opacity="0.18" />

      {/* canvas */}
      <rect x={CANVAS_FRAME.x} y={CANVAS_FRAME.y} width={CANVAS_FRAME.w} height={CANVAS_FRAME.h} rx="4" fill="url(#woodG)" />
      <rect x={CANVAS_FRAME.x + 8} y={CANVAS_FRAME.y + 8} width={CANVAS_FRAME.w - 16} height={CANVAS_FRAME.h - 16} fill="none" stroke="#3a2415" strokeOpacity="0.45" strokeWidth="2" />
      <Painting />
      <rect x="560" y="556" width="480" height="16" rx="3" fill="url(#woodG)" />

      {/* studio props */}
      <g>
        <ellipse cx="1230" cy="812" rx="80" ry="12" fill="#000" opacity="0.2" />
        <g stroke="#6b4a2f" strokeWidth="9" strokeLinecap="round">
          <line x1="1180" y1="652" x2="1166" y2="812" />
          <line x1="1280" y1="652" x2="1294" y2="812" />
          <line x1="1230" y1="660" x2="1230" y2="812" />
        </g>
        <ellipse cx="1230" cy="646" rx="76" ry="15" fill="#a06b46" />
        <g transform="rotate(-8 1230 610)">
          <ellipse cx="1230" cy="610" rx="58" ry="34" fill="#d1a56b" />
          <ellipse cx="1262" cy="618" rx="8" ry="6" fill="#a06b46" />
          {[
            ['#c2543b', 1196, 600],
            ['#e0a63a', 1214, 590],
            ['#6e9a52', 1238, 586],
            ['#4a7fa8', 1258, 596],
            ['#f2ead8', 1204, 622],
            ['#7a5aa0', 1226, 624],
          ].map(([c, x, y]) => (
            <ellipse key={String(c)} cx={Number(x)} cy={Number(y)} rx="9" ry="6" fill={String(c)} />
          ))}
        </g>
        <path d="M1318 700 h30 l-4 -46 h-22 z" fill="#b9885c" />
        <g stroke="#7b5238" strokeWidth="3" strokeLinecap="round">
          <line x1="1326" y1="654" x2="1318" y2="610" />
          <line x1="1334" y1="654" x2="1338" y2="604" />
          <line x1="1340" y1="654" x2="1354" y2="616" />
        </g>
        <g>
          <path d="M1456 840 h60 l-8 -86 h-44 z" fill="#b45f45" />
          {[
            [1486, 700, -30],
            [1486, 690, 10],
            [1486, 700, 48],
            [1486, 668, -12],
            [1486, 668, 28],
          ].map(([x, y, r], i) => (
            <ellipse key={i} cx={Number(x)} cy={Number(y)} rx="14" ry="46" fill={i % 2 ? '#5d8a4a' : '#7aa55a'} transform={`rotate(${r} ${Number(x)} ${Number(y) + 42})`} />
          ))}
        </g>
      </g>

      {/* projects gallery wall */}
      {projects.map((p, i) => {
        const x = PROJ_X0 + i * PROJ_STEP
        const imgs = imagesIn(`projects/${p.id}`)
        return (
          <g key={p.id}>
            <polygon points={`${x + 200},108 ${x + 320},108 ${x + 560},560 ${x - 40},560`} fill="url(#coneG)" opacity="0.55" />
            <rect x={x + 200} y="98" width="120" height="10" rx="4" fill="#3b2a1d" />
            <rect x={x - 20} y="120" width="560" height="400" rx="4" fill="url(#woodG)" />
            <rect x={x} y="140" width="520" height="360" fill="#f4ecdc" />
            <rect x={x + 20} y="160" width="480" height="320" fill="#d9c9a6" />
            <text x={x + 260} y="330" textAnchor="middle" fontFamily="'Fraunces', Georgia, serif" fontSize="30" fill="#7b6a4e">
              {p.title}
            </text>
            {imgs[0] && (
              <image
                href={imgs[0]}
                x={x + 20}
                y="160"
                width="480"
                height="320"
                preserveAspectRatio="xMidYMid slice"
                className="clickable"
                onClick={() => onOpen(imgs, 0)}
              />
            )}
            <rect x={x + 110} y="540" width="300" height="46" rx="3" fill="url(#brassG)" />
            <text x={x + 260} y="570" textAnchor="middle" fontFamily="'Fraunces', Georgia, serif" fontSize="20" fill="#3a2a14">
              {p.title}
            </text>
          </g>
        )
      })}
      {/* room for the next one */}
      <g>
        <rect x={PROJ_X0 + projects.length * PROJ_STEP} y="140" width="520" height="360" fill="none" stroke="#9a8460" strokeWidth="3" strokeDasharray="14 12" rx="4" />
        <text x={PROJ_X0 + projects.length * PROJ_STEP + 260} y="330" textAnchor="middle" fontFamily="'Caveat', cursive" fontSize="44" fill="#8a7550">
          next piece in progress…
        </text>
      </g>

      {/* photo wall */}
      {Array.from({ length: photoSlots }).map((_, n) => {
        const page = Math.floor(n / PER_PAGE)
        const k = n % PER_PAGE
        const col = k % PHOTO_COLS
        const row = Math.floor(k / PHOTO_COLS)
        const x = layout.photoX0 + page * PHOTO_COLS * PHOTO_CELL_W + col * PHOTO_CELL_W + 14
        const y = 130 + row * PHOTO_CELL_H
        const tilt = ((n * 37) % 7) - 3
        const src = layout.photos[n]
        return (
          <g key={n} transform={`rotate(${tilt * 0.6} ${x + 110} ${y + 120})`}>
            <rect x={x + 6} y={y + 8} width="224" height="256" fill="#000" opacity="0.18" />
            <rect x={x} y={y} width="224" height="256" fill="#fbf6ea" />
            <rect x={x + 12} y={y + 12} width="200" height="232" fill={src ? '#d9c9a6' : 'none'} stroke={src ? 'none' : '#a8946c'} strokeDasharray="8 7" strokeWidth="2" />
            {src ? (
              <image
                href={src}
                x={x + 12}
                y={y + 12}
                width="200"
                height="232"
                preserveAspectRatio="xMidYMid slice"
                className="clickable"
                onClick={() => onOpen(layout.photos, n)}
              />
            ) : (
              <text x={x + 112} y={y + 134} textAnchor="middle" fontFamily="'Caveat', cursive" fontSize="26" fill="#a8946c">
                a photo here
              </text>
            )}
            <circle cx={x + 112} cy={y - 2} r="6" fill="#b5533c" />
          </g>
        )
      })}
    </svg>
  )
})

export const World = memo(WorldImpl)
