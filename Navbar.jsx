import { Bell, LogOut, Menu, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCommunity } from '../../context/PublishingContext'
import NotificationPanel from '../ui/NotificationPanel'

const routeTitles = [
  { match: '/dashboard', title: 'Панель управління' },
  { match: '/store', title: 'Книжкова вітрина' },
  { match: '/staff/', title: 'Картка видання / Співробітника' },
  { match: '/staff', title: 'Реєстр авторів та персоналу' },
  { match: '/calculator', title: 'Калькулятор калькуляцій' },
  { match: '/orders', title: 'Журнал замовлень друку' },
  { match: '/settings', title: 'Налаштування видавництва' },
]

const BOOKS_FOR_GLOBAL_SEARCH = [
  { id: "book-ukr-1", label: "Тіні забутих предків", meta: "Михайло Коцюбинський" },
  { id: "book-ukr-2", label: "Лісова пісня", meta: "Леся Українка" },
  { id: "book-ukr-3", label: "Кайдашева сім’я", meta: "Іван Нечуй-Левицький" },
  { id: "book-ukr-4", label: "Захар Беркут", meta: "Іван Франко" },
  { id: "book-ukr-5", label: "Маруся Чурай", meta: "Ліна Костенко" },
  { id: "book-ukr-6", label: "Тигролови", meta: "Іван Багряний" },
  { id: "book-ukr-7", label: "Хіба ревуть воли, як ясла повні?", meta: "Панас Мирний" },
  { id: "book-ukr-8", label: "Солодка Даруся", meta: "Марія Матіос" },
  { id: "book-ukr-9", label: "Інтернат", meta: "Сергій Жадан" },
  { id: "book-ukr-10", label: "Місто", meta: "Валер'ян Підмогильний" },
  { id: "book-ukr-11", label: "Кобзар", meta: "Тарас Шевченко" },
  { id: "book-ukr-12", label: "Фелікс Австрія", meta: "Софія Андрухович" }
]

const Navbar = ({ onMenuClick }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [globalSearch, setGlobalSearch] = useState('')
  const { user, logout } = useAuth()
  const { dashboard, dismissNotification, members } = useCommunity()
  const location = useLocation()
  const navigate = useNavigate()

  const title = useMemo(() => {
    const route = routeTitles.find((item) => location.pathname.startsWith(item.match))
    return route?.title ?? 'Система управління видавництвом'
  }, [location.pathname])

  const searchResults = useMemo(() => {
    const query = globalSearch.trim().toLowerCase()
    if (query.length < 2) return []

    const staffResults = members
      .filter((s) => [s.username, s.role].join(' ').toLowerCase().includes(query))
      .slice(0, 2)
      .map((s) => ({
        id: `staff-${s.id}`,
        label: s.username,
        meta: `${s.role}`,
        type: 'staff',
        to: `/staff/${s.id}`,
      }))

    const bookResults = BOOKS_FOR_GLOBAL_SEARCH
      .filter((b) => [b.label, b.meta].join(' ').toLowerCase().includes(query))
      .slice(0, 4)
      .map((b) => ({
        id: b.id,
        label: b.label,
        meta: b.meta,
        type: 'book',
        to: `/store?search=${encodeURIComponent(b.label)}`, // Передаємо назву книги в URL параметри
      }))

    return [...bookResults, ...staffResults]
  }, [globalSearch, members])

  const handleResultClick = (result) => {
    setGlobalSearch('')
    setIsMobileSearchOpen(false)
    navigate(result.to)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-publishing-ink/10 bg-publishing-paper/90 backdrop-blur-md w-full">
      <div className="flex h-16 items-center justify-between gap-2 px-3 py-2 sm:px-6 lg:px-8">
        
        <div className="flex min-w-0 items-center gap-2 flex-1 sm:flex-initial">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded p-1.5 text-publishing-muted transition hover:bg-publishing-panel lg:hidden shrink-0"
          >
            <Menu size={20} />
          </button>
          <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-wider font-bold text-publishing-muted hidden sm:block">Видавничий Дім</p>
            <h1 className="truncate font-serif text-sm font-bold text-publishing-ink sm:text-xl md:text-2xl">{title}</h1>
          </div>
        </div>

        {/* Десктопний пошук */}
        <div className="relative hidden lg:block min-w-[240px] max-w-xs flex-1">
          <label className="flex items-center gap-2 rounded border border-publishing-ink/20 bg-publishing-card px-3 py-1.5 text-publishing-muted focus-within:border-publishing-gold/60">
            <Search size={15} />
            <input
              type="search"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full bg-transparent text-xs text-publishing-ink outline-none placeholder:text-publishing-muted/60"
              placeholder="Шукати автора чи книгу..."
            />
          </label>
          {globalSearch.trim().length >= 2 && (
            <div className="absolute left-0 right-0 top-full z-40 mt-1 overflow-hidden rounded border border-publishing-ink/10 bg-publishing-paper shadow-md">
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="w-full text-left block border-b border-publishing-ink/5 px-3 py-2 transition last:border-b-0 hover:bg-publishing-panel/50"
                  >
                    <p className="text-xs font-semibold text-publishing-ink">{result.label}</p>
                    <p className="text-[10px] text-publishing-muted">{result.meta}</p>
                  </button>
                ))
              ) : (
                <p className="px-3 py-2 text-[11px] text-publishing-muted">Нічого не знайдено.</p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="rounded border border-publishing-ink/10 bg-publishing-card p-1.5 text-publishing-muted lg:hidden"
          >
            <Search size={16} />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative rounded border border-publishing-ink/10 bg-publishing-card p-1.5 text-publishing-muted transition hover:text-publishing-burgundy"
            >
              <Bell size={16} />
              {dashboard?.notifications?.length > 0 && (
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-publishing-burgundy" />
              )}
            </button>
            {isNotificationsOpen && (
              <div className="absolute right-[-50px] sm:right-0 mt-2 w-72 sm:w-80 rounded border border-publishing-ink/10 bg-publishing-card p-3 shadow-lg z-50">
                <NotificationPanel
                  compact
                  notifications={dashboard?.notifications ?? []}
                  onDismiss={dismissNotification}
                />
              </div>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-2 border-l border-publishing-ink/10 pl-2.5">
            <img src={user.avatar} alt={user.name} className="h-7 w-7 rounded bg-publishing-panel border border-publishing-ink/10" />
            <div className="leading-3">
              <p className="text-[11px] font-bold text-publishing-ink">{user.name}</p>
              <p className="text-[9px] font-medium text-publishing-muted">{user.role}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="rounded border border-publishing-ink/10 bg-publishing-card p-1.5 text-publishing-muted transition hover:border-publishing-danger/40 hover:text-publishing-danger"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Мобільний пошук */}
      {isMobileSearchOpen && (
        <div className="border-t border-publishing-ink/10 bg-publishing-paper p-2 lg:hidden">
          <div className="relative">
            <input
              type="search"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full rounded border border-publishing-ink/20 bg-publishing-card py-1.5 pl-3 pr-8 text-xs text-publishing-ink outline-none"
              placeholder="Шукати автора чи книгу..."
            />
            <button onClick={() => { setGlobalSearch(''); setIsMobileSearchOpen(false); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-publishing-muted">
              <X size={14} />
            </button>
          </div>
          {globalSearch.trim().length >= 2 && (
            <div className="mt-1 rounded border border-publishing-ink/10 bg-publishing-paper shadow-md max-h-48 overflow-y-auto">
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="w-full text-left block border-b border-publishing-ink/5 px-3 py-2 text-xs"
                  >
                    <p className="font-bold text-publishing-ink">{result.label}</p>
                    <p className="text-[10px] text-publishing-muted">{result.meta}</p>
                  </button>
                ))
              ) : (
                <p className="p-2 text-xs text-publishing-muted">Нічого не знайдено.</p>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  )
}

export default Navbar