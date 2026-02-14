import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../config/routes'
import MeetingScreen from '../components/meeting/MeetingScreen'

/**
 * Hızlı toplantı — yan menü yok (IndexLayout altında).
 * Doğrudan canlı toplantı lobisi: toplantı oluştur veya oda kodu ile katıl.
 */
export default function QuickMeetingPage() {
  const navigate = useNavigate()

  return (
    <>
      <div style={{ marginBottom: '1rem' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate(ROUTES.DASHBOARD)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border-soft)',
            background: 'var(--color-surface-elevated)',
            color: 'var(--color-text)',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
          aria-label="Ana menüye dön"
        >
          <span aria-hidden style={{ fontSize: '1.1rem', lineHeight: 1 }}>←</span>
          Geri
        </button>
      </div>
      <MeetingScreen
      title="Canlı toplantı"
      subtitle="Toplantı oluşturun veya oda kodu ile katılın. Staj danışmanı veya ekip ile görüşmek için kullanın."
      leavePath={ROUTES.QUICK_MEETING}
      defaultMeetingName="Toplantı"
      lobbyMode="both"
      createButtonLabel="Toplantı oluştur"
      meetingNamePlaceholder="Örn: Haftalık değerlendirme"
      />
    </>
  )
}
