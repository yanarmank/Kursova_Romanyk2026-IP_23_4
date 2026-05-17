import { BookOpenCheck, Layers, FileText, Scale, Sparkles, Box } from 'lucide-react'
import ActivityChart from '../components/ui/ActivityChart'
import Badge from '../components/ui/Badge'
import GlassCard from '../components/ui/GlassCard'
import NotificationPanel from '../components/ui/NotificationPanel'
import StatCard from '../components/ui/StatCard'
import { useCommunity } from '../context/PublishingContext'

const statIcons = {
  books: BookOpenCheck,
  orders_active: Layers,
  manuscripts: FileText,
  revenue: Scale,
}

const DashboardPage = () => {
  const { clearNotifications, dashboard, dismissNotification, members } = useCommunity()
  const activeAuthors = members.slice(0, 4)

  return (
    <div className="page-shell">
      {/* Секція ключових маркерів */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboard.stats.map((stat, index) => (
          <StatCard
            key={stat.id}
            icon={statIcons[stat.id]}
            label={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            change={stat.change}
            tone={stat.tone}
            delay={index * 0.05}
          />
        ))}
      </section>

      {/* Графік виробництва + Контейнерний віджет оптимізації логістики паперу */}
      <section className="grid gap-6 xl:grid-cols-[1fr_23rem]">
        <ActivityChart data={dashboard.activity} title="Динаміка випуску продукції (примірники)" />
        
        <div className="space-y-4">
          <NotificationPanel
            notifications={dashboard.notifications}
            onClear={clearNotifications}
            onDismiss={dismissNotification}
          />

          {/* Кастомний віджет: Контейнерне планування завантаження сировини для Nordic-Bud */}
          <GlassCard className="p-4 border border-publishing-gold/30 bg-publishing-panel/40">
            <div className="flex items-center gap-2 text-publishing-burgundy font-serif font-bold text-base">
              <Box size={18} />
              <h3>Логістика сировини (20-футовий модуль)</h3>
            </div>
            <p className="text-[11px] text-publishing-muted mt-1 leading-tight">
              Оптимізація площі зберігання рулонів офсету для контрактів ТзОВ «Нордік-Буд».
            </p>
            <div className="mt-3 border border-publishing-ink/20 h-16 relative bg-publishing-paper overflow-hidden flex items-center justify-center rounded-sm">
              <div className="absolute left-0 top-0 bottom-0 bg-publishing-gold/25 w-[78%] flex items-center justify-end pr-2 text-[10px] font-bold text-publishing-burgundy">
                Зайнято: 78%
              </div>
              <span className="z-10 font-mono text-[11px] font-bold text-publishing-ink/70">20-Ft Container Layout</span>
            </div>
            <p className="text-[10px] text-publishing-muted mt-1.5 text-right">Вільний простір: 4.2 тонни сировини.</p>
          </GlassCard>
        </div>
      </section>

      {/* Жива технологічна стрічка */}
      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <GlassCard className="p-4">
          <div className="mb-4 flex items-center justify-between border-b border-publishing-ink/5 pb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-publishing-muted">Оперативний облік</p>
              <h2 className="font-serif text-lg font-bold text-publishing-ink">Технологічна стрічка цеху</h2>
            </div>
            <div className="rounded-sm bg-publishing-burgundy/10 p-2 text-publishing-burgundy">
              <Sparkles size={16} />
            </div>
          </div>
          
          <div className="space-y-2.5">
            {dashboard.recentEvents.map((event) => (
              <div
                key={event.id}
                className="flex flex-col justify-between gap-2 border border-publishing-ink/10 bg-publishing-paper p-3 sm:flex-row sm:items-center rounded-sm"
              >
                <div>
                  <Badge variant={event.type === 'Редагування' ? 'warning' : 'accent'}>
                    {event.type}
                  </Badge>
                  <p className="mt-1 text-xs font-bold text-publishing-ink">{event.title}</p>
                  <p className="text-[10px] text-publishing-muted">{event.time}</p>
                </div>
                <p className="text-xs font-mono font-bold text-publishing-burgundy">{event.impact}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Частка за категоріями */}
        <GlassCard className="p-4">
          <h2 className="font-serif text-lg font-bold text-publishing-ink mb-4 border-b border-publishing-ink/5 pb-3">Розподіл потужностей за категоріями</h2>
          <div className="space-y-3">
            {dashboard.moderationStats.map((item) => {
              const total = dashboard.moderationStats.reduce((sum, stat) => sum + stat.value, 0)
              const width = Math.round((item.value / total) * 100)

              return (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-semibold text-publishing-ink">{item.label}</span>
                    <span className="text-publishing-muted font-bold font-mono">{width}%</span>
                  </div>
                  <div className="h-2 rounded-sm bg-publishing-ink/5 overflow-hidden">
                    <div
                      className="h-full transition-all duration-500"
                      style={{ width: `${width}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </GlassCard>
      </section>
    </div>
  )
}

export default DashboardPage