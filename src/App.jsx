import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import Layout from './components/Layout'
import AuthPage from './pages/AuthPage'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Budget from './pages/Budget'
import Goals from './pages/Goals'
import Debt from './pages/Debt'
import Invest from './pages/Invest'
import Learn from './pages/Learn'
import Leaderboard from './pages/Leaderboard'
import Challenges from './pages/Challenges'
import Coach from './pages/Coach'
import { ToastProvider } from './components/Toast'

function AppRoutes() {
  const { isAuthenticated, currentUser } = useAuthStore()

  if (!isAuthenticated) return <AuthPage />
  if (!currentUser?.onboardingComplete) return <Onboarding />

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/debt" element={<Debt />} />
        <Route path="/invest" element={<Invest />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/coach" element={<Coach />} />
      </Routes>
    </Layout>
  )
}

export default function App() {
  return (
    <BrowserRouter basename="/Personal-Finance-App">
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </BrowserRouter>
  )
}
