import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import GlobalStyle from './styles/GlobalStyle'
import theme from './styles/theme'

// Layout
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'

// Landing Page
import LandingPage from './pages/landing/LandingPage'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'

// Main Pages
import DashboardPage from './pages/dashboard/DashboardPage'
import ProfilePage from './pages/profile/ProfilePage'
import FeedListPage from './pages/feed/FeedListPage'
import QuestionListPage from './pages/qna/QuestionListPage'
import QuestionDetailPage from './pages/qna/QuestionDetailPage'
import StatsPage from './pages/stats/StatsPage'
import WhatIfPage from './pages/whatif/WhatIfPage'
import PlanPage from './pages/plan/PlanPage'
import DietPage from './pages/diet/DietPage'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/feed" element={<FeedListPage />} />
              <Route path="/qna" element={<QuestionListPage />} />
              <Route path="/qna/:questionId" element={<QuestionDetailPage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/whatif" element={<WhatIfPage />} />
              <Route path="/plan" element={<PlanPage />} />
              <Route path="/diet" element={<DietPage />} />
            </Route>
          </Route>

          {/* Fallback - 알 수 없는 경로는 랜딩 페이지로 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
