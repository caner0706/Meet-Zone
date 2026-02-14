import { Outlet, useLocation } from 'react-router-dom'
import AvatarDrawer from '../avatar/AvatarDrawer'
import { useSenseAnimations } from '../../hooks/useSenseAnimations'
import { useAvatarPanel } from '../../context/AvatarContext'
import { ROUTES } from '../../config/routes'

export default function IndexLayout() {
  useSenseAnimations()
  const { openAvatarPanel } = useAvatarPanel()
  const { pathname } = useLocation()
  const isIntroPage = pathname === ROUTES.WELCOME_INTRO || pathname === '/dashboard/karsilama'

  return (
    <div className="app app--index">
      <main className="main main--index">
        <Outlet />
      </main>

      {!isIntroPage && (
        <>
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
        </>
      )}
    </div>
  )
}
