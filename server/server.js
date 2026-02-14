import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname_server = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname_server, '..', '.env') });

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import os from 'os';
import multer from 'multer';
import { uploadFiles } from '@huggingface/hub';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HF_TOKEN = process.env.HF_TOKEN;
const HF_DATASET_REPO = process.env.HF_DATASET_REPO;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO;

function sanitizeFilename(s) {
  if (!s || typeof s !== 'string') return 'Toplanti'
  return s.replace(/[/\\:*?"<>|]/g, '_').replace(/\s+/g, '_').trim() || 'Toplanti'
}

async function uploadToHuggingFace(filePath, content, contentType = 'application/octet-stream') {
  if (!HF_TOKEN || !HF_DATASET_REPO) {
    throw new Error('Hugging Face yapılandırması eksik: HF_TOKEN ve HF_DATASET_REPO ortam değişkenlerini ayarlayın.');
  }
  const blob = content instanceof Buffer
    ? new Blob([content], { type: contentType })
    : new Blob([content], { type: contentType });
  await uploadFiles({
    repo: { type: 'dataset', name: HF_DATASET_REPO },
    accessToken: HF_TOKEN,
    files: [{ path: filePath, content: blob }],
  });
}

async function triggerGitHubWorkflow(payload) {
  if (!GITHUB_TOKEN || !GITHUB_REPO) return;
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/dispatches`, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        event_type: 'hf_dataset_update',
        client_payload: payload,
      }),
    });
    const text = await res.text();
    if (res.status === 204) {
      console.log('GitHub workflow tetiklendi:', payload.meeting_folder);
    } else {
      console.error('GitHub tetikleyici başarısız:', res.status, text);
    }
  } catch (err) {
    console.error('GitHub tetikleyici çalıştırılamadı:', err.message);
  }
}

const upload = multer({ storage: multer.memoryStorage() });

const app = express();
app.use(cors());
app.use(express.json());
const httpServer = createServer(app);

const CLIENT_PORT = 5173;

function getLocalNetworkIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      const isIPv4 = iface.family === 'IPv4' || iface.family === 4;
      if (isIPv4 && !iface.internal) return iface.address;
    }
  }
  return null;
}

app.get('/api/host', (req, res) => {
  const ip = getLocalNetworkIP();
  if (!ip) return res.json({ baseUrl: null });
  res.json({ baseUrl: `http://${ip}:${CLIENT_PORT}` });
});

app.post('/api/recordings', upload.single('recording'), async (req, res) => {
  if (!req.file || !req.file.buffer) return res.status(400).json({ error: 'Dosya yok' });
  const meetingName = sanitizeFilename(req.query.meetingName || req.body?.meetingName);
  const displayName = sanitizeFilename(req.query.displayName || req.body?.displayName || 'Konuk');
  const date = req.query.recordedAt || req.body?.recordedAt ? new Date(req.query.recordedAt || req.body?.recordedAt) : new Date();
  const dateStr = date.toISOString().slice(0, 10);
  const timeStr = date.toISOString().slice(11, 16).replace(':', '-');
  const meetingFolder = `${meetingName}_${dateStr}_${timeStr}`;
  const filename = `${displayName}.webm`;
  const hfPath = `Toplantı Kayıtları/${meetingFolder}/${filename}`;
  try {
    await uploadToHuggingFace(hfPath, req.file.buffer, 'video/webm');
    res.json({ ok: true, path: hfPath });
  } catch (err) {
    console.error('Hugging Face yükleme hatası:', err.message, err.stack);
    res.status(500).json({ error: err.message || 'Yükleme başarısız' });
  }
});

app.post('/api/recordings/summary', async (req, res) => {
  const meetingName = sanitizeFilename(req.query.meetingName || req.body?.meetingName);
  const date = req.query.recordedAt || req.body?.recordedAt ? new Date(req.query.recordedAt || req.body?.recordedAt) : new Date();
  const dateStr = date.toISOString().slice(0, 10);
  const timeStr = date.toISOString().slice(11, 16).replace(':', '-');
  const meetingFolder = `${meetingName}_${dateStr}_${timeStr}`;
  const summaryText = req.query.summaryText || req.body?.summaryText || '';
  const hfPath = `Toplantı Kayıtları/${meetingFolder}/toplanti_ozeti.txt`;
  try {
    await uploadToHuggingFace(hfPath, Buffer.from(summaryText, 'utf8'), 'text/plain');
    await triggerGitHubWorkflow({
      file_path: hfPath,
      meeting_folder: meetingFolder,
      file_type: 'summary',
      dataset_repo: HF_DATASET_REPO,
    });
    res.json({ ok: true, path: hfPath });
  } catch (err) {
    console.error('Hugging Face özet yükleme hatası:', err.message, err.stack);
    res.status(500).json({ error: err.message || 'Özet yükleme başarısız' });
  }
});

const io = new Server(httpServer, {
  cors: { origin: '*' },
  pingInterval: 1000,
  pingTimeout: 1000,
});

const rooms = new Map();
const MAX_USERS_PER_ROOM = 4;

function getRoomId(socket) {
  return [...socket.rooms].find((r) => r !== socket.id);
}

io.on('connection', (socket) => {
  console.log('Bağlandı:', socket.id);

  socket.on('create-room', ({ roomCode, userName, meetingName }) => {
    if (rooms.has(roomCode)) {
      socket.emit('room-error', { message: 'Bu oda kodu zaten kullanılıyor.' });
      return;
    }
    rooms.set(roomCode, {
      hostId: socket.id,
      meetingName: (meetingName || '').trim() || 'Toplantı',
      users: new Map([[socket.id, { id: socket.id, name: userName || 'Konuk' }]]),
    });
    socket.join(roomCode);
    socket.roomCode = roomCode;
    socket.userName = userName || 'Konuk';
    socket.emit('room-created', { roomCode, userId: socket.id, meetingName: (meetingName || '').trim() || 'Toplantı' });
    socket.to(roomCode).emit('user-joined', { userId: socket.id, userName: socket.userName });
    sendUserListSync(roomCode);
  });

  socket.on('join-room', ({ roomCode, userName }) => {
    const room = rooms.get(roomCode);
    if (!room) {
      socket.emit('room-error', { message: 'Oda bulunamadı. Kodu kontrol et.' });
      return;
    }
    if (room.users.size >= MAX_USERS_PER_ROOM) {
      socket.emit('room-error', { message: 'Oda dolu (maksimum 4 kişi).' });
      return;
    }
    room.users.set(socket.id, { id: socket.id, name: userName || 'Konuk' });
    socket.join(roomCode);
    socket.roomCode = roomCode;
    socket.userName = userName || 'Konuk';
    socket.emit('room-joined', { roomCode, userId: socket.id, users: [...room.users.values()], meetingName: room.meetingName || 'Toplantı' });
    socket.to(roomCode).emit('user-joined', { userId: socket.id, userName: socket.userName });
    sendUserListSync(roomCode);
  });

  function sendUserList(roomCode) {
    const room = rooms.get(roomCode);
    if (!room) return;
    const list = [...room.users.values()];
    io.to(roomCode).emit('user-list', list);
  }

  function sendUserListSync(roomCode) {
    sendUserList(roomCode);
    setTimeout(() => sendUserList(roomCode), 120);
  }

  socket.on('webrtc-offer', ({ to, offer }) => {
    io.to(to).emit('webrtc-offer', { from: socket.id, offer });
  });

  socket.on('webrtc-answer', ({ to, answer }) => {
    io.to(to).emit('webrtc-answer', { from: socket.id, answer });
  });

  socket.on('webrtc-ice', ({ to, candidate }) => {
    io.to(to).emit('webrtc-ice', { from: socket.id, candidate });
  });

  socket.on('user-video-changed', ({ enabled }) => {
    const roomCode = getRoomId(socket);
    if (!roomCode) return;
    io.to(roomCode).emit('user-video-changed', { userId: socket.id, userName: socket.userName || 'Konuk', enabled, timestamp: new Date().toISOString() });
  });

  socket.on('user-mute-changed', ({ enabled }) => {
    const roomCode = getRoomId(socket);
    if (!roomCode) return;
    io.to(roomCode).emit('user-mute-changed', { userId: socket.id, userName: socket.userName || 'Konuk', enabled, timestamp: new Date().toISOString() });
  });

  socket.on('end-meeting', () => {
    const roomCode = getRoomId(socket);
    if (!roomCode) return;
    const room = rooms.get(roomCode);
    if (!room || room.hostId !== socket.id) return;
    io.to(roomCode).emit('meeting-ended');
    rooms.delete(roomCode);
  });

  socket.on('leaving-room', () => {
    const roomCode = getRoomId(socket);
    if (!roomCode) return;
    const room = rooms.get(roomCode);
    if (!room) return;
    room.users.delete(socket.id);
    socket.to(roomCode).emit('user-left', { userId: socket.id });
    if (room.users.size === 0) rooms.delete(roomCode);
    else sendUserListSync(roomCode);
    console.log('Çıkış bildirimi:', socket.id);
  });

  socket.on('disconnect', () => {
    const roomCode = getRoomId(socket);
    if (roomCode) {
      const room = rooms.get(roomCode);
      if (room) {
        room.users.delete(socket.id);
        socket.to(roomCode).emit('user-left', { userId: socket.id });
        if (room.users.size === 0) rooms.delete(roomCode);
        else sendUserListSync(roomCode);
      }
    }
    console.log('Ayrıldı:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Meet Zone sinyal sunucusu http://localhost:${PORT} üzerinde çalışıyor.`);
  if (HF_TOKEN && HF_DATASET_REPO) {
    console.log(`Hugging Face: ${HF_DATASET_REPO}`);
  } else {
    console.warn('UYARI: Hugging Face yapılandırılmadı. .env dosyasında HF_TOKEN ve HF_DATASET_REPO ayarlayın.');
  }
});
