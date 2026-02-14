import { STORAGE_KEYS } from '../constants/storage'

/**
 * localStorage'dan kullanıcı adını alır
 */
export function getDisplayName() {
  try {
    return (localStorage.getItem(STORAGE_KEYS.USER) || '').trim() || 'Konuk'
  } catch {
    return 'Konuk'
  }
}
