import { Navigate } from 'react-router-dom'
import { ROUTES } from '../config/routes'
import { STORAGE_KEYS } from '../constants/storage'

export function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem(STORAGE_KEYS.AUTH) === '1'
  if (!isLoggedIn) return <Navigate to={ROUTES.LOGIN} replace />
  return children
}
