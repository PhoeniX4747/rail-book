import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AppLayout from '../components/layout/AppLayout'

const LoginPage = lazy(() => import('../pages/LoginPage'))
const DashboardPage = lazy(() => import('../pages/DashboardPage'))
const SearchPage = lazy(() => import('../pages/SearchPage'))
const AssistantPage = lazy(() => import('../pages/AssistantPage'))
const ResultsPage = lazy(() => import('../pages/ResultsPage'))
const TrainDetailsPage = lazy(() => import('../pages/TrainDetailsPage'))
const PassengerPage = lazy(() => import('../pages/PassengerPage'))
const BookingSuccessPage = lazy(() => import('../pages/BookingSuccessPage'))
const TripsPage = lazy(() => import('../pages/TripsPage'))

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/" replace />
}

function LoadingScreen() {
  return <div className="route-loader"><div></div><span>Preparing your journey...</span></div>
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/trains/:trainId" element={<TrainDetailsPage />} />
          <Route path="/passengers" element={<PassengerPage />} />
          <Route path="/booking/success" element={<BookingSuccessPage />} />
          <Route path="/trips" element={<TripsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
