import { ROUTES } from '../../config/routes'
import MeetingScreen from '../../components/meeting/MeetingScreen'

/** Stajım > Canlı toplantı — hem toplantı oluştur hem oda kodu ile katıl. Ortak MeetingScreen; çıkışta staj sayfasına döner. */
export default function StajLive() {
  return (
    <MeetingScreen
      title="Canlı toplantı"
      subtitle="Toplantı oluşturun veya oda kodu ile katılın. Staj danışmanı veya ekip ile görüşmek için kullanın."
      leavePath={ROUTES.STAJ_LIVE}
      defaultMeetingName="Staj toplantısı"
      lobbyMode="both"
      createButtonLabel="Toplantı oluştur"
      meetingNamePlaceholder="Örn: Haftalık değerlendirme"
    />
  )
}
