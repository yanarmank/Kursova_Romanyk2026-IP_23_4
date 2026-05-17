import { FileCode, Search, ShieldAlert } from 'lucide-react'
import { useMemo, useState } from 'react'
import Badge from '../components/ui/Badge'
import GlassCard from '../components/ui/GlassCard'
import LogsTable from '../components/ui/LogsTable'
import { useAuth } from '../context/AuthContext'
import { useCommunity } from '../context/PublishingContext'

const OrderLogPage = () => {
  const { user } = useAuth()
  const { addModerationLog, deleteModerationLog, logs, members } = useCommunity()
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState('Усі етапи')
  
  const [form, setForm] = useState({
    action: 'Коректура формул',
    department: 'Методичні видання',
    reason: '',
    severity: 'Середній',
    user: members[0]?.username ?? '',
  })

  const actions = useMemo(
    () => ['Усі етапи', ...Array.from(new Set(logs.map((log) => log.action)))],
    [logs],
  )

  const filteredLogs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    return logs.filter((log) => {
      const matchesAction = actionFilter === 'Усі етапи' || log.action === actionFilter
      return matchesAction && (
        log.user.toLowerCase().includes(query) ||
        log.reason.toLowerCase().includes(query) ||
        log.department.toLowerCase().includes(query)
      )
    })
  }, [actionFilter, logs, searchTerm])

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.user || !form.reason.trim()) return

    addModerationLog({
      ...form,
      moderator: user.name,
      reason: form.reason.trim(),
    })
    setForm((current) => ({ ...current, reason: '' }))
  }

  return (
    <div className="page-shell">
      <section>
        <Badge variant="warning">Операційне журналювання</Badge>
        <h2 className="mt-1 font-serif text-3xl font-bold text-publishing-ink">Журнал виробничих операцій</h2>
        <p className="text-xs text-publishing-muted mt-1">
          Контроль засідань Вченої Ради, виводу офсетних пластин, верифікації пікетажів ПК 00+00 — ПК 28+95 та налаштувань сепараторів.
        </p>
      </section>

      {/* Фільтрація */}
      <GlassCard className="p-3 bg-publishing-panel/60">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <label className="flex items-center gap-2 rounded-sm border border-publishing-ink/10 bg-publishing-paper px-3 py-1.5 text-publishing-muted focus-within:border-publishing-gold">
            <Search size={14} />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-xs text-publishing-ink outline-none"
              placeholder="Шукати за прізвищем автора, коментарем, назвою кафедри..."
            />
          </label>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="rounded-sm border border-publishing-ink/10 bg-publishing-paper px-2 py-1.5 text-xs text-publishing-ink outline-none cursor-pointer"
          >
            {actions.map((act) => (
              <option key={act} value={act}>{act}</option>
            ))}
          </select>
        </div>
      </GlassCard>

      {/* Форма реєстрації дії */}
      <GlassCard className="p-4 border border-publishing-burgundy/20">
        <h3 className="font-serif font-bold text-base text-publishing-ink mb-3">Оновити виробничий статус макету</h3>
        <form onSubmit={handleSubmit} className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-6 items-end">
          <div>
            <label className="block text-[10px] font-bold uppercase text-publishing-muted mb-1">Автор / Замовник</label>
            <select
              value={form.user}
              onChange={(e) => updateForm('user', e.target.value)}
              className="w-full rounded-sm border border-publishing-ink/10 bg-publishing-paper p-1.5 text-xs outline-none"
            >
              {members.map((m) => (
                <option key={m.id} value={m.username}>{m.username}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-publishing-muted mb-1">Виробничий крок</label>
            <select
              value={form.action}
              onChange={(e) => updateForm('action', e.target.value)}
              className="w-full rounded-sm border border-publishing-ink/10 bg-publishing-paper p-1.5 text-xs outline-none"
            >
              {['Коректура формул', 'Додрукарська перевірка', 'Друк тиражу', 'Верифікація пікетажу'].map((act) => (
                <option key={act} value={act}>{act}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-publishing-muted mb-1">Критичність правок</label>
            <select
              value={form.severity}
              onChange={(e) => updateForm('severity', e.target.value)}
              className="w-full rounded-sm border border-publishing-ink/10 bg-publishing-paper p-1.5 text-xs outline-none"
            >
              {['Низький', 'Середній', 'Високий', 'Критичний'].map((sev) => (
                <option key={sev} value={sev}>{sev}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-publishing-muted mb-1">Лінія / Кафедра</label>
            <select
              value={form.department}
              onChange={(e) => updateForm('department', e.target.value)}
              className="w-full rounded-sm border border-publishing-ink/10 bg-publishing-paper p-1.5 text-xs outline-none"
            >
              {['Монографії', 'Підручники', 'Методичні видання', 'Промислові каталоги'].map((dep) => (
                <option key={dep} value={dep}>{dep}</option>
              ))}
            </select>
          </div>
          <div className="xl:col-span-2">
            <label className="block text-[10px] font-bold uppercase text-publishing-muted mb-1">Технічне обґрунтування</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.reason}
                onChange={(e) => updateForm('reason', e.target.value)}
                className="w-full rounded-sm border border-publishing-ink/10 bg-publishing-paper px-3 py-1.5 text-xs outline-none"
                placeholder="Наприклад: Внесення змін у схеми сепараторів ПЗГ..."
              />
              <button
                type="submit"
                className="rounded-sm bg-publishing-burgundy px-4 py-1.5 text-xs font-bold text-white transition hover:bg-opacity-90"
              >
                Внести
              </button>
            </div>
          </div>
        </form>
      </GlassCard>

      <LogsTable logs={filteredLogs} onDelete={deleteModerationLog} />
    </div>
  )
}

export default OrderLogPage