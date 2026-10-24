import { experiences, projects } from './content'
import { imagesIn } from './lib/assets'

export type Rect = { x: number; y: number; w: number; h: number }
export type NavKey = 'about' | 'experience' | 'projects' | 'photos' | 'contact'

export type PanelSpec =
  | { kind: 'hero' }
  | { kind: 'about' }
  | { kind: 'experience'; index: number }
  | { kind: 'projectsIntro' }
  | { kind: 'project'; index: number }
  | { kind: 'photos'; page: number }
  | { kind: 'contact' }

export type Stop = {
  id: string
  nav?: NavKey
  rect: Rect // the part of the world the camera frames
  side: 'left' | 'right' | 'full' // which side the text card sits on ('full' = small banner)
  hold: number // how long (in scroll units) the camera rests here
  panel: PanelSpec
}

// World coordinates (SVG units). The studio room sits at the left, the gallery wall runs right.
export const ROOM: Rect = { x: 0, y: 0, w: 1600, h: 900 }
export const CANVAS_FRAME: Rect = { x: 500, y: 110, w: 600, h: 450 }
export const PAINT: Rect = { x: 520, y: 130, w: 560, h: 410 }

// Where each experience lives on the painting.
export const REGIONS: Rect[] = [
  { x: 770, y: 150, w: 300, h: 170 }, // Qualcomm: tower and sky
  { x: 520, y: 325, w: 330, h: 135 }, // Matcha Flow: tea terraces
  { x: 520, y: 430, w: 300, h: 110 }, // Soundry AI: lake ripples
  { x: 880, y: 385, w: 200, h: 150 }, // Insulet: the house with a lit window
]
export const SIGNATURE: Rect = { x: 900, y: 470, w: 200, h: 110 }

export const PROJ_X0 = 1760
export const PROJ_STEP = 640
export const PHOTO_COLS = 4
export const PHOTO_ROWS = 2
export const PHOTO_CELL_W = 270
export const PHOTO_CELL_H = 300
export const PAGE_W = PHOTO_COLS * PHOTO_CELL_W
export const PER_PAGE = PHOTO_COLS * PHOTO_ROWS

export function buildLayout() {
  const photos = imagesIn('photos')
  const pages = Math.max(1, Math.ceil(photos.length / PER_PAGE))
  const photoX0 = PROJ_X0 + (projects.length + 1) * PROJ_STEP + 260
  const worldW = photoX0 + pages * PAGE_W + 400

  const stops: Stop[] = []
  stops.push({ id: 'hero', rect: ROOM, side: 'full', hold: 1.2, panel: { kind: 'hero' } })
  stops.push({ id: 'about', nav: 'about', rect: PAINT, side: 'left', hold: 1.6, panel: { kind: 'about' } })
  experiences.forEach((e, i) =>
    stops.push({
      id: `exp-${e.id}`,
      nav: 'experience',
      rect: REGIONS[i] ?? PAINT,
      side: i % 2 === 0 ? 'left' : 'right',
      hold: 1.5,
      panel: { kind: 'experience', index: i },
    }),
  )
  stops.push({
    id: 'projects',
    nav: 'projects',
    rect: { x: PROJ_X0 - 80, y: 60, w: (projects.length + 1) * PROJ_STEP + 120, h: 580 },
    side: 'full',
    hold: 1,
    panel: { kind: 'projectsIntro' },
  })
  projects.forEach((p, i) =>
    stops.push({
      id: `project-${p.id}`,
      nav: 'projects',
      rect: { x: PROJ_X0 + i * PROJ_STEP - 30, y: 110, w: 580, h: 420 },
      side: i % 2 === 0 ? 'left' : 'right',
      hold: 1.5,
      panel: { kind: 'project', index: i },
    }),
  )
  for (let page = 0; page < pages; page++)
    stops.push({
      id: `photos-${page}`,
      nav: 'photos',
      rect: { x: photoX0 + page * PAGE_W - 30, y: 90, w: PAGE_W + 40, h: 640 },
      side: 'full',
      hold: 1.2,
      panel: { kind: 'photos', page },
    })
  stops.push({ id: 'contact', nav: 'contact', rect: SIGNATURE, side: 'left', hold: 1.6, panel: { kind: 'contact' } })

  return { stops, photos, pages, photoX0, worldW }
}

export type Layout = ReturnType<typeof buildLayout>
