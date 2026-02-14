import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../config/routes'

const VIDEO_KARSILAMA2 = '/Karsilama/Karsimala2.mov'
const VIDEO_FALLBACK = '/Karsilama/Karsilama3.mp4'

export default function WelcomeIntro() {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const [src, setSrc] = useState(VIDEO_KARSILAMA2)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const handleEnded = () => navigate(ROUTES.DASHBOARD, { replace: true })
    v.addEventListener('ended', handleEnded)
    return () => v.removeEventListener('ended', handleEnded)
  }, [navigate])

  const tryPlay = () => {
    const v = videoRef.current
    if (!v) return
    const p = v.play()
    if (p && typeof p.catch === 'function') p.catch(() => {})
  }

  const onError = () => {
    if (src === VIDEO_KARSILAMA2) setSrc(VIDEO_FALLBACK)
  }

  return (
    <div className="intro-page">
      <video
        key={src}
        ref={videoRef}
        className="intro-video"
        src={src}
        autoPlay
        playsInline
        muted
        preload="auto"
        onLoadedData={tryPlay}
        onCanPlay={tryPlay}
        onError={onError}
      />
    </div>
  )
}
