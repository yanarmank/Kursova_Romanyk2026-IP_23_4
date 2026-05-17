import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, Calculator, FileText, LayoutDashboard, Settings, Users, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'

const navItems = [
  { to: '/dashboard', label: 'Огляд', icon: LayoutDashboard },
  { to: '/store', label: 'Книжкова вітрина', icon: BookOpen }, // Додано новий пункт меню
  { to: '/staff', label: 'Автори та Персонал', icon: Users },
  { to: '/calculator', label: 'Калькулятор тиражів', icon: Calculator },
  { to: '/orders', label: 'Журнал друку', icon: FileText },
  { to: '/settings', label: 'Налаштування', icon: Settings },
]

const SidebarContent = ({ onClose }) => (
  <div className="flex h-full flex-col bg-[#F5F2EA]">
    <div className="flex items-center justify-between border-b border-publishing-ink/10 px-5 py-4">
      <NavLink to="/dashboard" onClick={onClose} className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded bg-publishing-burgundy text-publishing-paper shadow-sm">
          <BookOpen size={20} />
        </div>
        <div>
          <p className="font-serif text-base font-bold text-publishing-ink leading-tight">Типографія Елітна</p>
          <p className="text-[10px] uppercase font-bold tracking-wider text-publishing-muted">ERP-Платформа</p>
        </div>
      </NavLink>
      <button
        type="button"
        onClick={onClose}
        className="rounded p-1.5 text-publishing-muted transition hover:bg-publishing-panel lg:hidden"
      >
        <X size={18} />
      </button>
    </div>

    <nav className="flex-1 space-y-1.5 px-3 py-4">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onClose}
          className={({ isActive }) =>
            clsx(
              'flex items-center gap-3 rounded px-4 py-2.5 text-sm font-semibold transition-all duration-200',
              isActive
                ? 'bg-publishing-burgundy text-publishing-paper shadow-md font-bold'
                : 'text-publishing-muted hover:bg-publishing-panel hover:text-publishing-ink',
            )
          }
        >
          <item.icon size={17} />
          {item.label}
        </NavLink>
      ))}
    </nav>

    {/* Індикатор завантаження обладнання типографії */}
    <div className="m-4 rounded border border-publishing-gold/20 bg-publishing-panel/40 p-4">
      <p className="text-xs font-bold text-publishing-burgundy">Статус виробничого цеху</p>
      <p className="mt-1 text-[11px] leading-relaxed text-publishing-muted">
        Офсетний верстат Heidelberg завантажений на 92%. Поточний план виконується вчасно.
      </p>
      <div className="mt-3 h-1.5 rounded-full bg-publishing-ink/10 overflow-hidden">
        <div className="h-full w-[92%] bg-publishing-gold" />
      </div>
    </div>
  </div>
)

const Sidebar = ({ isOpen, onClose }) => (
  <>
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-publishing-ink/10 bg-[#F5F2EA] lg:block">
      <SidebarContent />
    </aside>

    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-publishing-ink/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        >
          <motion.aside
            initial={{ x: -288 }}
            animate={{ x: 0 }}
            exit={{ x: -288 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="h-full w-72 bg-[#F5F2EA]"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent onClose={onClose} />
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  </>
)

export default Sidebar