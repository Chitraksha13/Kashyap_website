import { useCallback, useMemo, useRef, useState } from 'react'
import { Lightbox } from './components/Lightbox'
import { Panels } from './components/Panels'
import { World } from './components/World'
import { profile } from './content'
import { useScrollCamera } from './hooks/useScrollCamera'
import { buildLayout, type NavKey } from './layout'
import './styles.css'

const NAV: { key: NavKey; label: string }[] = [
  { key: 'about', label: 'About' },
  { key: 'experience', label: 'Experience' },
  { key: 'projects', label: 'Projects' },
  { key: 'photos', label: 'Photos' },
  { key: 'contact', label: 'Contact' },
]

export default function App() {
  const layout = useMemo(buildLayout, [])
  const svg = useRef<SVGSVGElement>(null)
  const spacer = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<NavKey | undefined>()
  const [box, setBox] = useState<{ images: string[]; index: number } | null>(null)

  const onActive = useCallback((nav: NavKey | undefined) => setActive(nav), [])
  const { jumpTo } = useScrollCamera({ svg, spacer, stops: layout.stops, onActive })
  const onOpen = useCallback((images: string[], index: number) => setBox({ images, index }), [])

  const go = (key?: NavKey) => {
    const i = key ? layout.stops.findIndex((s) => s.nav === key) : 0
    jumpTo(Math.max(0, i))
  }

  return (
    <>
      <World ref={svg} layout={layout} onOpen={onOpen} />
      <div className="grain" aria-hidden />
      <div className="vignette" aria-hidden />

      <header className="nav">
        <button className="brand" onClick={() => go()} aria-label={`${profile.name}, back to the studio`}>
          CK
        </button>
        <nav>
          {NAV.map((n) => (
            <button key={n.key} className={active === n.key ? 'on' : ''} onClick={() => go(n.key)}>
              {n.label}
            </button>
          ))}
        </nav>
      </header>

      <Panels layout={layout} onOpen={onOpen} />
      <div ref={spacer} className="spacer" />

      {box && <Lightbox images={box.images} index={box.index} onChange={(i) => setBox({ ...box, index: i })} onClose={() => setBox(null)} />}
    </>
  )
}
