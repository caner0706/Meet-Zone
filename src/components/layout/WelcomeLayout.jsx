import { Outlet } from 'react-router-dom'
import AvatarDrawer from '../avatar/AvatarDrawer'
import { useSenseAnimations } from '../../hooks/useSenseAnimations'
import { useAvatarPanel } from '../../context/AvatarContext'

export default function WelcomeLayout() {
  useSenseAnimations()
  const { openAvatarPanel } = useAvatarPanel()

  return (
    <div className="app app--welcome">
      <main className="main main--welcome">
        <Outlet />
      </main>

      <button
        type="button"
        className="avatar-fab"
        onClick={openAvatarPanel}
        aria-label="AI Avatar ile konuş"
      >
        <img src="/Avatar.png" alt="" className="avatar-fab-img" />
        <span className="avatar-fab-label">AI Avatar</span>
      </button>

      <AvatarDrawer />
    </div>
  )
}
