import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { ROUTES } from '../config/routes'
import { AvatarProvider } from '../context/AvatarContext'
import Layout from '../components/layout/Layout'
import IndexLayout from '../components/layout/IndexLayout'
import LoginPage from '../features/auth/LoginPage'
import DashboardIndex from '../pages/DashboardIndex'
import WelcomeIntro from '../pages/WelcomeIntro'
import Dashboard from '../pages/Dashboard'
import Tasks from '../pages/Tasks'
import Report from '../pages/Report'
import Live from '../pages/Live'
import Insights from '../pages/Insights'
import Account from '../pages/Account'
import Messages from '../pages/Messages'
import Settings from '../pages/Settings'
import MeetingAnalysis from '../pages/teacher/MeetingAnalysis'
import TaskAnalytics from '../pages/teacher/TaskAnalytics'
import StajLive from '../pages/staj/StajLive'
import StajReport from '../pages/staj/StajReport'
import StajAnalysis from '../pages/staj/StajAnalysis'
import StajRoadmap from '../pages/staj/StajRoadmap'
import Takimlar from '../pages/Takimlar'
import ProjelerimMessages from '../pages/projelerim/ProjelerimMessages'
import ProjelerimReport from '../pages/projelerim/ProjelerimReport'
import ProjelerimAnalysis from '../pages/projelerim/ProjelerimAnalysis'
import ProjelerimRoadmap from '../pages/projelerim/ProjelerimRoadmap'
import QuickMeetingPage from '../pages/QuickMeetingPage'
import Agenda from '../pages/Agenda'

export function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      
      {/* Dashboard index - karşılama (sidebar yok) */}
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <AvatarProvider>
              <IndexLayout />
            </AvatarProvider>
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardIndex />} />
        <Route path="karsilama" element={<WelcomeIntro />} />
        <Route path="toplanti" element={<QuickMeetingPage />} />
        <Route path="ajanda" element={<Agenda />} />
      </Route>

      {/* Dashboard sayfaları - sidebar ile */}
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <AvatarProvider>
              <Layout />
            </AvatarProvider>
          </ProtectedRoute>
        }
      >
        <Route path="ozet" element={<Dashboard />} />
        <Route path="staj" element={<Navigate to={ROUTES.STAJ_LIVE} replace />} />
        <Route path="staj/canli-toplanti" element={<StajLive />} />
        <Route path="staj/raporlar" element={<StajReport />} />
        <Route path="staj/analizler" element={<StajAnalysis />} />
        <Route path="staj/yol-haritasi" element={<StajRoadmap />} />
        <Route path="staj/mesajlar" element={<Messages />} />
        <Route path="projelerim" element={<Navigate to={ROUTES.PROJELERIM_TAKIMLAR} replace />} />
        <Route path="projelerim/takimlarim" element={<Takimlar />} />
        <Route path="projelerim/canli-toplanti" element={<StajLive />} />
        <Route path="projelerim/raporlar" element={<ProjelerimReport />} />
        <Route path="projelerim/analizler" element={<ProjelerimAnalysis />} />
        <Route path="projelerim/yol-haritasi" element={<ProjelerimRoadmap />} />
        <Route path="projelerim/mesajlar" element={<ProjelerimMessages />} />
        <Route path="takimlar" element={<Takimlar />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="report" element={<Report />} />
        <Route path="live" element={<Live />} />
        <Route path="insights" element={<Insights />} />
        <Route path="meeting-analysis" element={<MeetingAnalysis />} />
        <Route path="task-analytics" element={<TaskAnalytics />} />
        <Route path="avatar" element={<Navigate to="/dashboard" replace />} />
        <Route path="messages" element={<Messages />} />
        <Route path="account" element={<Account />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  )
}
