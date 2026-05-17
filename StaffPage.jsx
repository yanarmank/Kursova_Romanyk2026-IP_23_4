import { ChevronLeft, ChevronRight, Filter, Search, Users, GraduationCap, HardHat } from 'lucide-react'
import { useMemo, useState } from 'react'
import Badge from '../components/ui/Badge'
import GlassCard from '../components/ui/GlassCard'
import UserCard from '../components/ui/UserCard'
import { useCommunity } from '../context/PublishingContext'
import { getStatusLabel } from '../services/formatters'

const pageSize = 6

const StaffPage = () => {
  const { members } = useCommunity()
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('Усі позиції')
  const [statusFilter, setStatusFilter] = useState('Усі статуси')
  const [activeTab, setActiveTab] = useState('all') // 'all', 'authors', 'staff'
  const [page, setPage] = useState(1)

  // Отримання унікальних позицій
  const roles = useMemo(
    () => ['Усі позиції', ...Array.from(new Set(members.map((item) => item.role)))],
    [members],
  )

  // Комплексна фільтрація за пошуком, селектами та табами поділу кадрів
  const filteredStaff = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    return members.filter((item) => {
      // Фільтр пошуку
      const matchesSearch =
        item.username.toLowerCase().includes(query) ||
        item.discipline.toLowerCase().includes(query) ||
        item.tag.toLowerCase().includes(query)
      
      // Фільтр випадаючих списків
      const matchesRole = roleFilter === 'Усі позиції' || item.role === roleFilter
      const matchesStatus =
        statusFilter === 'Усі статуси' || getStatusLabel(item.status) === statusFilter

      // Фільтр розділення на Авторів та Штатний Персонал
      let matchesTab = true
      if (activeTab === 'authors') matchesTab = item.isStaff === false
      if (activeTab === 'staff') matchesTab = item.isStaff === true

      return matchesSearch && matchesRole && matchesStatus && matchesTab
    })
  }, [members, roleFilter, searchTerm, statusFilter, activeTab])

  // Математика розподілу по сторінках
  const totalPages = Math.max(1, Math.ceil(filteredStaff.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const visibleStaff = filteredStaff.slice((safePage - 1) * pageSize, safePage * pageSize)

  // Поділ видимих карт на дві групи для роздільного виведення на екран
  const authorsGroup = visibleStaff.filter(m => !m.isStaff)
  const staffGroup = visibleStaff.filter(m => m.isStaff)

  return (
    <div className="page-shell">
      {/* Секція Заголовка */}
      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end border-b border-publishing-ink/5 pb-4">
        <div>
          <Badge variant="accent">Кадри та Рецензенти</Badge>
          <h2 className="font-serif text-3xl font-bold text-publishing-ink mt-1">Реєстр авторів та персоналу</h2>
          <p className="max-w-2xl text-publishing-muted text-xs leading-relaxed mt-1">
            Централізований облік професорсько-викладацького складу ІФНТУНГ, зовнішніх рецензентів та штатних технічних редакторів і друкарів типографії. Моніторинг поточної робочої завантаженості.
          </p>
        </div>
        <GlassCard className="flex items-center gap-2 px-3 py-2 bg-publishing-panel">
          <Users size={16} className="text-publishing-burgundy" />
          <div className="leading-tight">
            <p className="text-[9px] uppercase font-bold text-publishing-muted">Записів у базі</p>
            <p className="font-serif text-sm font-bold text-publishing-ink">
              {filteredStaff.length} / {members.length}
            </p>
          </div>
        </GlassCard>
      </section>

      {/* Перемикачі категорій (Таби розділення) */}
      <div className="flex border-b border-publishing-ink/10 gap-2 text-xs">
        <button
          type="button"
          onClick={() => { setActiveTab('all'); setPage(1); }}
          className={`px-4 py-2.5 font-bold uppercase tracking-wide border-b-2 transition ${activeTab === 'all' ? 'border-publishing-burgundy text-publishing-burgundy bg-publishing-panel/30' : 'border-transparent text-publishing-muted hover:text-publishing-ink'}`}
        >
          Усі учасники ({members.length})
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('authors'); setPage(1); }}
          className={`flex items-center gap-1.5 px-4 py-2.5 font-bold uppercase tracking-wide border-b-2 transition ${activeTab === 'authors' ? 'border-publishing-burgundy text-publishing-burgundy bg-publishing-panel/30' : 'border-transparent text-publishing-muted hover:text-publishing-ink'}`}
        >
          <GraduationCap size={14} />
          Академічний склад (Автори)
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('staff'); setPage(1); }}
          className={`flex items-center gap-1.5 px-4 py-2.5 font-bold uppercase tracking-wide border-b-2 transition ${activeTab === 'staff' ? 'border-publishing-burgundy text-publishing-burgundy bg-publishing-panel/30' : 'border-transparent text-publishing-muted hover:text-publishing-ink'}`}
        >
          <HardHat size={14} />
          Штатний персонал типографії
        </button>
      </div>

      {/* Інструменти Фільтрації (Пошук + Селекти) */}
      <GlassCard className="p-3 bg-publishing-panel/40">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px]">
          <label className="flex items-center gap-2 rounded-sm border border-publishing-ink/10 bg-publishing-paper px-3 py-1.5 text-publishing-muted focus-within:border-publishing-gold">
            <Search size={14} />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full bg-transparent text-xs text-publishing-ink outline-none"
              placeholder="Пошук за прізвищем, дисципліною, назвою кафедри..."
            />
          </label>

          <label className="flex items-center gap-2 rounded-sm border border-publishing-ink/10 bg-publishing-paper px-3 py-1.5 text-publishing-muted focus-within:border-publishing-gold">
            <Filter size={14} />
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              className="w-full bg-transparent text-xs text-publishing-ink outline-none cursor-pointer"
            >
              {roles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 rounded-sm border border-publishing-ink/10 bg-publishing-paper px-3 py-1.5 text-publishing-muted focus-within:border-publishing-gold">
            <Filter size={14} />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="w-full bg-transparent text-xs text-publishing-ink outline-none cursor-pointer"
            >
              <option value="Усі статуси">Усі статуси замовлень</option>
              <option value="Редагування та Коректура">Редагування</option>
              <option value="Додрукарська підготовка">Додрукарська підготовка</option>
              <option value="Друк тиражу цехом">Друк тиражу</option>
              <option value="Готово до видачі / Склад">Готово до видачі</option>
            </select>
          </label>
        </div>
      </GlassCard>

      {/* КАРТКИ УЧАСНИКІВ З Окремим Виділенням груп */}
      {visibleStaff.length > 0 ? (
        <div className="space-y-6">
          
          {/* ГРУПА АВТОРІВ */}
          {authorsGroup.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3 border-b border-publishing-ink/5 pb-1">
                <GraduationCap size={16} className="text-publishing-burgundy" />
                <h3 className="font-serif text-lg font-bold text-publishing-ink">Науково-педагогічний склад (Автори підручників та монографій)</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {authorsGroup.map((member, index) => (
                  <UserCard key={member.id} member={member} delay={index * 0.03} />
                ))}
              </div>
            </div>
          )}

          {/* ГРУПА ШТАТНОГО ПЕРСОНАЛУ */}
          {staffGroup.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-3 border-b border-publishing-ink/5 pb-1">
                <HardHat size={16} className="text-publishing-cyan" />
                <h3 className="font-serif text-lg font-bold text-publishing-ink">Адміністративний та виробничо-технічний персонал друкарні</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {staffGroup.map((member, index) => (
                  <UserCard key={member.id} member={member} delay={index * 0.03} />
                ))}
              </div>
            </div>
          )}

        </div>
      ) : (
        <GlassCard className="p-8 text-center text-publishing-muted">
          Кадрів або авторів за вибраними критеріями фільтрації не знайдено.
        </GlassCard>
      )}

      {/* Навігація сторінками (Пагінація) */}
      <div className="flex items-center justify-between gap-3 border-t border-publishing-ink/5 pt-4">
        <p className="text-xs font-semibold text-publishing-muted">
          Сторінка {safePage} з {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={safePage === 1}
            onClick={() => setPage((curr) => Math.max(1, curr - 1))}
            className="rounded-sm border border-publishing-ink/10 bg-white p-1.5 text-publishing-muted transition hover:text-publishing-ink disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            disabled={safePage === totalPages}
            onClick={() => setPage((curr) => Math.min(totalPages, curr + 1))}
            className="rounded-sm border border-publishing-ink/10 bg-white p-1.5 text-publishing-muted transition hover:text-publishing-ink disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default StaffPage