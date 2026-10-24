import { useEffect } from 'react'

type Props = { images: string[]; index: number; onChange: (i: number) => void; onClose: () => void }

export function Lightbox({ images, index, onChange, onClose }: Props) {
  const n = images.length
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onChange((index + 1) % n)
      if (e.key === 'ArrowLeft') onChange((index - 1 + n) % n)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, n, onChange, onClose])

  return (
    <div className="lightbox" onClick={onClose} role="dialog" aria-modal="true">
      <img src={images[index]} alt="" onClick={(e) => e.stopPropagation()} />
      {n > 1 && (
        <>
          <button className="lb-btn lb-prev" onClick={(e) => { e.stopPropagation(); onChange((index - 1 + n) % n) }} aria-label="Previous">‹</button>
          <button className="lb-btn lb-next" onClick={(e) => { e.stopPropagation(); onChange((index + 1) % n) }} aria-label="Next">›</button>
        </>
      )}
      <button className="lb-btn lb-close" onClick={onClose} aria-label="Close">×</button>
    </div>
  )
}
