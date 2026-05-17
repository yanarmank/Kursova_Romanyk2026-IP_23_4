import clsx from 'clsx'
import { BellRing, CheckCheck, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'
import GlassCard from './GlassCard'

const iconMap = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
}

const colorMap = {
  info: 'text-gaming-cyan bg-gaming-cyan/10 border-gaming-cyan/30',
  success: 'text-gaming-success bg-gaming-success/10 border-gaming-success/30',
  warning: 'text-gaming-warning bg-gaming-warning/10 border-gaming-warning/30',
}

const NotificationList = ({ notifications, onDismiss }) => (
  <div className="space-y-3">
    {notifications.length === 0 && (
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm text-gaming-muted">
        Нових оповіщень немає.
      </div>
    )}
    {notifications.map((notification) => {
      const Icon = iconMap[notification.level] ?? Info

      return (
        <div
          key={notification.id}
          className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3"
        >
          <div className={clsx('h-fit rounded-lg border p-2', colorMap[notification.level])}>
            <Icon size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gaming-text">{notification.title}</p>
            <p className="mt-1 text-sm leading-6 text-gaming-muted">{notification.body}</p>
          </div>
          {onDismiss && (
            <button
              type="button"
              onClick={() => onDismiss(notification.id)}
              className="h-fit rounded-md p-1 text-gaming-muted transition hover:bg-white/10 hover:text-white"
              title="Прибрати оповіщення"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )
    })}
  </div>
)

const NotificationPanel = ({
  notifications = [],
  compact = false,
  className,
  onClear,
  onDismiss,
}) => {
  if (compact) {
    return <NotificationList notifications={notifications} onDismiss={onDismiss} />
  }

  return (
    <GlassCard className={clsx('p-5', className)}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gaming-muted">Оповіщення</p>
          <h2 className="mt-1 text-xl font-bold text-gaming-text">Стан спільноти</h2>
        </div>
        {notifications.length > 0 ? (
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg border border-gaming-accent/30 bg-gaming-accent/10 p-3 text-indigo-200 transition hover:border-gaming-success/40 hover:text-emerald-200"
            title="Позначити все як прочитане"
          >
            <CheckCheck size={22} />
          </button>
        ) : (
          <div className="rounded-lg border border-gaming-accent/30 bg-gaming-accent/10 p-3 text-indigo-200">
            <BellRing size={22} />
          </div>
        )}
      </div>
      <NotificationList notifications={notifications} onDismiss={onDismiss} />
    </GlassCard>
  )
}

export default NotificationPanel
