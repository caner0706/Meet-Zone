import { useSearchParams } from 'react-router-dom'
import { getStoredRole } from '../features/auth/authService'
import { ROUTES } from '../config/routes'
import MeetingScreen from '../components/meeting/MeetingScreen'

/** Derslerim > Canlı toplantı. URL'de ?mode=create veya ?code=XXX varsa (Hızlı toplantı sayfasından) buna göre lobi; yoksa role göre. */
export default function Live() {
  const [searchParams] = useSearchParams()
  const role = getStoredRole()
  const isStudent = role === 'student'

  const modeParam = searchParams.get('mode')
  const codeParam = searchParams.get('code') || searchParams.get('join')
  const lobbyMode =
    modeParam === 'create' ? 'create'
      : codeParam ? 'join'
      : isStudent ? 'join' : 'create'

  return (
    <MeetingScreen
      title="Canlı Toplantı"
      subtitle={
        lobbyMode === 'join'
          ? 'Oda kodunu girerek toplantıya katılın.'
          : 'Yeni toplantı oluşturun. Katılımcılar oda kodu ile katılır.'
      }
      leavePath={ROUTES.LIVE}
      defaultMeetingName="Toplantı"
      lobbyMode={lobbyMode}
      createButtonLabel="Toplantıyı başlat"
      meetingNamePlaceholder="Örn: Proje değerlendirme"
    />
  )
}
