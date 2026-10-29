import { useCallback, useEffect, useRef, useState } from 'react'
import { profile, projects } from '../content'
import { Lightbox } from './Lightbox'
import { ProjectView } from './ProjectView'
import { AboutRoom, ContactRoom, Entrance, ExperienceRoom, PhotosRoom, ProjectsRoom } from './Rooms'
import { PROJECT_RATIOS, ROOMS } from './roomList'
import { Walker } from './Walker'

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

// A long wall moved sideways by vertical scrolling: the stage stays pinned while the page's
// scroll distance is spent walking the wall from the entrance to the last room.
export function Gallery() {
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const wall = useRef<HTMLDivElement>(null)
  const fill = useRef<HTMLDivElement>(null)
  const walker = useRef<HTMLDivElement>(null)
  const rooms = useRef<(HTMLElement | null)[]>([])
  const geo = useRef({ offs: [] as number[], max: 0 })
  const [active, setActive] = useState(0)
  const [widths, setWidths] = useState<number[]>([])
  const [project, setProject] = useState<number | null>(null)
  const [box, setBox] = useState<{ images: string[]; index: number } | null>(null)

  const reg = (i: number) => (el: HTMLElement | null) => {
    rooms.current[i] = el
  }
  const closeProject = useCallback(() => setProject(null), [])
  const onOpen = useCallback((images: string[], index: number) => setBox({ images, index }), [])

  // Keep the wall from scrolling while a project is open.
  useEffect(() => {
    document.body.style.overflow = project !== null ? 'hidden' : ''
  }, [project])

  useEffect(() => {
    const sec = section.current
    const stg = stage.current
    const wl = wall.current
    if (!sec || !stg || !wl) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let target = 0
    let cur = 0
    let raf = 0

    const apply = () => {
      wl.style.transform = `translate3d(${-cur}px,0,0)`
      const { offs, max } = geo.current
      if (fill.current) fill.current.style.transform = `scaleX(${max ? cur / max : 0})`
      // The walker crosses the floor as the wall moves; its stride follows the distance walked.
      const w = walker.current
      if (w) {
        w.style.transform = `translate3d(${(max ? cur / max : 0) * (window.innerWidth - w.offsetWidth)}px,0,0)`
        w.style.setProperty('--step', `${Math.sin(cur / 22) * 28}deg`)
      }
      let idx = 0
      offs.forEach((o, i) => {
        if (cur + window.innerWidth * 0.4 >= o) idx = i
      })
      // The last room can be narrower than the lookahead above, so the end of the wall always counts as it.
      if (offs.length && cur >= max - 2) idx = offs.length - 1
      setActive(idx)
      stg.classList.toggle('moved', cur > 80)
    }
    const tick = () => {
      const d = target - cur
      cur = reduce || Math.abs(d) < 0.4 ? target : cur + d * 0.14
      apply()
      raf = cur === target ? 0 : requestAnimationFrame(tick)
    }
    const read = () => {
      target = clamp(-sec.getBoundingClientRect().top, 0, geo.current.max)
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const measure = () => {
      const max = Math.max(0, wl.offsetWidth - window.innerWidth)
      geo.current = { offs: rooms.current.map((e) => e?.offsetLeft ?? 0), max }
      sec.style.height = `${max + stg.clientHeight}px`
      const w = rooms.current.map((e) => e?.offsetWidth ?? 0)
      setWidths((prev) => (prev.length === w.length && prev.every((v, i) => v === w[i]) ? prev : w))
      read()
    }

    // Sideways trackpad swipes walk the gallery too.
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault()
        window.scrollBy({ top: e.deltaX, behavior: 'instant' })
      }
    }
    // Tabbing to something off-screen walks to it instead of scrolling the clipped stage.
    const onFocus = (e: FocusEvent) => {
      stg.scrollLeft = 0
      const r = (e.target as HTMLElement).getBoundingClientRect()
      if (r.left >= 0 && r.right <= window.innerWidth) return
      const x = r.left + cur + r.width / 2 - window.innerWidth / 2
      window.scrollTo({ top: clamp(x, 0, geo.current.max), behavior: 'instant' })
    }

    const ro = new ResizeObserver(measure)
    ro.observe(wl)
    measure()
    document.fonts?.ready.then(measure)
    window.addEventListener('scroll', read, { passive: true })
    window.addEventListener('resize', measure)
    window.addEventListener('wheel', onWheel, { passive: false })
    stg.addEventListener('focusin', onFocus)
    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', read)
      window.removeEventListener('resize', measure)
      window.removeEventListener('wheel', onWheel)
      stg.removeEventListener('focusin', onFocus)
      cancelAnimationFrame(raf)
    }
  }, [])

  const go = (i: number) => {
    const { offs, max } = geo.current
    window.scrollTo({ top: clamp((offs[i] ?? 0) - window.innerWidth * 0.04, 0, max), behavior: 'smooth' })
  }

  return (
    <section ref={section} className="gallery" aria-label={`${profile.name}, a gallery of work`}>
      <div ref={stage} className="stage">
        <div ref={wall} className="wall">
          <Entrance reg={reg(0)} />
          <AboutRoom reg={reg(1)} />
          <ExperienceRoom reg={reg(2)} onOpen={onOpen} />
          <ProjectsRoom reg={reg(3)} onProject={setProject} />
          <PhotosRoom reg={reg(4)} onOpen={onOpen} />
          <ContactRoom reg={reg(5)} />
        </div>

        <Walker ref={walker} dark={active === 4} />

        <div className="nav">
          <button className="brand" onClick={() => go(0)} aria-label={`${profile.name}, back to the entrance`}>
            <span className="brand-full">{profile.name}</span>
            <span className="brand-short">CK</span>
          </button>
          <nav>
            {ROOMS.slice(1).map((r, i) => (
              <button key={r.id} className={active === i + 1 ? 'on' : ''} onClick={() => go(i + 1)}>
                {r.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="plan" role="navigation" aria-label="Floor plan">
          <div className="plan-rooms">
            {ROOMS.map((r, i) => (
              <button key={r.id} className={active === i ? 'on' : ''} style={{ flexGrow: widths[i] || 1 }} onClick={() => go(i)} aria-label={r.label} title={r.label} />
            ))}
          </div>
          <div ref={fill} className="plan-fill" />
        </div>
      </div>

      {project !== null && (
        <ProjectView project={projects[project]} ratio={PROJECT_RATIOS[project % PROJECT_RATIOS.length]} onClose={closeProject} onOpen={onOpen} />
      )}
      {box && <Lightbox images={box.images} index={box.index} onChange={(i) => setBox({ ...box, index: i })} onClose={() => setBox(null)} />}
    </section>
  )
}
