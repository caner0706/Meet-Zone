import { STORAGE_KEYS } from '../../constants/storage'

/** Lokalde tutulan demo hesaplar — role: 'teacher' | 'student', öğretmenin branşı */
export const DEFAULT_USERS = [
  { email: 'ogretmen@meetzone.com', password: '123456', displayName: 'Öğretmen', role: 'teacher', branch: 'biyoloji' },
  { email: 'ogrenci@meetzone.com', password: '123456', displayName: 'Caner Giden', role: 'student' },
]

export { STORAGE_KEYS }
