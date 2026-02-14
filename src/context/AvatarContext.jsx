import { createContext, useContext, useState } from 'react'

const AvatarContext = createContext(null)

export function AvatarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  const openAvatarPanel = () => setIsOpen(true)
  const closeAvatarPanel = () => setIsOpen(false)
  const toggleAvatarPanel = () => setIsOpen((prev) => !prev)

  return (
    <AvatarContext.Provider value={{ isOpen, openAvatarPanel, closeAvatarPanel, toggleAvatarPanel }}>
      {children}
    </AvatarContext.Provider>
  )
}

export function useAvatarPanel() {
  const ctx = useContext(AvatarContext)
  if (!ctx) throw new Error('useAvatarPanel must be used within AvatarProvider')
  return ctx
}
