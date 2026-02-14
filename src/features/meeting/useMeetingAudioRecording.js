import { useCallback, useRef, useEffect } from 'react'

export function useMeetingAudioRecording({
  localStream,
  remoteStreams,
  roomCode,
  isHost,
  getMeetingNameForRecording,
  onStopped,
}) {
  const audioContextRef = useRef(null)
  const destRef = useRef(null)
  const sourcesRef = useRef(new Map())
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const stopResolveRef = useRef(null)
  const dataRef = useRef({ localStream, remoteStreams, roomCode, getMeetingNameForRecording })

  useEffect(() => {
    dataRef.current = { localStream, remoteStreams, roomCode, getMeetingNameForRecording }
  }, [localStream, remoteStreams, roomCode, getMeetingNameForRecording])

  const startRecording = useCallback(() => {
    if (!localStream || !roomCode || !isHost) return
    if (mediaRecorderRef.current) return

    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    audioContextRef.current = ctx
    const dest = ctx.createMediaStreamDestination()
    destRef.current = dest
    sourcesRef.current = new Map()

    const addStream = (stream, key) => {
      if (!stream) return
      const audioTrack = stream.getAudioTracks()[0]
      if (!audioTrack) return
      try {
        const src = ctx.createMediaStreamSource(new MediaStream([audioTrack]))
        src.connect(dest)
        sourcesRef.current.set(key, src)
      } catch (_) {}
    }

    addStream(localStream, 'local')
    const remotes = dataRef.current.remoteStreams || {}
    Object.entries(remotes).forEach(([id, stream]) => addStream(stream, `remote-${id}`))

    const mimeType = MediaRecorder.isTypeSupported('audio/webm')
      ? 'audio/webm'
      : MediaRecorder.isTypeSupported('video/webm;codecs=opus')
        ? 'video/webm;codecs=opus'
        : 'video/webm'
    const recorder = new MediaRecorder(dest.stream, {
      mimeType,
      audioBitsPerSecond: 128000,
    })
    chunksRef.current = []
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data)
    }
    recorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: mimeType })
      const meta = dataRef.current
      const meetingName = (typeof meta.getMeetingNameForRecording === 'function')
        ? meta.getMeetingNameForRecording()
        : 'Toplantı'
      const metadata = {
        meetingName: meetingName || 'Toplantı',
        displayName: 'toplanti_sesi',
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
  }, [localStream, roomCode, isHost, onStopped])

  useEffect(() => {
    const ctx = audioContextRef.current
    const dest = destRef.current
    const recorder = mediaRecorderRef.current
    if (!isHost || !ctx || !dest || !recorder || recorder.state !== 'recording') return

    const currentRemotes = new Set(Object.keys(remoteStreams || {}))
    sourcesRef.current.forEach((src, key) => {
      if (key.startsWith('remote-')) {
        const id = key.replace('remote-', '')
        if (!currentRemotes.has(id)) {
          try { src.disconnect() } catch (_) {}
          sourcesRef.current.delete(key)
        }
      }
    })
    currentRemotes.forEach((id) => {
      const stream = remoteStreams[id]
      const key = `remote-${id}`
      if (stream && !sourcesRef.current.has(key)) {
        try {
          const audioTrack = stream.getAudioTracks()[0]
          if (!audioTrack) return
          const src = ctx.createMediaStreamSource(new MediaStream([audioTrack]))
          src.connect(dest)
          sourcesRef.current.set(key, src)
        } catch (_) {}
      }
    })
  }, [isHost, remoteStreams])

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current
    if (recorder && recorder.state !== 'inactive') {
      const p = Promise.race([
        new Promise((resolve) => { stopResolveRef.current = resolve }),
        new Promise((r) => setTimeout(r, 15000)),
      ])
      recorder.stop()
      mediaRecorderRef.current = null
      destRef.current = null
      sourcesRef.current.forEach((src) => { try { src.disconnect() } catch (_) {} })
      sourcesRef.current.clear()
      if (audioContextRef.current) audioContextRef.current.close().catch(() => {})
      audioContextRef.current = null
      return p
    }
    return Promise.resolve()
  }, [])

  useEffect(() => {
    return () => stopRecording()
  }, [stopRecording])

  return { startRecording, stopRecording }
}
