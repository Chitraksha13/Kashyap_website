import { useEffect, useRef, type CSSProperties } from 'react'
import type { Project } from '../content'
import { imagesIn } from '../lib/assets'
import { Art, Frame } from './Art'
import type { OpenFn } from './Rooms'

type Props = { project: Project; ratio: number; onClose: () => void; onOpen: OpenFn }

// A project on its own: the framed piece with its full wall label beside it.
export function ProjectView({ project: p, ratio, onClose, onOpen }: Props) {
  const images = imagesIn(`projects/${p.id}`)
  const close = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    close.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="pv" onClick={onClose} role="dialog" aria-modal="true" aria-label={p.title}>
      <div className="pv-in" onClick={(e) => e.stopPropagation()}>
        <div className="pv-art">
          <div style={{ '--h': 'min(58vh, 520px)', '--r': ratio } as CSSProperties} className="pv-frame">
            <Frame variant="canvas">{images.length ? <img className="art" src={images[0]} alt="" /> : <Art seed={p.id} ratio={ratio} />}</Frame>
          </div>
          {images.length > 1 && (
            <div className="pv-thumbs">
              {images.map((src, i) => (
                <button key={src} onClick={() => onOpen(images, i)} aria-label={`Open photo ${i + 1} of ${images.length}`}>
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pv-label">
          <p className="meta">{p.dates}</p>
          <h3>{p.title}</h3>
          <p className="role">{p.kicker}</p>
          <ul>
            {p.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <div className="tags">
            {p.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          {p.links && p.links.length > 0 && (
            <div className="links">
              {p.links.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noreferrer">{l.label} ↗</a>
              ))}
            </div>
          )}
        </div>
      </div>
      <button ref={close} className="pv-close" onClick={onClose} aria-label="Close">×</button>
    </div>
  )
}
