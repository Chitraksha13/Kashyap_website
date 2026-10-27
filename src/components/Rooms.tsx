import type { CSSProperties, ReactNode } from 'react'
import { about, contact, experiences, profile, projects } from '../content'
import { imagesIn } from '../lib/assets'
import { Art, Frame, type FrameVariant } from './Art'
import { Booklet } from './Booklet'
import { PROJECT_RATIOS } from './roomList'

export type OpenFn = (images: string[], index: number) => void
type Reg = (el: HTMLElement | null) => void

const css = (v: Record<string, string | number>) => v as CSSProperties
const no = (n: number) => `No. ${String(n).padStart(2, '0')}`

function Room({ id, reg, dark, children }: { id: string; reg: Reg; dark?: boolean; children: ReactNode }) {
  return (
    <section id={id} ref={reg} className={`room room-${id}${dark ? ' dark' : ''}`}>
      <div className="track" aria-hidden />
      <div className="floor" aria-hidden />
      <div className="room-in">{children}</div>
    </section>
  )
}

function RoomTitle({ num, title, sub }: { num: string; title: string; sub?: string }) {
  return (
    <div className="room-title">
      <span className="rn">{num}</span>
      <h2>{title}</h2>
      {sub && <p>{sub}</p>}
    </div>
  )
}

// A framed piece under its own picture light, with an optional wall label beside it.
// `shift` moves it up (negative) or down (positive), in vh, so a room can zigzag.
// `ft` sets the frame's top edge (vh from the top of the stage) when the piece is not centred.
function Work({ seed, art, images, ratio, h, variant = 'black', shift = 0, ft, onOpen, onSelect, children }: {
  seed: string
  art?: ReactNode
  images?: string[]
  ratio: number
  h: number
  variant?: FrameVariant
  shift?: number
  ft?: number
  onOpen?: OpenFn
  onSelect?: () => void
  children?: ReactNode
}) {
  const imgs = images ?? []
  const style = css({
    '--h': `${h}vh`,
    '--r': ratio,
    ...(ft !== undefined ? { '--ft': `${ft}vh` } : shift ? { '--ft': `${48 - h / 2 + shift}vh`, transform: `translateY(${shift}vh)` } : {}),
  })
  const open = onSelect ?? (imgs.length && onOpen ? () => onOpen(imgs, 0) : undefined)
  return (
    <div className="work" style={style}>
      <div className="hang">
        <div className="beam" aria-hidden />
        <div className="lamp" aria-hidden />
        <Frame variant={variant} onClick={open} label={onSelect ? 'View project' : `Open ${imgs.length} photo${imgs.length > 1 ? 's' : ''}`}>
          {imgs.length ? <img className="art" src={imgs[0]} alt="" loading="lazy" /> : (art ?? <Art seed={seed} ratio={ratio} />)}
        </Frame>
      </div>
      {children && <aside className="placard">{children}</aside>}
    </div>
  )
}

export function Entrance({ reg }: { reg: Reg }) {
  return (
    <Room id="entrance" reg={reg}>
      <div className="intro">
        <h1>
          Chitraksha
          <br />
          Kashyap
        </h1>
        <p className="cue-text">Scroll to walk the gallery →</p>
      </div>
    </Room>
  )
}

// Frames with their wall text underneath, all hung from the same line.
export function AboutRoom({ reg }: { reg: Reg }) {
  const photos = imagesIn('about')
  return (
    <Room id="about" reg={reg}>
      <RoomTitle num="Room I" title="The Artist" />
      {about.chapters.map((text, i) => (
        <div key={i} className="about-col">
          <Work seed={`about-${i}`} images={photos[i] ? [photos[i]] : []} ratio={0.8} h={42} variant={i % 2 ? 'steel' : 'black'} ft={13} />
          <div className="walltext">
            {text.split(/(?<=[.!?])\s+/).map((sentence) => (
              <p key={sentence}>{sentence}</p>
            ))}
          </div>
        </div>
      ))}
    </Room>
  )
}

export function ExperienceRoom({ reg, onOpen }: { reg: Reg; onOpen: OpenFn }) {
  return (
    <Room id="experience" reg={reg}>
      <Booklet onOpen={onOpen} />
    </Room>
  )
}

export function ProjectsRoom({ reg, onProject }: { reg: Reg; onProject: (index: number) => void }) {
  return (
    <Room id="projects" reg={reg}>
      <RoomTitle num="Room III" title="Projects" sub="Click a piece to read more" />
      {projects.map((p, i) => (
        <Work
          key={p.id}
          seed={p.id}
          images={imagesIn(`projects/${p.id}`)}
          ratio={PROJECT_RATIOS[i % PROJECT_RATIOS.length]}
          h={44}
          shift={i % 2 ? 7 : -7}
          variant={i % 2 ? 'black' : 'canvas'}
          onSelect={() => onProject(i)}
        >
          <p className="no">{no(experiences.length + i + 1)}</p>
          <h3>{p.title}</h3>
          <p className="role">{p.kicker}</p>
          <button className="view" onClick={() => onProject(i)}>View project →</button>
        </Work>
      ))}
    </Room>
  )
}

export function PhotosRoom({ reg, onOpen }: { reg: Reg; onOpen: OpenFn }) {
  const photos = imagesIn('photos')
  const ratios = [0.8, 1.3, 1.1, 0.75, 1.4, 0.9]
  const items = photos.length ? photos : Array.from({ length: 6 }, (_, i) => `ph-${i}`)
  const cols: number[][] = []
  items.forEach((_, i) => {
    if (i % 2 === 0) cols.push([i])
    else cols[cols.length - 1].push(i)
  })
  return (
    <Room id="photos" reg={reg} dark>
      <RoomTitle num="Room IV" title="Off the Clock" sub="Outside of work" />
      {cols.map((col, c) => (
        <div key={c} className="col" style={css({ '--h': '62vh' })}>
          <div className="hang">
            <div className="beam" aria-hidden />
            <div className="lamp" aria-hidden />
            <div className="col-frames">
              {col.map((i) => (
                <div key={i} className="cell" style={css({ '--r': ratios[i % ratios.length] })}>
                  <Frame variant={i % 3 === 0 ? 'canvas' : i % 3 === 1 ? 'black' : 'steel'} onClick={photos.length ? () => onOpen(photos, i) : undefined} label={`Open photo ${i + 1}`}>
                    {photos.length ? <img className="art" src={items[i]} alt="" loading="lazy" /> : <Art seed={items[i]} ratio={ratios[i % ratios.length]} />}
                  </Frame>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </Room>
  )
}

export function ContactRoom({ reg }: { reg: Reg }) {
  return (
    <Room id="contact" reg={reg}>
      <RoomTitle num="Room V" title="Contact" sub="Thank you for visiting" />
      <div className="contact-card">
        <p className="contact-heading">{contact.heading}</p>
        <div className="actions">
          <a className="btn primary" href={`mailto:${profile.email}`}>{profile.email}</a>
          <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a className="btn" href={profile.resume} target="_blank" rel="noreferrer">Résumé (PDF)</a>
        </div>
        <p className="exit">© {new Date().getFullYear()} {profile.name}</p>
      </div>
    </Room>
  )
}
