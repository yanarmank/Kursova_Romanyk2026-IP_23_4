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
  const { clearNotifications, dashboard, dismissNotification } = useCommunity()

  return (
    <div className="page-shell space-y-6">
      {/* 1. Секція ключових маркерів */}
      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
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

      {/* 2. НОВИЙ ГОРИЗОНТАЛЬНИЙ ВІДЖЕТ ЛОГІСТИКИ НА ВСЮ ШИРИНУ СТОРІНКИ */}
      <section className="w-full">
        <GlassCard className="p-5 border border-publishing-gold/30 bg-publishing-panel/40 w-full shadow-sm">
          {/* Верхня частина: Заголовок та Опис в один рядок для десктопів */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-publishing-ink/5 pb-3">
            <div className="flex items-center gap-2 text-publishing-burgundy font-serif font-bold text-base">
              <Box size={18} className="shrink-0" />
              <h3>Логістика паперового складу</h3>
            </div>
            <p className="text-[11px] text-publishing-muted max-w-2xl leading-relaxed">
              Моніторинг завантаження складських площ та оптимізація розміщення рулонів офсетного паперу.
            </p>
          </div>

          {/* Середня частина: Інформаційні мітки та прогрес-бар */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-publishing-ink font-semibold">Завантажувальний сектор</span>
              <span className="font-mono font-bold text-publishing-burgundy bg-publishing-burgundy/5 px-2.5 py-0.5 rounded-sm">
                Зайнято: 78%
              </span>
            </div>

            {/* Прогрес-бар на всю довжину */}
            <div className="w-full h-3.5 rounded-full bg-publishing-ink/10 overflow-hidden relative shadow-inner">
              <div 
                className="h-full bg-publishing-gold transition-all duration-500 rounded-full" 
                style={{ width: '78%' }}
              />
            </div>
          </div>

          {/* Нижня частина: Статуси та вільний об'єм */}
          <div className="mt-3 flex items-center justify-between text-xs font-mono text-publishing-muted">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-publishing-success animate-pulse" />
              <span>План поставок: <span className="text-publishing-ink font-bold">Норма</span></span>
            </div>
            <span className="font-medium text-publishing-ink">
              Резервний об'єм: <span className="text-publishing-success font-bold">4.2 тонни</span>
            </span>
          </div>
        </GlassCard>
      </section>

      {/* 3. Графік виробництва + Панель сповіщень */}
      <section className="grid gap-6 grid-cols-1 xl:grid-cols-[1fr_23rem]">
        <div className="w-full overflow-x-hidden">
          <ActivityChart data={dashboard.activity} title="Динаміка випуску продукції (примірники)" />
        </div>
        
        <div className="w-full">
          <NotificationPanel
            notifications={dashboard.notifications}
            onClear={clearNotifications}
            onDismiss={dismissNotification}
          />
        </div>
      </section>

      {/* 4. Жива технологічна стрічка цеху та Розподіл за категоріями */}
      <section className="grid gap-6 grid-cols-1 xl:grid-cols-[1fr_1fr]">
        <GlassCard className="p-4 w-full">
          <div className="mb-4 flex items-center justify-between border-b border-publishing-ink/5 pb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-publishing-muted">Оперативний облік</p>
              <h2 className="font-serif text-base sm:text-lg font-bold text-publishing-ink">Технологічна стрічка цеху</h2>
            </div>
            <div className="rounded-sm bg-publishing-burgundy/10 p-2 text-publishing-burgundy shrink-0">
              <Sparkles size={16} />
            </div>
          </div>
          
          <div className="space-y-2.5">
            {dashboard.recentEvents.map((event) => (
              <div
                key={event.id}
                className="flex flex-col gap-2 border border-publishing-ink/10 bg-publishing-paper p-3 sm:flex-row sm:items-center sm:justify-between rounded-sm"
              >
                <div>
                  <Badge variant={event.type === 'Редагування' ? 'warning' : 'accent'}>
                    {event.type}
                  </Badge>
                  <p className="mt-1 text-xs font-bold text-publishing-ink">{event.title}</p>
                  <p className="text-[10px] text-publishing-muted">{event.time}</p>
                </div>
                <p className="text-xs font-mono font-bold text-publishing-burgundy sm:text-right">{event.impact}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-4 w-full">
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