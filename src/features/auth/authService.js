import { STORAGE_KEYS } from '../../constants/storage'
import { DEFAULT_USERS } from './authConstants'

export function getStoredEmail() {
  return localStorage.getItem(STORAGE_KEYS.EMAIL) || ''
}

export function getLocalUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOCAL_USERS)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length) return parsed
    }
  } catch (_) {}
  return DEFAULT_USERS
}

export function findUser(email, password) {
  const users = getLocalUsers()
  const normalizedEmail = (email || '').trim().toLowerCase()
  return users.find(
    (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
  )
}

export function login(displayName, role = 'student', email = '', branch = '') {
  localStorage.setItem(STORAGE_KEYS.AUTH, '1')
  localStorage.setItem(STORAGE_KEYS.USER, displayName || 'Konuk')
  localStorage.setItem(STORAGE_KEYS.ROLE, role === 'teacher' ? 'teacher' : 'student')
  if (email) localStorage.setItem(STORAGE_KEYS.EMAIL, email)
  if (role === 'teacher' && branch) localStorage.setItem(STORAGE_KEYS.BRANCH, branch)
}

export function getStoredRole() {
  return localStorage.getItem(STORAGE_KEYS.ROLE) === 'teacher' ? 'teacher' : 'student'
}

/** Öğretmenin branşı (örn. biyoloji). Öğretmen değilse veya set edilmemişse varsayılan 'biyoloji'. */
export function getStoredBranch() {
  return localStorage.getItem(STORAGE_KEYS.BRANCH) || 'biyoloji'
}

export function getStoredUser() {
  return localStorage.getItem(STORAGE_KEYS.USER) || 'Konuk'
}

export function logout() {
  localStorage.removeItem(STORAGE_KEYS.AUTH)
  localStorage.removeItem(STORAGE_KEYS.USER)
  localStorage.removeItem(STORAGE_KEYS.EMAIL)
  localStorage.removeItem(STORAGE_KEYS.ROLE)
  localStorage.removeItem(STORAGE_KEYS.BRANCH)
}

/** Mevcut kullanıcının şifresini günceller (email storage'dan bulunur). */
export function updatePassword(currentPassword, newPassword) {
  const email = (localStorage.getItem(STORAGE_KEYS.EMAIL) || '').trim().toLowerCase()
  if (!email) return { success: false, error: 'Oturum bulunamadı.' }
  if (!newPassword || newPassword.length < 6) return { success: false, error: 'Yeni şifre en az 6 karakter olmalı.' }
  const users = getLocalUsers()
  const idx = users.findIndex((u) => u.email.toLowerCase() === email)
  if (idx === -1) return { success: false, error: 'Kullanıcı bulunamadı.' }
  if (users[idx].password !== currentPassword) return { success: false, error: 'Mevcut şifre hatalı.' }
  users[idx] = { ...users[idx], password: newPassword }
  try {
    localStorage.setItem(STORAGE_KEYS.LOCAL_USERS, JSON.stringify(users))
    return { success: true }
  } catch (_) {
    return { success: false, error: 'Kayıt güncellenemedi.' }
  }
}
