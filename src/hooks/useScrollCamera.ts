import { useEffect, useRef, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import type { NavKey, Rect, Stop } from '../layout'

gsap.registerPlugin(ScrollTrigger)

const MOVE = 1.3 // scroll units spent travelling between stops
const VH_PER_UNIT = 48 // how much scrolling one unit costs

type Cam = { cx: number; cy: number; ls: number } // world point at screen centre, ln(px per unit)

type Options = {
  svg: RefObject<SVGSVGElement>
  spacer: RefObject<HTMLDivElement>
  stops: Stop[]
  onActive: (nav: NavKey | undefined, index: number) => void
}

// Where the art should sit on screen depends on which side the text card is on.
function cameraFor(stop: Stop, vw: number, vh: number): Cam {
  const r: Rect = stop.rect
  const narrow = vw < 820 || vw / vh < 0.95
  let availW: number
  let availH: number
  let px: number
  let py: number

  if (stop.side === 'full') {
    availW = vw * 0.94
    availH = narrow ? vh * 0.6 : vh * 0.74
    px = vw / 2
    py = narrow ? 70 + availH / 2 : vh * 0.5 - vh * 0.03
  } else if (narrow) {
    availW = vw * 0.94
    availH = vh * 0.4
    px = vw / 2
    py = 64 + availH / 2
  } else {
    const card = Math.min(480, vw * 0.38) + vw * 0.04
    availW = vw - card - vw * 0.06
    availH = vh * 0.78
    px = stop.side === 'left' ? vw - vw * 0.03 - availW / 2 : vw * 0.03 + availW / 2
    py = vh * 0.5 + 24
  }

  const s = Math.min(availW / r.w, availH / r.h)
  return {
    cx: r.x + r.w / 2 - (px - vw / 2) / s,
    cy: r.y + r.h / 2 - (py - vh / 2) / s,
    ls: Math.log(s),
  }
}

export function useScrollCamera({ svg, spacer, stops, onActive }: Options) {
  const jumpRef = useRef<(index: number) => void>(() => {})

  useEffect(() => {
    const svgEl = svg.current
    const spacerEl = spacer.current
    if (!svgEl || !spacerEl) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = new Lenis({ lerp: reduce ? 1 : 0.09, wheelMultiplier: 0.9 })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    let ctx: gsap.Context | undefined
    let st: ScrollTrigger | undefined
    let labels: number[] = []
    let total = 1
    let lastIndex = -1
    let builtFor = { w: 0, h: 0 }

    const apply = (cam: Cam, vw: number, vh: number) => {
      const s = Math.exp(cam.ls)
      const w = vw / s
      const h = vh / s
      svgEl.setAttribute('viewBox', `${cam.cx - w / 2} ${cam.cy - h / 2} ${w} ${h}`)
    }

    const build = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const progress = st ? st.progress : 0
      builtFor = { w: vw, h: vh }
      ctx?.revert()

      ctx = gsap.context(() => {
        const cams = stops.map((s) => cameraFor(s, vw, vh))
        const panels = stops.map((s) => document.querySelector<HTMLElement>(`[data-stop="${s.id}"]`))
        const tl = gsap.timeline({ defaults: { ease: 'none' } })
        labels = []
        let t = 0

        stops.forEach((stop, i) => {
          labels[i] = t
          const panel = panels[i]
          if (panel) {
            if (i === 0) tl.set(panel, { autoAlpha: 1, y: 0 }, 0)
            else tl.fromTo(panel, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' }, t - 0.1)
            if (i < stops.length - 1)
              tl.fromTo(panel, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -28, duration: 0.3, ease: 'power2.in', immediateRender: false }, t + stop.hold - 0.3)
          }
          t += stop.hold

          if (i < stops.length - 1) {
            const a = cams[i]
            const b = cams[i + 1]
            const dist = Math.hypot(b.cx - a.cx, b.cy - a.cy)
            const dip = Math.min(1.1, dist / 2200) // pull back on long trips so it feels like travelling
            const prox = { p: 0 }
            tl.to(
              prox,
              {
                p: 1,
                duration: MOVE,
                ease: 'power1.inOut',
                onUpdate: () => {
                  const p = prox.p
                  apply(
                    {
                      cx: a.cx + (b.cx - a.cx) * p,
                      cy: a.cy + (b.cy - a.cy) * p,
                      ls: a.ls + (b.ls - a.ls) * p - dip * Math.sin(Math.PI * p),
                    },
                    vw,
                    vh,
                  )
                },
              },
              t,
            )
            t += MOVE
          }
        })

        total = tl.duration()
        apply(cams[0], vw, vh)
        spacerEl.style.height = `${total * VH_PER_UNIT + 100}vh`

        st = ScrollTrigger.create({
          trigger: spacerEl,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          animation: tl,
          onUpdate: (self) => {
            const time = self.progress * total
            let idx = 0
            labels.forEach((l, i) => {
              if (time >= l - 0.2) idx = i
            })
            if (idx !== lastIndex) {
              lastIndex = idx
              onActive(stops[idx].nav, idx)
            }
          },
        })
      })

      ScrollTrigger.refresh()
      if (progress > 0 && st) lenis.scrollTo(progress * (st.end - st.start) + st.start, { immediate: true })
    }

    build()

    let timer: number | undefined
    const onResize = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        if (window.innerWidth !== builtFor.w || window.innerHeight !== builtFor.h) build()
      }, 200)
    }
    window.addEventListener('resize', onResize)

    jumpRef.current = (index: number) => {
      if (!st) return
      const y = st.start + ((labels[index] + 0.7) / total) * (st.end - st.start)
      lenis.scrollTo(y, { duration: reduce ? 0 : 2.4, easing: (x) => 1 - Math.pow(1 - x, 3) })
    }

    return () => {
      window.removeEventListener('resize', onResize)
      window.clearTimeout(timer)
      gsap.ticker.remove(tick)
      st?.kill()
      ctx?.revert()
      lenis.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stops])

  return { jumpTo: (index: number) => jumpRef.current(index) }
}
