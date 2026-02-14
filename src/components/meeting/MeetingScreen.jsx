/**
 * Ortak canlı toplantı ekranı — lobby (oluştur / katıl) + toplantı içi UI.
 * Farklı sayfalarda kullanılır: Dersler (Live), Staj (StajLive) vb. leavePath ile çıkışta nereye gidileceği belirlenir.
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useMeeting, randomRoomCode } from '../../features/meeting/useMeeting'
import { useMeetingRecording } from '../../features/meeting/useMeetingRecording'
import { useMeetingAudioRecording } from '../../features/meeting/useMeetingAudioRecording'
import { VideoTile } from './VideoTile'
import { getDisplayName } from '../../utils/getDisplayName'

async function getServerError(res) {
  try {
    const data = await res.json()
    return data?.error || res.statusText
  } catch {
    return res.statusText
  }
}

async function uploadRecording(blob, metadata) {
  const meetingName = (metadata.meetingName || 'Toplantı').trim()
  const displayName = (metadata.displayName || 'Konuk').trim()
  const recordedAt = metadata.recordedAt || new Date().toISOString()
  const qs = new URLSearchParams({ meetingName, displayName, recordedAt })
  const formData = new FormData()
  formData.append('recording', blob, 'recording.webm')
  const res = await fetch(`/api/recordings?${qs}`, {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) throw new Error(await getServerError(res) || 'Kayıt yüklenemedi')
}

async function uploadMeetingSummary(summaryText, meetingName, recordedAt) {
  const res = await fetch('/api/recordings/summary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ summaryText, meetingName, recordedAt }),
  })
  if (!res.ok) throw new Error(await getServerError(res) || 'Özet yüklenemedi')
}

/** @param {'both'|'create'|'join'} lobbyMode - Lobbide gösterilecek seçenekler */
export default function MeetingScreen({
  title = 'Canlı toplantı',
  subtitle = 'Toplantı oluşturun veya oda kodu ile katılın.',
  leavePath = '/dashboard',
  defaultMeetingName = 'Toplantı',
  lobbyMode = 'both',
  createButtonLabel = 'Toplantı oluştur',
  meetingNamePlaceholder = 'Toplantı adı',
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [roomCodeInput, setRoomCodeInput] = useState('')
  const [meetingNameInput, setMeetingNameInput] = useState('')
  const displayName = getDisplayName()

  useEffect(() => {
    const code = searchParams.get('code') || searchParams.get('join')
    if (code) setRoomCodeInput(String(code).toUpperCase().slice(0, 6))
  }, [searchParams])

  const meeting = useMeeting()
  const {
    roomCode,
    meetingName,
    users,
    myId,
    localStream,
    remoteStreams,
    isMuted,
    isVideoOff,
    isHost,
    createRoom,
    joinRoom,
    leaveRoom,
    endMeetingForAll,
    clearMeetingEnded,
    toggleMute,
    toggleVideo,
    error,
    loading,
    meetingEndedByHost,
    audioInputDevices,
    audioOutputDevices,
    selectedAudioInputId,
    selectedAudioOutputId,
    loadAudioDevices,
    switchAudioInput,
    setSelectedAudioOutput,
    retryCamera,
    getMeetingSummaryText,
  } = meeting

  const fullScreenVideoRef = useRef(null)
  const recordingStartedRef = useRef(false)
  const meetingNameForRecordingRef = useRef('')
  const [showDevicePicker, setShowDevicePicker] = useState(false)
  const devicePickerRef = useRef(null)

  useEffect(() => {
    if (!showDevicePicker) return
    const onOutside = (e) => {
      if (devicePickerRef.current && !devicePickerRef.current.contains(e.target)) setShowDevicePicker(false)
    }
    document.addEventListener('click', onOutside, true)
    return () => document.removeEventListener('click', onOutside, true)
  }, [showDevicePicker])

  useEffect(() => {
    if (!roomCode) return
    if (isHost && meetingNameInput.trim()) {
      meetingNameForRecordingRef.current = meetingNameInput.trim()
    } else if (meetingName && meetingName.trim()) {
      meetingNameForRecordingRef.current = meetingName.trim()
    }
  }, [roomCode, isHost, meetingNameInput, meetingName])

  const getMeetingNameForRecording = () =>
    meetingNameForRecordingRef.current || meetingNameInput?.trim() || meetingName?.trim() || defaultMeetingName

  const handleRecordingStopped = useCallback(async (blob, metadata) => {
    try {
      await uploadRecording(blob, metadata)
    } catch (e) {
      console.warn('Kayıt sunucuya yüklenemedi:', e)
    }
  }, [])

  const { startRecording, stopRecording } = useMeetingRecording({
    localStream,
    remoteStreams,
    users,
    myId,
    roomCode,
    getMeetingNameForRecording,
    displayName,
    onStopped: handleRecordingStopped,
  })

  const { startRecording: startAudioRecording, stopRecording: stopAudioRecording } = useMeetingAudioRecording({
    localStream,
    remoteStreams,
    roomCode,
    isHost,
    getMeetingNameForRecording,
    onStopped: handleRecordingStopped,
  })

  useEffect(() => {
    if (!roomCode || !meeting.roomCode || !localStream) return
    if (recordingStartedRef.current) return
    recordingStartedRef.current = true
    startRecording()
    if (isHost) startAudioRecording()
    return () => {
      recordingStartedRef.current = false
      stopRecording()
      if (isHost) stopAudioRecording()
    }
  }, [roomCode, meeting.roomCode, localStream, isHost, startRecording, stopRecording, startAudioRecording, stopAudioRecording])

  const attachLocalStream = () => {
    const el = fullScreenVideoRef.current
    if (!el || !localStream) return
    if (el.srcObject !== localStream) {
      el.srcObject = localStream
    }
    el.muted = true
    const tryPlay = () => el.play().catch(() => {})
    tryPlay()
    el.onloadedmetadata = tryPlay
    el.onloadeddata = tryPlay
    el.oncanplay = tryPlay
  }

  useEffect(() => {
    if (!localStream) return
    attachLocalStream()
  }, [localStream])

  useEffect(() => {
    if (roomCode && meeting.roomCode) loadAudioDevices()
  }, [roomCode, meeting.roomCode, loadAudioDevices])

  const alone = roomCode && meeting.roomCode ? users.filter((u) => u.id !== myId).length === 0 : false

  useEffect(() => {
    if (alone && localStream) attachLocalStream()
  }, [alone, localStream])

  const handleCreate = async (e) => {
    e?.preventDefault()
    const name = (meetingNameInput || '').trim() || defaultMeetingName
    if (!name) return
    meetingNameForRecordingRef.current = name
    const code = randomRoomCode()
    try {
      await createRoom(code, displayName, name)
      setSearchParams({ join: code })
    } catch (_) {}
  }

  const handleJoin = async (e) => {
    e?.preventDefault()
    if (!roomCodeInput.trim()) return
    try {
      await joinRoom(roomCodeInput.trim(), displayName)
    } catch (_) {}
  }

  const goBack = useCallback(() => {
    setSearchParams({})
    navigate(leavePath, { replace: true })
  }, [leavePath, navigate, setSearchParams])

  const handleLeave = async () => {
    if (isHost) {
      const endTime = new Date().toISOString()
      const summaryText = getMeetingSummaryText(endTime)
      const meetingNameVal = getMeetingNameForRecording()
      if (summaryText) {
        try { await uploadMeetingSummary(summaryText, meetingNameVal, endTime) } catch (e) { console.warn('Özet yüklenemedi:', e) }
      }
    }
    await stopRecording()
    if (isHost) await stopAudioRecording()
    await leaveRoom()
    setRoomCodeInput('')
    goBack()
  }

  if (meetingEndedByHost) {
    return (
      <>
        <header className="page-header animate-enter">
          <h1 className="page-title">{title}</h1>
        </header>
        <div className="card" style={{ maxWidth: 420, margin: '2rem auto', textAlign: 'center', padding: '2rem' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--engagement-high)', color: 'white', fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>✓</div>
          <h2 className="card-title" style={{ marginBottom: '0.5rem' }}>Toplantı sonlandırıldı</h2>
          <p className="summary-text" style={{ marginBottom: '1.5rem' }}>Oda sahibi toplantıyı bitirdi.</p>
          <button type="button" className="btn btn-primary" onClick={async () => { await stopRecording(); if (isHost) await stopAudioRecording(); clearMeetingEnded(); goBack(); }}>
            Tamam
          </button>
        </div>
      </>
    )
  }

  if (roomCode && meeting.roomCode) {
    const myUser = users.find((u) => u.id === myId)
    const myName = myUser?.name || displayName || 'Ben'
    const otherUsers = users.filter((u) => u.id !== myId)
    const otherCount = otherUsers.length
    const aloneView = otherCount === 0

    return (
      <div className="meeting-view-fullscreen">
        <header className="page-header animate-enter meeting-view-fullscreen__header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <h1 className="page-title" style={{ margin: 0 }}>{meetingName} — {roomCode}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="badge" style={{ background: 'var(--color-surface-elevated)', color: 'var(--color-text-secondary)', padding: '0.35rem 0.75rem' }}>
                {users.length} kişi
              </span>
            </div>
          </div>
        </header>

        {error && (
          <div className="card meeting-view-fullscreen__error" style={{ padding: '1rem', borderLeft: '4px solid var(--frustration)', background: 'rgba(248,113,113,0.1)' }}>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--frustration)', whiteSpace: error.startsWith('KAMERA_HTTP_BLOKE|') ? 'pre-line' : 'normal' }}>
              {error.startsWith('KAMERA_HTTP_BLOKE|') ? error.slice('KAMERA_HTTP_BLOKE|'.length) : error}
            </p>
          </div>
        )}

        <div className="card live-stage-card meeting-view-fullscreen__stage">
          <div className="live-stage meeting-view-fullscreen__stage-inner">
            {aloneView ? (
              <>
                {localStream ? (
                  <div className="live-stage-self">
                    <video
                      ref={fullScreenVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="live-stage-self-video"
                      onLoadedMetadata={attachLocalStream}
                      onCanPlay={() => fullScreenVideoRef.current?.play().catch(() => {})}
                    />
                    <span className="live-stage-self-label">{myName}</span>
                    <span className="live-stage-live-badge">CANLI</span>
                  </div>
                ) : error ? (
                  <div className="live-stage-loading" style={{ flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(248,113,113,0.2)', color: 'var(--frustration)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>⚠</div>
                    <p className="live-stage-loading-text" style={{ color: 'var(--frustration)' }}>
                      {/Permission|izin|NotAllowed|reddedildi/i.test(error) ? 'Kamera ve mikrofon izni reddedildi' : error}
                    </p>
                    <p className="live-stage-loading-hint" style={{ fontSize: '0.8125rem', maxWidth: 320, textAlign: 'center' }}>
                      Tarayıcı izin penceresinde &quot;İzin ver&quot; seçin, ardından tekrar deneyin.
                    </p>
                    <button type="button" className="btn btn-primary" onClick={() => retryCamera().catch(() => {})}>
                      Tekrar dene
                    </button>
                  </div>
                ) : (
                  <div className="live-stage-loading">
                    <div className="live-stage-loading-icon" aria-hidden>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 7l-7 5 7 5V7z" />
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                      </svg>
                    </div>
                    <p className="live-stage-loading-text">Kamera açılıyor…</p>
                    <p className="live-stage-loading-hint">Tarayıcı kamera izni isterse izin verin</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div
                  className="live-stage-grid"
                  style={{
                    gridTemplateColumns: otherCount <= 1 ? '1fr' : 'repeat(2, 1fr)',
                    gridTemplateRows: otherCount <= 2 ? '1fr' : 'repeat(2, 1fr)',
                  }}
                >
                  {otherUsers.map((u) =>
                    remoteStreams[u.id] ? (
                      <VideoTile key={u.id} stream={remoteStreams[u.id]} label={u.name} isMe={false} sinkId={selectedAudioOutputId || undefined} />
                    ) : (
                      <div key={u.id} className="live-stage-cell live-stage-loading live-stage-loading--cell">
                        <span className="live-stage-loading-text">{u.name}</span>
                        <span className="live-stage-loading-hint">bağlanıyor…</span>
                      </div>
                    )
                  )}
                </div>
                {localStream ? (
                  <div className="live-stage-pip">
                    <VideoTile stream={localStream} label={myName} isMe small />
                  </div>
                ) : error ? (
                  <div className="live-stage-pip live-stage-loading live-stage-loading--pip" style={{ flexDirection: 'column', gap: '0.5rem', padding: '0.75rem' }}>
                    <span className="live-stage-loading-text" style={{ color: 'var(--frustration)', fontSize: '0.8125rem' }}>İzin reddedildi</span>
                    <button type="button" className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem' }} onClick={() => retryCamera().catch(() => {})}>
                      Tekrar dene
                    </button>
                  </div>
                ) : (
                  <div className="live-stage-pip live-stage-loading live-stage-loading--pip">
                    <span className="live-stage-loading-text">Kamera açılıyor…</span>
                  </div>
                )}
                <span className="live-stage-live-badge live-stage-live-badge--top">CANLI</span>
              </>
            )}
          </div>
        </div>

        <div className="card live-controls-card meeting-view-fullscreen__controls">
          <div className="live-controls">
            <div ref={devicePickerRef} className="live-control-audio-wrap">
              <button
                type="button"
                className={`live-control-btn live-control-btn--audio ${!isMuted ? 'live-control-btn--on' : ''}`}
                onClick={toggleMute}
                title={isMuted ? 'Sesi aç' : 'Sesi kapat'}
              >
                <span
                  className="live-control-arrow-trigger"
                  onClick={(e) => { e.stopPropagation(); setShowDevicePicker((v) => !v); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); setShowDevicePicker((v) => !v); } }}
                  role="button"
                  tabIndex={0}
                  title="Ses cihazlarını seç"
                >
                  ▼
                </span>
                <span className="live-control-icon" aria-hidden>{isMuted ? '🔇' : '🎤'}</span>
                <span className="live-control-label">{isMuted ? 'Ses kapalı' : 'Ses açık'}</span>
              </button>
              {showDevicePicker && (
                <div className="card live-device-picker">
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Mikrofon</p>
                  <select
                    className="search-input"
                    value={selectedAudioInputId}
                    onChange={(e) => switchAudioInput(e.target.value)}
                    style={{ width: '100%', marginBottom: '0.75rem', fontSize: '0.875rem' }}
                  >
                    {audioInputDevices.map((d) => (
                      <option key={d.deviceId} value={d.deviceId}>
                        {d.label || `Mikrofon ${d.deviceId.slice(0, 8)}`}
                      </option>
                    ))}
                  </select>
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Hoparlör / Kulaklık</p>
                  <select
                    className="search-input"
                    value={selectedAudioOutputId}
                    onChange={(e) => setSelectedAudioOutput(e.target.value)}
                    style={{ width: '100%', fontSize: '0.875rem' }}
                  >
                    {audioOutputDevices.map((d) => (
                      <option key={d.deviceId} value={d.deviceId}>
                        {d.label || `Çıkış ${d.deviceId.slice(0, 8)}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <button
              type="button"
              className={`live-control-btn ${!isVideoOff ? 'live-control-btn--on' : ''}`}
              onClick={toggleVideo}
              title={isVideoOff ? 'Kamerayı aç' : 'Kamerayı kapat'}
            >
              <span className="live-control-icon" aria-hidden>{isVideoOff ? '📷' : '📹'}</span>
              <span className="live-control-label">{isVideoOff ? 'Kamera kapalı' : 'Kamera açık'}</span>
            </button>
            {isHost && (
              <button type="button" className="live-control-btn live-control-btn--end" onClick={async () => {
                const endTime = new Date().toISOString()
                const summaryText = getMeetingSummaryText(endTime)
                const meetingNameVal = getMeetingNameForRecording()
                if (summaryText) {
                  try { await uploadMeetingSummary(summaryText, meetingNameVal, endTime) } catch (e) { console.warn('Özet yüklenemedi:', e) }
                }
                await stopAudioRecording()
                endMeetingForAll()
              }} title="Toplantıyı herkes için bitir">
                <span className="live-control-icon" aria-hidden>⏹</span>
                <span className="live-control-label">Toplantıyı bitir</span>
              </button>
            )}
            <button type="button" className="live-control-btn live-control-btn--leave" onClick={handleLeave} title="Toplantıdan çık">
              <span className="live-control-icon" aria-hidden>📞</span>
              <span className="live-control-label">Çık</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  const showCreate = lobbyMode === 'both' || lobbyMode === 'create'
  const showJoin = lobbyMode === 'both' || lobbyMode === 'join'

  return (
    <>
      <header className="page-header animate-enter">
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </header>

      <div className="card" style={{ maxWidth: 440, margin: '0 auto' }}>
        <div className="card-body">
          <p className="summary-text" style={{ marginBottom: '1.25rem' }}>
            <strong>{displayName}</strong> olarak giriş yaptınız. Toplantıda bu isim görünecek.
          </p>

          {error && (
            <div style={{ marginBottom: '1rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(248,113,113,0.15)', color: 'var(--frustration)', fontSize: '0.875rem', whiteSpace: error.startsWith('KAMERA_HTTP_BLOKE|') ? 'pre-line' : 'normal' }}>
              {error.startsWith('KAMERA_HTTP_BLOKE|') ? error.slice('KAMERA_HTTP_BLOKE|'.length) : error}
            </div>
          )}

          {showCreate && (
            <form onSubmit={handleCreate} style={{ marginBottom: showJoin ? '1.5rem' : 0 }}>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="meetingName" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.35rem', color: 'var(--color-text-secondary)' }}>Toplantı adı</label>
                <input
                  type="text"
                  id="meetingName"
                  className="search-input"
                  placeholder={meetingNamePlaceholder}
                  value={meetingNameInput}
                  onChange={(e) => setMeetingNameInput(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading || !(meetingNameInput || '').trim()}>
                {loading ? 'Açılıyor…' : createButtonLabel}
              </button>
            </form>
          )}

          {showJoin && (
            <>
              {showCreate && <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-soft)', margin: '1rem 0' }} />}
              <form onSubmit={handleJoin} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Oda kodu (örn. ABC123)"
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase().slice(0, 6))}
                  maxLength={6}
                  style={{ flex: 1, minWidth: 120 }}
                />
                <button type="submit" className="btn btn-primary" disabled={loading || !roomCodeInput.trim()}>
                  {loading ? 'Katılıyor…' : 'Katıl'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  )
}
