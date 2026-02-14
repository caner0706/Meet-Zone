import { useState, useCallback, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { buildMeetingSummaryText } from './meetingLogUtils'

const SOCKET_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_WS_URL || 'http://localhost:3001')

export function useMeeting() {
  const [roomCode, setRoomCode] = useState('')
  const [users, setUsers] = useState([])
  const [localStream, setLocalStream] = useState(null)
  const [remoteStreams, setRemoteStreams] = useState({})
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [myId, setMyId] = useState(null)
  const [isHost, setIsHost] = useState(false)
  const [meetingEndedByHost, setMeetingEndedByHost] = useState(false)
  const [meetingName, setMeetingName] = useState('')
  const [audioInputDevices, setAudioInputDevices] = useState([])
  const [audioOutputDevices, setAudioOutputDevices] = useState([])
  const [selectedAudioInputId, setSelectedAudioInputId] = useState('')
  const [selectedAudioOutputId, setSelectedAudioOutputId] = useState('')

  const socketRef = useRef(null)
  const peersRef = useRef({})
  const localStreamRef = useRef(null)
  const localStreamPromiseRef = useRef(null)
  const iceQueueRef = useRef({})
  const iceRestartTimeoutRef = useRef({})
  const iceRestartAttemptedRef = useRef({})
  const meetingLogRef = useRef({ startTime: null, endTime: null, events: [] })
  const myUserNameRef = useRef('Konuk')

  const getLocalStream = useCallback(async () => {
    if (localStreamPromiseRef.current) return localStreamPromiseRef.current
    const run = async () => {
      if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
        const origin = typeof location !== 'undefined' ? location.origin : ''
        throw new Error(
          'KAMERA_HTTP_BLOKE|Kamera bu adreste (HTTP) kullanılamıyor. Chrome\'da açmak için:\n' +
          '1. Yeni sekmede chrome://flags yazın\n' +
          '2. "Insecure origins treated as secure" arayın\n' +
          '3. Açılan kutuya şu adresi yapıştırın: ' + origin + '\n' +
          '4. "Enabled" seçin, altta "Relaunch" ile Chrome\'u yeniden başlatın\n' +
          '5. Bu toplantı linkini tekrar açın.'
        )
      }
      const constraints = {
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      }
      let stream
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints)
      } catch (e) {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      }
      stream.getVideoTracks().forEach((t) => { t.enabled = true })
      localStreamRef.current = stream
      setLocalStream(stream)
      return stream
    }
    localStreamPromiseRef.current = run()
    return localStreamPromiseRef.current
  }, [])

  const retryCamera = useCallback(async () => {
    setError(null)
    localStreamPromiseRef.current = null
    try {
      return await getLocalStream()
    } catch (e) {
      setError(e.message || 'Kamera/mikrofon erişilemedi')
      throw e
    }
  }, [getLocalStream])

  const drainIceQueue = useCallback(async (remoteId) => {
    const pc = peersRef.current[remoteId]
    const queue = iceQueueRef.current[remoteId]
    if (!pc || !queue || queue.length === 0) return
    iceQueueRef.current[remoteId] = []
    for (const c of queue) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(c))
      } catch (err) {
        console.warn('ICE candidate eklenemedi:', err)
      }
    }
  }, [])

  const addIceCandidateSafe = useCallback(async (remoteId, candidate) => {
    const pc = peersRef.current[remoteId]
    if (!pc) return
    if (pc.remoteDescription) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate))
      } catch (err) {
        console.warn('ICE candidate eklenemedi:', err)
      }
    } else {
      if (!iceQueueRef.current[remoteId]) iceQueueRef.current[remoteId] = []
      iceQueueRef.current[remoteId].push(candidate)
    }
  }, [])

  const setVideoSendParams = useCallback((pc) => {
    try {
      pc.getSenders().forEach((sender) => {
        if (sender.track && sender.track.kind === 'video') {
          const params = sender.getParameters()
          if (!params.encodings) params.encodings = [{}]
          params.degradationPreference = 'maintain-framerate'
          sender.setParameters(params).catch(() => {})
        }
      })
    } catch (_) {}
  }, [])

  const tryIceRestart = useCallback((remoteId) => {
    const pc = peersRef.current[remoteId]
    if (!pc || pc.connectionState === 'closed' || pc.signalingState === 'closed') return
    pc.createOffer({ iceRestart: true })
      .then((offer) => pc.setLocalDescription(offer))
      .then(() => {
        setVideoSendParams(pc)
        if (socketRef.current)
          socketRef.current.emit('webrtc-offer', { to: remoteId, offer: pc.localDescription })
      })
      .catch(() => {})
  }, [setVideoSendParams])

  const createPeer = useCallback((remoteId) => {
    if (peersRef.current[remoteId]) return peersRef.current[remoteId]
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
      ],
      iceCandidatePoolSize: 10,
      bundlePolicy: 'max-bundle',
    })
    peersRef.current[remoteId] = pc

    const removeRemoteUser = () => {
      const p = peersRef.current[remoteId]
      if (!p) return
      p.close()
      delete peersRef.current[remoteId]
      clearTimeout(iceRestartTimeoutRef.current[remoteId])
      delete iceRestartTimeoutRef.current[remoteId]
      delete iceRestartAttemptedRef.current[remoteId]
      delete iceQueueRef.current[remoteId]
      setRemoteStreams((prev) => {
        const next = { ...prev }
        delete next[remoteId]
        return next
      })
      setUsers((prev) => prev.filter((u) => u.id !== remoteId))
    }

    pc.ontrack = (e) => {
      let newStream = e.streams?.[0] || e.stream
      if (!newStream && e.track) newStream = new MediaStream([e.track])
      if (!newStream) return
      newStream.getTracks().forEach((track) => {
        track.onended = removeRemoteUser
      })
      setRemoteStreams((prev) => {
        const existing = prev[remoteId]
        if (existing === newStream) return prev
        return { ...prev, [remoteId]: newStream }
      })
    }
    pc.onicecandidate = (e) => {
      if (e.candidate && socketRef.current)
        socketRef.current.emit('webrtc-ice', { to: remoteId, candidate: e.candidate })
    }
    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
        clearTimeout(iceRestartTimeoutRef.current[remoteId])
        delete iceRestartTimeoutRef.current[remoteId]
        iceRestartAttemptedRef.current[remoteId] = false
      } else if (pc.iceConnectionState === 'disconnected' && !iceRestartAttemptedRef.current[remoteId]) {
        iceRestartAttemptedRef.current[remoteId] = true
        iceRestartTimeoutRef.current[remoteId] = setTimeout(() => {
          removeRemoteUser()
        }, 300)
      }
    }
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
        removeRemoteUser()
      }
    }
    return pc
  }, [tryIceRestart])

  const leaveRoom = useCallback((endedByHost = false) => {
    if (meetingLogRef.current && !meetingLogRef.current.endTime) {
      meetingLogRef.current.endTime = new Date().toISOString()
    }
    const doCleanup = () => {
      Object.values(peersRef.current).forEach((pc) => pc.close())
      peersRef.current = {}
      iceQueueRef.current = {}
      iceRestartTimeoutRef.current = {}
      iceRestartAttemptedRef.current = {}
      localStreamRef.current?.getTracks().forEach((t) => t.stop())
      localStreamRef.current = null
      localStreamPromiseRef.current = null
      setRoomCode('')
      setMeetingName('')
      setUsers([])
      setLocalStream(null)
      setRemoteStreams({})
      setMyId(null)
      setIsHost(false)
      setMeetingEndedByHost(endedByHost)
    }
    const socket = socketRef.current
    socketRef.current = null
    if (socket) {
      socket.emit('leaving-room')
      socket.disconnect()
      return new Promise((resolve) => {
        let done = false
        const finish = () => {
          if (done) return
          done = true
          doCleanup()
          resolve()
        }
        socket.once('disconnect', finish)
        setTimeout(finish, 2000)
      })
    }
    doCleanup()
    return Promise.resolve()
  }, [])

  const clearMeetingEnded = useCallback(() => {
    setMeetingEndedByHost(false)
  }, [])

  const createRoom = useCallback(
    (code, userName, meetingName = 'Toplantı') => {
      setError(null)
      setLoading(true)
      return new Promise((resolve, reject) => {
        try {
          const socket = io(SOCKET_URL, { path: '/socket.io', transports: ['websocket', 'polling'] })
          socketRef.current = socket

          socket.on('room-created', async ({ roomCode: rc, userId, meetingName: mn }) => {
            myUserNameRef.current = (userName || '').trim() || 'Konuk'
            meetingLogRef.current = {
              startTime: new Date().toISOString(),
              endTime: null,
              events: [{ type: 'join', userId, userName: myUserNameRef.current, timestamp: new Date().toISOString() }],
            }
            setRoomCode(rc)
            setMyId(userId)
            setIsHost(true)
            setMeetingName(mn || 'Toplantı')
            setLoading(false)
            resolve()
            getLocalStream()
              .then((stream) => {
                Object.keys(peersRef.current).forEach((remoteId) => {
                  const pc = peersRef.current[remoteId]
                  if (pc && pc.signalingState !== 'closed' && stream) {
                    const hasTrack = pc.getSenders().some((s) => s.track)
                    if (!hasTrack) {
                      stream.getTracks().forEach((t) => pc.addTrack(t, stream))
                      pc.createOffer().then((o) => pc.setLocalDescription(o)).then(() => {
                        setVideoSendParams(pc)
                        if (socketRef.current)
                          socketRef.current.emit('webrtc-offer', { to: remoteId, offer: pc.localDescription })
                      })
                    }
                  }
                })
              })
              .catch((err) => setError(err.message || 'Kamera/mikrofon erişilemedi'))
          })
          socket.on('room-error', ({ message }) => {
            setError(message)
            setLoading(false)
            reject(new Error(message))
          })
          socket.on('user-list', (list) => {
            setUsers(list || [])
            const ids = new Set((list || []).map((u) => u.id))
            setRemoteStreams((prev) => {
              const next = { ...prev }
              for (const id of Object.keys(next)) {
                if (!ids.has(id)) delete next[id]
              }
              return next
            })
            for (const id of Object.keys(peersRef.current)) {
              if (!ids.has(id)) {
                const pc = peersRef.current[id]
                if (pc) pc.close()
                delete peersRef.current[id]
                clearTimeout(iceRestartTimeoutRef.current[id])
                delete iceRestartTimeoutRef.current[id]
                delete iceRestartAttemptedRef.current[id]
                delete iceQueueRef.current[id]
              }
            }
          })
          socket.on('user-joined', async ({ userId, userName }) => {
            meetingLogRef.current.events.push({ type: 'join', userId, userName: userName || 'Konuk', timestamp: new Date().toISOString() })
            setUsers((prev) => {
              const has = prev.find((u) => u.id === userId)
              if (has) return prev
              return [...prev, { id: userId, name: userName }]
            })
            const myId = socket.id
            if (userId === myId) return
            const pc = createPeer(userId)
            const stream = localStreamRef.current
            if (stream) stream.getTracks().forEach((t) => pc.addTrack(t, stream))
            // Host ve mevcut katılımcılar her zaman offer gönderir (yeni katılan bekler)
            const offer = await pc.createOffer()
            await pc.setLocalDescription(offer)
            setVideoSendParams(pc)
            socket.emit('webrtc-offer', { to: userId, offer })
          })
          socket.on('user-left', ({ userId }) => {
            const pc = peersRef.current[userId]
            if (pc) {
              pc.close()
              delete peersRef.current[userId]
            }
            clearTimeout(iceRestartTimeoutRef.current[userId])
            delete iceRestartTimeoutRef.current[userId]
            delete iceRestartAttemptedRef.current[userId]
            delete iceQueueRef.current[userId]
            setRemoteStreams((prev) => {
              const next = { ...prev }
              delete next[userId]
              return next
            })
            setUsers((prev) => prev.filter((u) => u.id !== userId))
          })
          socket.on('webrtc-offer', async ({ from, offer }) => {
            const pc = createPeer(from)
            const stream = await getLocalStream()
            if (stream && !pc.getSenders().some((s) => s.track))
              stream.getTracks().forEach((t) => pc.addTrack(t, stream))
            await pc.setRemoteDescription(new RTCSessionDescription(offer))
            await drainIceQueue(from)
            const answer = await pc.createAnswer()
            await pc.setLocalDescription(answer)
            setVideoSendParams(pc)
            socket.emit('webrtc-answer', { to: from, answer })
          })
          socket.on('webrtc-answer', async ({ from, answer }) => {
            const pc = peersRef.current[from]
            if (pc) {
              await pc.setRemoteDescription(new RTCSessionDescription(answer))
              await drainIceQueue(from)
            }
          })
          socket.on('webrtc-ice', ({ from, candidate }) => {
            if (candidate) addIceCandidateSafe(from, candidate)
          })
          socket.on('user-video-changed', ({ userId, userName, enabled, timestamp }) => {
            meetingLogRef.current.events.push({ type: 'video', userId, userName, enabled, timestamp })
          })
          socket.on('user-mute-changed', ({ userId, userName, enabled, timestamp }) => {
            meetingLogRef.current.events.push({ type: 'mute', userId, userName, enabled, timestamp })
          })
          socket.on('meeting-ended', () => leaveRoom(true))

          socket.emit('create-room', { roomCode: code.toUpperCase().trim(), userName: (userName || '').trim() || 'Konuk', meetingName: (meetingName || '').trim() || 'Toplantı' })
        } catch (err) {
          setError(err.message || 'Bağlantı kurulamadı')
          setLoading(false)
          reject(err)
        }
      })
    },
    [createPeer, getLocalStream, drainIceQueue, addIceCandidateSafe, setVideoSendParams, leaveRoom]
  )

  const joinRoom = useCallback(
    (code, userName) => {
      setError(null)
      setLoading(true)
      return new Promise((resolve, reject) => {
        try {
          const socket = io(SOCKET_URL, { path: '/socket.io', transports: ['websocket', 'polling'] })
          socketRef.current = socket

          socket.on('room-joined', async ({ roomCode: rc, userId, users: userList, meetingName: mn }) => {
            myUserNameRef.current = (userName || '').trim() || 'Konuk'
            meetingLogRef.current = {
              startTime: new Date().toISOString(),
              endTime: null,
              events: [{ type: 'join', userId, userName: myUserNameRef.current, timestamp: new Date().toISOString() }],
            }
            ;(userList || []).filter((u) => u.id !== userId).forEach((u) => {
              meetingLogRef.current.events.push({ type: 'join', userId: u.id, userName: u.name || 'Konuk', timestamp: meetingLogRef.current.startTime })
            })
            setRoomCode(rc)
            setMyId(userId)
            setIsHost(false)
            setMeetingName(mn || 'Toplantı')
            setUsers(userList || [])
            setLoading(false)
            resolve()
            getLocalStream()
              .then((stream) => {
                // Yeni katılan offer göndermez; mevcut katılımcılar user-joined ile teklif gönderecek
                for (const u of userList || []) {
                  if (u.id === socket.id) continue
                  const pc = createPeer(u.id)
                  if (stream && pc) stream.getTracks().forEach((t) => pc.addTrack(t, stream))
                }
              })
              .catch((err) => setError(err.message || 'Kamera/mikrofon erişilemedi'))
          })
          socket.on('room-error', ({ message }) => {
            setError(message)
            setLoading(false)
            reject(new Error(message))
          })
          socket.on('user-list', (list) => {
            setUsers(list || [])
            const ids = new Set((list || []).map((u) => u.id))
            setRemoteStreams((prev) => {
              const next = { ...prev }
              for (const id of Object.keys(next)) {
                if (!ids.has(id)) delete next[id]
              }
              return next
            })
            for (const id of Object.keys(peersRef.current)) {
              if (!ids.has(id)) {
                const pc = peersRef.current[id]
                if (pc) pc.close()
                delete peersRef.current[id]
                clearTimeout(iceRestartTimeoutRef.current[id])
                delete iceRestartTimeoutRef.current[id]
                delete iceRestartAttemptedRef.current[id]
                delete iceQueueRef.current[id]
              }
            }
          })
          socket.on('user-joined', ({ userId, userName: un }) => {
            meetingLogRef.current.events.push({ type: 'join', userId, userName: un || 'Konuk', timestamp: new Date().toISOString() })
            setUsers((prev) => {
              if (prev.find((u) => u.id === userId)) return prev
              return [...prev, { id: userId, name: un }]
            })
          })
          socket.on('user-left', ({ userId }) => {
            meetingLogRef.current.events.push({ type: 'leave', userId, timestamp: new Date().toISOString() })
            const pc = peersRef.current[userId]
            if (pc) {
              pc.close()
              delete peersRef.current[userId]
            }
            clearTimeout(iceRestartTimeoutRef.current[userId])
            delete iceRestartTimeoutRef.current[userId]
            delete iceRestartAttemptedRef.current[userId]
            delete iceQueueRef.current[userId]
            setRemoteStreams((prev) => {
              const next = { ...prev }
              delete next[userId]
              return next
            })
            setUsers((prev) => prev.filter((u) => u.id !== userId))
          })
          socket.on('webrtc-offer', async ({ from, offer }) => {
            const pc = createPeer(from)
            const stream = await getLocalStream()
            if (stream && !pc.getSenders().some((s) => s.track))
              stream.getTracks().forEach((t) => pc.addTrack(t, stream))
            await pc.setRemoteDescription(new RTCSessionDescription(offer))
            await drainIceQueue(from)
            const answer = await pc.createAnswer()
            await pc.setLocalDescription(answer)
            setVideoSendParams(pc)
            socket.emit('webrtc-answer', { to: from, answer })
          })
          socket.on('webrtc-answer', async ({ from, answer }) => {
            const pc = peersRef.current[from]
            if (pc) {
              await pc.setRemoteDescription(new RTCSessionDescription(answer))
              await drainIceQueue(from)
            }
          })
          socket.on('webrtc-ice', ({ from, candidate }) => {
            if (candidate) addIceCandidateSafe(from, candidate)
          })
          socket.on('user-video-changed', ({ userId, userName, enabled, timestamp }) => {
            meetingLogRef.current.events.push({ type: 'video', userId, userName, enabled, timestamp })
          })
          socket.on('user-mute-changed', ({ userId, userName, enabled, timestamp }) => {
            meetingLogRef.current.events.push({ type: 'mute', userId, userName, enabled, timestamp })
          })
          socket.on('meeting-ended', () => leaveRoom(true))

          socket.emit('join-room', { roomCode: code.toUpperCase().trim(), userName: (userName || '').trim() || 'Konuk' })
        } catch (err) {
          setError(err.message || 'Bağlantı kurulamadı')
          setLoading(false)
          reject(err)
        }
      })
    },
    [createPeer, getLocalStream, drainIceQueue, addIceCandidateSafe, setVideoSendParams, leaveRoom]
  )

  const endMeetingForAll = useCallback(() => {
    if (isHost && socketRef.current) socketRef.current.emit('end-meeting')
  }, [isHost])

  const toggleMute = useCallback(() => {
    if (!localStreamRef.current) return
    const newEnabled = !localStreamRef.current.getAudioTracks()[0]?.enabled
    localStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = newEnabled))
    setIsMuted((m) => !m)
    if (socketRef.current) {
      socketRef.current.emit('user-mute-changed', { enabled: newEnabled })
      meetingLogRef.current.events.push({ type: 'mute', userId: myId, userName: myUserNameRef.current, enabled: newEnabled, timestamp: new Date().toISOString() })
    }
  }, [myId])

  const toggleVideo = useCallback(() => {
    if (!localStreamRef.current) return
    const newEnabled = !localStreamRef.current.getVideoTracks()[0]?.enabled
    localStreamRef.current.getVideoTracks().forEach((t) => (t.enabled = newEnabled))
    setIsVideoOff((v) => !v)
    if (socketRef.current) {
      socketRef.current.emit('user-video-changed', { enabled: newEnabled })
      meetingLogRef.current.events.push({ type: 'video', userId: myId, userName: myUserNameRef.current, enabled: newEnabled, timestamp: new Date().toISOString() })
    }
  }, [myId])

  const loadAudioDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const inputs = devices.filter((d) => d.kind === 'audioinput')
      const outputs = devices.filter((d) => d.kind === 'audiooutput')
      setAudioInputDevices(inputs)
      setAudioOutputDevices(outputs)
      setSelectedAudioInputId((prev) => (prev || inputs[0]?.deviceId || ''))
      setSelectedAudioOutputId((prev) => (prev || outputs[0]?.deviceId || ''))
    } catch (_) {}
  }, [])

  const switchAudioInput = useCallback(async (deviceId) => {
    if (!localStreamRef.current || !deviceId) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: { exact: deviceId }, echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        video: false,
      })
      const newTrack = stream.getAudioTracks()[0]
      if (!newTrack) return
      const oldTrack = localStreamRef.current.getAudioTracks()[0]
      if (oldTrack) {
        localStreamRef.current.removeTrack(oldTrack)
        oldTrack.stop()
      }
      localStreamRef.current.addTrack(newTrack)
      setLocalStream(new MediaStream(localStreamRef.current.getTracks()))
      setSelectedAudioInputId(deviceId)
      Object.values(peersRef.current).forEach((pc) => {
        const sender = pc.getSenders().find((s) => s.track?.kind === 'audio')
        if (sender) sender.replaceTrack(newTrack)
      })
    } catch (e) {
      console.warn('Mikrofon değiştirilemedi:', e)
    }
  }, [])

  const setSelectedAudioOutput = useCallback((deviceId) => {
    setSelectedAudioOutputId(deviceId || '')
  }, [])

  const getMeetingSummaryText = useCallback((endTimeOverride) => {
    return buildMeetingSummaryText(meetingLogRef.current, users, meetingName, endTimeOverride)
  }, [users, meetingName])

  return {
    createRoom,
    joinRoom,
    leaveRoom,
    endMeetingForAll,
    clearMeetingEnded,
    roomCode,
    meetingName,
    users,
    myId,
    localStream,
    remoteStreams,
    isMuted,
    isVideoOff,
    isHost,
    meetingEndedByHost,
    toggleMute,
    toggleVideo,
    error,
    loading,
    audioInputDevices,
    audioOutputDevices,
    selectedAudioInputId,
    selectedAudioOutputId,
    loadAudioDevices,
    switchAudioInput,
    setSelectedAudioOutput,
    retryCamera,
    getMeetingSummaryText,
  }
}

export function randomRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}
