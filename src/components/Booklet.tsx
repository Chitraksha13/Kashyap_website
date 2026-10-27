import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { experiences, type Experience } from '../content'
import { imagesIn } from '../lib/assets'
import type { OpenFn } from './Rooms'

// Experience as an open book. Leaf j has experience 2j on its front (a right-hand page)
// and experience 2j+1 on its back (the left-hand page of the next spread).
const LEAVES = Math.ceil(experiences.length / 2)
const TURN_MS = 800

function Page({ exp, folio, onOpen }: { exp?: Experience; folio: number; onOpen: OpenFn }) {
  if (!exp) return <div className="page-in" />
  const images = imagesIn(`experience/${exp.id}`)
  return (
    <div className="page-in">
      <p className="meta">{exp.dates} · {exp.location}</p>
      <h3>{exp.org}</h3>
      <p className="role">{exp.role}</p>
      <ul>
        {exp.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      {images.length > 0 && (
        <div className="page-photos">
          {images.slice(0, 4).map((src, i) => (
            <button key={src} onClick={() => onOpen(images, i)} aria-label={`Open photo ${i + 1} from ${exp.org}`}>
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
      <span className="folio">{folio}</span>
    </div>
  )
}

export function Booklet({ onOpen }: { onOpen: OpenFn }) {
  const [page, setPage] = useState(0) // how many leaves have been turned
  const [turning, setTurning] = useState<number | null>(null)
  const book = useRef<HTMLDivElement>(null)
  const timer = useRef<number | undefined>(undefined)
  const visible = useRef(false)

  const turn = (dir: 1 | -1) => {
    const next = page + dir
    if (next < 0 || next > LEAVES) return
    setTurning(dir === 1 ? page : next)
    setPage(next)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setTurning(null), TURN_MS)
  }

  // Arrow keys turn the page while the book is on screen; the page itself never uses them.
  const turnRef = useRef(turn)
  turnRef.current = turn
  useEffect(() => {
    const el = book.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), { threshold: 0.6 })
    io.observe(el)
    const onKey = (e: KeyboardEvent) => {
      if (!visible.current) return
      if (e.key === 'ArrowRight') turnRef.current(1)
      if (e.key === 'ArrowLeft') turnRef.current(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      io.disconnect()
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(timer.current)
    }
  }, [])

  return (
    <div className="booklet" style={{ '--h': '60vh', '--ft': '14vh' } as CSSProperties}>
      <div className="hang">
        <div className="beam" aria-hidden />
        <div className="lamp" aria-hidden />
        <div ref={book} className="book">
          <div className="book-base">
            <div className="page left">
              <div className="page-in title-page">
                <span className="rn">Room II</span>
                <h2>Experience</h2>
                <button className="turn-hint" onClick={() => turn(1)} disabled={page >= LEAVES}>Turn the page →</button>
              </div>
            </div>
            <div className="page right">
              <div className="page-in closing-page">
                <h3>That’s the experience.</h3>
                <p>Keep walking to see what I’ve built.</p>
              </div>
            </div>
          </div>

          {Array.from({ length: LEAVES }, (_, j) => (
            <div
              key={j}
              className={`leaf${page > j ? ' flipped' : ''}${turning === j ? ' turning' : ''}`}
              style={{ zIndex: page > j ? j + 1 : LEAVES - j }}
            >
              <div className="face front page right">
                <Page exp={experiences[2 * j]} folio={2 * j + 1} onOpen={onOpen} />
              </div>
              <div className="face back page left">
                <Page exp={experiences[2 * j + 1]} folio={2 * j + 2} onOpen={onOpen} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="book-controls">
        <button className="arrow" onClick={() => turn(-1)} disabled={page === 0} aria-label="Previous page">‹</button>
        <span className="book-count">Page {page + 1} of {LEAVES + 1}</span>
        <button className="arrow" onClick={() => turn(1)} disabled={page >= LEAVES} aria-label="Next page">›</button>
      </div>
    </div>
  )
}
