import { about, contact, experiences, profile, projects } from '../content'
import { imagesIn } from '../lib/assets'
import type { Layout, Stop } from '../layout'

type OpenFn = (images: string[], index: number) => void

function Thumbs({ images, onOpen }: { images: string[]; onOpen: OpenFn }) {
  if (!images.length) return null
  return (
    <div className="thumbs">
      {images.map((src, i) => (
        <button key={src} className="thumb" onClick={() => onOpen(images, i)} aria-label={`Open image ${i + 1} of ${images.length}`}>
          <img src={src} alt="" loading="lazy" />
        </button>
      ))}
    </div>
  )
}

function Body({ stop, layout, onOpen }: { stop: Stop; layout: Layout; onOpen: OpenFn }) {
  const p = stop.panel
  switch (p.kind) {
    case 'hero':
      return (
        <>
          <p className="eyebrow">{profile.subtitle}</p>
          <h1>{profile.name}</h1>
          <p className="lead">{profile.tagline}</p>
          <p className="hint">Scroll to step closer ↓</p>
        </>
      )
    case 'about': {
      const imgs = imagesIn('about')
      return (
        <>
          <p className="eyebrow">About</p>
          <h2>The painter</h2>
          {about.paragraphs.map((t) => (
            <p key={t}>{t}</p>
          ))}
          <p className="meta">
            {about.degree}, {about.school} · {about.graduation}
          </p>
          <Thumbs images={imgs} onOpen={onOpen} />
        </>
      )
    }
    case 'experience': {
      const e = experiences[p.index]
      return (
        <>
          <p className="eyebrow">
            Experience · {e.dates}
          </p>
          <h2>{e.org}</h2>
          <p className="role">
            {e.role} · {e.location}
          </p>
          <ul>
            {e.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <Thumbs images={imagesIn(`experience/${e.id}`)} onOpen={onOpen} />
        </>
      )
    }
    case 'projectsIntro':
      return (
        <>
          <p className="eyebrow">Projects</p>
          <h2>The gallery wall</h2>
          <p className="lead">Things I’ve built from first interview to final demo.</p>
        </>
      )
    case 'project': {
      const pr = projects[p.index]
      const cs = pr.caseStudy
      return (
        <>
          <p className="eyebrow">Project · {pr.dates}</p>
          <h2>{pr.title}</h2>
          <p className="role">{pr.kicker}</p>
          <ul>
            {pr.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          {cs && (
            <dl>
              {cs.problem && (<><dt>Problem</dt><dd>{cs.problem}</dd></>)}
              {cs.users && (<><dt>Users</dt><dd>{cs.users}</dd></>)}
              {cs.decisions && (<><dt>Decisions</dt><dd>{cs.decisions}</dd></>)}
              {cs.outcome && (<><dt>Outcome</dt><dd>{cs.outcome}</dd></>)}
            </dl>
          )}
          <div className="tags">
            {pr.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <Thumbs images={imagesIn(`projects/${pr.id}`)} onOpen={onOpen} />
        </>
      )
    }
    case 'photos':
      return p.page === 0 ? (
        <>
          <p className="eyebrow">Photos</p>
          <h2>Off the clock</h2>
        </>
      ) : (
        <p className="eyebrow">Photos · {p.page + 1} of {layout.pages}</p>
      )
    case 'contact':
      return (
        <>
          <p className="eyebrow">Contact</p>
          <h2>{contact.heading}</h2>
          <p>{contact.note}</p>
          <div className="actions">
            <a className="btn primary" href={`mailto:${profile.email}`}>{profile.email}</a>
            <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <a className="btn" href={profile.resume} target="_blank" rel="noreferrer">Résumé (PDF)</a>
          </div>
        </>
      )
  }
}

export function Panels({ layout, onOpen }: { layout: Layout; onOpen: OpenFn }) {
  return (
    <div className="panels">
      {layout.stops.map((stop) => (
        <section key={stop.id} data-stop={stop.id} className={`panel panel-${stop.side} kind-${stop.panel.kind}`}>
          <div className="card">
            <Body stop={stop} layout={layout} onOpen={onOpen} />
          </div>
        </section>
      ))}
    </div>
  )
}
