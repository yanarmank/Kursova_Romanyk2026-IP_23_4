import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import { AuthProvider, useAuth } from './context/AuthContext'
import { PublishingProvider } from './context/PublishingContext'
import { ThemeProvider } from './context/ThemeContext'
import DashboardPage from './pages/DashboardPage'
import TypographyCalculatorPage from './pages/TypographyCalculatorPage' 
import LoginPage from './pages/LoginPage'
import StaffPage from './pages/StaffPage' 
import OrderLogPage from './pages/OrderLogPage' 
import SettingsPage from './pages/SettingsPage'
import AuthorProfilePage from './pages/AuthorProfilePage' 
import BookStorePage from './pages/BookStorePage' // Імпорт нової сторінки магазину готових книг

const ProtectedRoutes = () => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <MainLayout />
}

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <PublishingProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route element={<ProtectedRoutes />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/staff" element={<StaffPage />} />
              <Route path="/staff/:authorId" element={<AuthorProfilePage />} />
              <Route path="/calculator" element={<TypographyCalculatorPage />} />
              <Route path="/orders" element={<OrderLogPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/store" element={<BookStorePage />} /> {/* Нова сторінка крамниці готових книг */}
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </PublishingProvider>
    </AuthProvider>
  </ThemeProvider>
)

export default App