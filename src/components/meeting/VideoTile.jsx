import { useEffect, useRef } from 'react'

export function VideoTile({ stream, label, isMe, small, sinkId }) {
  const ref = useRef(null)

  const attachStream = () => {
    if (!ref.current || !stream) return
    if (ref.current.srcObject === stream) {
      ref.current.play().catch(() => {})
      return
    }
    ref.current.srcObject = stream
    ref.current.play().catch(() => {})
  }

  useEffect(() => {
    attachStream()
  }, [stream])

  useEffect(() => {
    const el = ref.current
    if (!el || !sinkId || typeof el.setSinkId !== 'function') return
    el.setSinkId(sinkId).catch(() => {})
  }, [sinkId])

  if (!stream) return null

  return (
    <div className={`live-video-tile ${small ? 'live-video-tile--pip' : ''}`}>
      <video
        ref={ref}
        autoPlay
        playsInline
        muted={isMe}
        className="live-video-tile-video"
        onLoadedMetadata={attachStream}
        onCanPlay={() => ref.current?.play().catch(() => {})}
      />
      <span className={`live-video-tile-label ${isMe ? 'live-video-tile-label-me' : ''}`}>{label}</span>
    </div>
  )
}
