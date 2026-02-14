import { useCallback, useRef, useEffect } from 'react'

const RECORDING_WIDTH = 1280
const RECORDING_HEIGHT = 720
const RECORDING_FPS = 15

export function useMeetingRecording({
  localStream,
  remoteStreams,
  users,
  myId,
  roomCode,
  getMeetingNameForRecording,
  displayName,
  onStopped,
}) {
  const canvasRef = useRef(null)
  const videoElsRef = useRef({})
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const rafRef = useRef(null)
  const stopResolveRef = useRef(null)
  const dataRef = useRef({ localStream, remoteStreams, users, myId, getMeetingNameForRecording, displayName })

  useEffect(() => {
    dataRef.current = { localStream, remoteStreams, users, myId, getMeetingNameForRecording, displayName }
  }, [localStream, remoteStreams, users, myId, getMeetingNameForRecording, displayName])

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const { localStream: ls } = dataRef.current
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, RECORDING_WIDTH, RECORDING_HEIGHT)

    const localVid = videoElsRef.current.local
    if (localVid && ls) {
      const vTrack = ls.getVideoTracks()[0]
      if (vTrack?.enabled && (localVid.paused || localVid.readyState < 2)) {
        localVid.srcObject = ls
        localVid.play().catch(() => {})
      }
    }

    const vt = ls?.getVideoTracks()[0]
    const videoEnabled = vt?.enabled
    const vid = videoElsRef.current.local
    const canDrawLocal = vid && videoEnabled && vid.readyState >= 2

    // Her kayıtta sadece kullanıcının kendisi; karşı taraf yok
    if (canDrawLocal) {
      try { ctx.drawImage(vid, 0, 0, RECORDING_WIDTH, RECORDING_HEIGHT) } catch (_) {}
    } else if (vid && !videoEnabled) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)'
      ctx.fillRect(RECORDING_WIDTH / 2 - 120, RECORDING_HEIGHT / 2 - 24, 240, 48)
      ctx.fillStyle = '#fff'
      ctx.font = '20px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Kamera kapalı', RECORDING_WIDTH / 2, RECORDING_HEIGHT / 2 + 6)
      ctx.textAlign = 'left'
    }
  }, [])

  const startRecording = useCallback(() => {
    if (!localStream || !roomCode) return
    if (canvasRef.current) return

    const canvas = document.createElement('canvas')
    canvas.width = RECORDING_WIDTH
    canvas.height = RECORDING_HEIGHT
    canvasRef.current = canvas

    const localVid = document.createElement('video')
    localVid.srcObject = localStream
    localVid.muted = true
    localVid.autoplay = true
    localVid.playsInline = true
    localVid.play().catch(() => {})
    videoElsRef.current.local = localVid

    chunksRef.current = []
    const stream = canvas.captureStream(RECORDING_FPS)
    // Sadece görüntü; ses toplanti_sesi.webm'de tutuluyor

    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm'
    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 2500000,
    })
    const stopResolveRef = { resolve: null }
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data)
    }
    recorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: mimeType })
      const meta = dataRef.current
      const metaUser = meta.users?.find((x) => x.id === meta.myId)
      const meetingName = (typeof meta.getMeetingNameForRecording === 'function')
        ? meta.getMeetingNameForRecording()
        : 'Toplantı'
      const metadata = {
        roomCode,
        meetingName: meetingName || 'Toplantı',
        displayName: metaUser?.name || meta.displayName || 'Konuk',
        recordedAt: new Date().toISOString(),
      }
      try {
        await onStopped?.(blob, metadata)
      } finally {
        stopResolveRef.current?.()
      }
    }
    recorder.start(1000)
    mediaRecorderRef.current = recorder

    const tick = () => {
      drawFrame()
      rafRef.current = requestAnimationFrame(tick)
    }
    tick()
  }, [localStream, roomCode, drawFrame, onStopped])

  const stopRecording = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    const recorder = mediaRecorderRef.current
    if (recorder && recorder.state !== 'inactive') {
      const p = Promise.race([
        new Promise((resolve) => { stopResolveRef.current = resolve }),
        new Promise((r) => setTimeout(r, 15000)),
      ])
      recorder.stop()
      mediaRecorderRef.current = null
      Object.values(videoElsRef.current).forEach((v) => {
        if (v && v.srcObject) v.srcObject = null
      })
      videoElsRef.current = {}
      canvasRef.current = null
      return p
    }
    Object.values(videoElsRef.current).forEach((v) => {
      if (v && v.srcObject) v.srcObject = null
    })
    videoElsRef.current = {}
    canvasRef.current = null
    return Promise.resolve()
  }, [])

  useEffect(() => {
    return () => stopRecording()
  }, [stopRecording])

  return { startRecording, stopRecording }
}
