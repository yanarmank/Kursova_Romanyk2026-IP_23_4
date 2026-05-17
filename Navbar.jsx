import { Bell, LogOut, Menu, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCommunity } from '../../context/PublishingContext'
import NotificationPanel from '../ui/NotificationPanel'

const routeTitles = [
  { match: '/dashboard', title: 'Панель управління' },
  { match: '/staff/', title: 'Картка видання / Співробітника' },
  { match: '/staff', title: 'Реєстр авторів та персоналу' },
  { match: '/calculator', title: 'Калькулятор калькуляцій' },
  { match: '/orders', title: 'Журнал замовлень друку' },
  { match: '/settings', title: 'Налаштування видавництва' },
]

const Navbar = ({ onMenuClick }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [globalSearch, setGlobalSearch] = useState('')
  const { user, logout } = useAuth()
  const { dashboard, dismissNotification, events, logs, members } = useCommunity()
  const location = useLocation()
  const navigate = useNavigate()

  const title = useMemo(() => {
    const route = routeTitles.find((item) => location.pathname.startsWith(item.match))
    return route?.title ?? 'Система управління видавництвом'
  }, [location.pathname])

  // Розумний пошук за каталогами та авторами замість ігрових ніків
  const searchResults = useMemo(() => {
    const query = globalSearch.trim().toLowerCase()
    if (query.length < 2) return []

    const staffResults = members
      .filter((s) => [s.username, s.tag, s.role].join(' ').toLowerCase().includes(query))
      .slice(0, 4)
      .map((s) => ({
        id: `staff-${s.id}`,
        label: s.username,
        meta: `${s.role} · ${s.tag}`,
        to: `/staff/${s.id}`,
      }))

    const presetResults = events
      .filter((c) => [c.title, c.type, c.host].join(' ').toLowerCase().includes(query))
      .slice(0, 3)
      .map((c) => ({
        id: `calc-${c.id}`,
        label: c.title,
        meta: `${c.type} · ${c.game}`,
        to: '/calculator',
      }))

    return [...staffResults, ...presetResults]
  }, [events, globalSearch, members])

  return (
    <header className="sticky top-0 z-30 border-b border-publishing-ink/10 bg-publishing-paper/90 backdrop-blur-md">
      <div className="flex min-h-16 items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded p-2 text-publishing-muted transition hover:bg-publishing-panel lg:hidden"
            title="Відкрити меню"
          >
            <Menu size={22} />
          </button>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider font-bold text-publishing-muted">Видавничий Дім</p>
            <h1 className="truncate font-serif text-lg font-bold text-publishing-ink sm:text-2xl">{title}</h1>
          </div>
        </div>

        {/* Глобальний рядок пошуку */}
        <div className="relative hidden min-w-[280px] max-w-md flex-1 md:block">
          <label className="flex items-center gap-2 rounded border border-publishing-ink/20 bg-publishing-card px-3 py-1.5 text-publishing-muted focus-within:border-publishing-gold/60">
            <Search size={16} />
            <input
              type="search"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-publishing-ink outline-none placeholder:text-publishing-muted/60"
              placeholder="Шукати автора, книгу чи замовлення..."
            />
          </label>
          {globalSearch.trim().length >= 2 && (
            <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded border border-publishing-ink/10 bg-publishing-paper shadow-editorial">
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <Link
                    key={result.id}
                    to={result.to}
                    onClick={() => setGlobalSearch('')}
                    className="block border-b border-publishing-ink/5 px-4 py-2.5 transition last:border-b-0 hover:bg-publishing-panel/50"
                  >
                    <p className="text-sm font-semibold text-publishing-ink">{result.label}</p>
                    <p className="mt-0.5 text-xs text-publishing-muted">{result.meta}</p>
                  </Link>
                ))
              ) : (
                <p className="px-4 py-3 text-xs text-publishing-muted">Нічого не знайдено за запитом.</p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Панель сповіщень */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative rounded border border-publishing-ink/10 bg-publishing-card p-2 text-publishing-muted transition hover:text-publishing-burgundy"
            >
              <Bell size={18} />
              {dashboard?.notifications?.length > 0 && (
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-publishing-burgundy" />
              )}
            </button>
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded border border-publishing-ink/10 bg-publishing-card p-3 shadow-editorial">
                <NotificationPanel
                  compact
                  notifications={dashboard?.notifications ?? []}
                  onDismiss={dismissNotification}
                />
              </div>
            )}
          </div>

          {/* Профіль оператора системи */}
          <div className="hidden items-center gap-2.5 border-l border-publishing-ink/10 pl-3 sm:flex">
            <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded bg-publishing-panel border border-publishing-ink/10" />
            <div className="leading-4">
              <p className="text-xs font-bold text-publishing-ink">{user.name}</p>
              <p className="text-[10px] font-medium text-publishing-muted">{user.role}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="rounded border border-publishing-ink/10 bg-publishing-card p-2 text-publishing-muted transition hover:border-publishing-danger/40 hover:text-publishing-danger"
            title="Вийти з системи"
          >
            <LogOut size = {18} />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar