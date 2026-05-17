import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useCommunity } from '../../context/PublishingContext'
import LoadingState from '../ui/LoadingState'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { loading, error } = useCommunity()

  return (
    <div className="min-h-screen bg-publishing-paper text-publishing-ink font-sans">
      {/* Бокова панель навігації видавництва */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="min-h-screen lg:pl-72">
        {/* Верхня панель дій користувача та глобального пошуку */}
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        
        {loading && <LoadingState />}
        
        {!loading && error && (
          <main className="page-shell">
            <div className="editorial-card p-6 bg-red-50 text-publishing-danger border-publishing-danger/30">
              <p className="font-semibold">Помилка завантаження підсистеми:</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </main>
        )}
        
        {!loading && !error && (
          <main className="animate-fadeIn">
            <Outlet />
          </main>
        )}
      </div>
    </div>
  )
}

export default MainLayout