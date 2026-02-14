/**
 * Toplantı kayıt özet metnini üretir
 */
export function buildMeetingSummaryText(log, users, meetingName, endTimeOverride) {
  if (!log || !log.startTime) return ''
  const start = new Date(log.startTime)
  const end = endTimeOverride ? new Date(endTimeOverride) : (log.endTime ? new Date(log.endTime) : new Date())
  const effectiveEnd = end.toISOString()
  const fmt = (d) => d.toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'medium' })
  const fmtTime = (d) => d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  const fmtDuration = (ms) => {
    const mins = Math.floor(ms / 60000)
    const hours = Math.floor(mins / 60)
    const remainMins = mins % 60
    const secs = Math.floor((ms % 60000) / 1000)
    if (hours > 0) return `${hours} saat ${remainMins} dakika`
    if (mins > 0) return `${mins} dakika ${secs} saniye`
    return `${secs} saniye`
  }
  const durMs = end - start
  const durationStr = fmtDuration(durMs)

  const userMap = new Map((users || []).map((u) => [u.id, u.name || 'Konuk']))
  const events = (log.events || []).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

  const joinTimes = new Map()
  const leaveTimes = new Map()
  const videoEvents = []
  const muteEvents = []

  for (const e of events) {
    const userName = e.userName || userMap.get(e.userId) || 'Bilinmeyen'
    if (e.type === 'join') {
      joinTimes.set(e.userId, { userName, time: e.timestamp })
    } else if (e.type === 'leave') {
      leaveTimes.set(e.userId, e.timestamp)
    } else if (e.type === 'video') {
      videoEvents.push({ userId: e.userId, userName, enabled: e.enabled, time: e.timestamp })
    } else if (e.type === 'mute') {
      muteEvents.push({ userId: e.userId, userName, enabled: e.enabled, time: e.timestamp })
    }
  }

  const allUserIds = new Set([...joinTimes.keys(), ...(users || []).map((u) => u.id)])
  const participantList = [...allUserIds]
    .map((id) => ({ id, name: joinTimes.get(id)?.userName || userMap.get(id) || 'Bilinmeyen' }))
    .filter((p) => p.name)

  const buildIntervalGroups = (evts, userId, joinT, leaveT, defaultOn) => {
    const userEvts = evts.filter((e) => e.userId === userId).sort((a, b) => new Date(a.time) - new Date(b.time))
    const t0 = joinT || log.startTime
    const tEnd = leaveT || effectiveEnd
    const acik = []
    const kapali = []
    if (userEvts.length === 0) {
      if (defaultOn) acik.push({ start: t0, end: tEnd })
      else kapali.push({ start: t0, end: tEnd })
    } else {
      let prevT = t0
      let prevOn = defaultOn
      for (const e of userEvts) {
        if (prevOn !== undefined && prevT !== e.time) {
          if (prevOn) acik.push({ start: prevT, end: e.time })
          else kapali.push({ start: prevT, end: e.time })
        }
        prevT = e.time
        prevOn = e.enabled
      }
      if (prevOn !== undefined && prevT !== tEnd) {
        if (prevOn) acik.push({ start: prevT, end: tEnd })
        else kapali.push({ start: prevT, end: tEnd })
      }
    }
    const fmtRange = (r) => `${fmtTime(new Date(r.start))} - ${fmtTime(new Date(r.end))}`
    return {
      acik: acik.map(fmtRange).join(', '),
      kapali: kapali.map(fmtRange).join(', '),
    }
  }

  let text = `TOPLANTI ÖZETİ\n`
  text += `${'='.repeat(50)}\n\n`
  text += `Toplantı adı: ${meetingName || 'Toplantı'}\n`
  text += `Başlangıç: ${fmt(start)}\n`
  text += `Bitiş: ${fmt(end)}\n`
  text += `Süre: ${durationStr}\n\n`
  text += `Katılımcılar (${participantList.length} kişi):\n`
  participantList.forEach((p) => {
    text += `  - ${p.name}\n`
  })
  text += `\n`

  participantList.forEach((p) => {
    const joinT = joinTimes.get(p.id)?.time || log.startTime
    const leaveT = leaveTimes.get(p.id) || effectiveEnd
    const joinDate = new Date(joinT)
    const leaveDate = new Date(leaveT)
    const stayMs = leaveDate - joinDate
    const kamera = buildIntervalGroups(videoEvents, p.id, joinT, leaveT, true)
    const mikrofon = buildIntervalGroups(muteEvents, p.id, joinT, leaveT, true)
    text += `${p.name}:\n`
    text += `  Katılım: ${fmtTime(joinDate)} (${fmtDuration(stayMs)} toplantıda kaldı)\n`
    text += `  Kamera:\n`
    if (kamera.acik) text += `    Açık: ${kamera.acik}\n`
    if (kamera.kapali) text += `    Kapalı: ${kamera.kapali}\n`
    if (!kamera.acik && !kamera.kapali) text += `    - (veri yok)\n`
    text += `  Mikrofon:\n`
    if (mikrofon.acik) text += `    Açık: ${mikrofon.acik}\n`
    if (mikrofon.kapali) text += `    Kapalı: ${mikrofon.kapali}\n`
    if (!mikrofon.acik && !mikrofon.kapali) text += `    - (veri yok)\n`
    text += `\n`
  })

  return text.trim()
}
