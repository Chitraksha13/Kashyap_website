export const ROOMS = [
  { id: 'entrance', label: 'Entrance' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'photos', label: 'Photos' },
]

// Frame proportions for the project pieces, shared by the wall and the project overlay.
export const PROJECT_RATIOS = [1.3, 1.1, 1.2, 0.9]

// Project frames wrap their image exactly: a black frame (0.8vh) plus a mat (2.4vh) on every side.
const FRAME_PAD = 6.4
// Wall size for a project's frame, given its image's width / height. Every piece is centred on the wall.
export function wallFrame(imageRatio: number) {
  const ih = Math.min(36, 56 / imageRatio)
  return { ratio: (imageRatio * ih + FRAME_PAD) / (ih + FRAME_PAD), h: ih + FRAME_PAD }
}
