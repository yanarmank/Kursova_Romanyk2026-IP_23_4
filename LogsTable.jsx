import { ShieldAlert, Trash2 } from 'lucide-react'
import { formatDateTime } from '../../services/formatters'
import Badge from './Badge'
import GlassCard from './GlassCard'

const severityVariant = {
  Низький: 'success',
  Середній: 'warning',
  Високий: 'danger',
  Критичний: 'danger',
}

const LogsTable = ({ logs, onDelete }) => (
  <GlassCard className="overflow-hidden border border-publishing-ink/10">
    <div className="flex items-center justify-between gap-4 border-b border-publishing-ink/10 p-4 bg-publishing-panel/40">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-publishing-muted">Скрізний технологічний контроль</p>
        <h2 className="font-serif text-xl font-bold text-publishing-ink">Архів операцій цеху та правок</h2>
      </div>
      <div className="rounded-sm border border-publishing-danger/30 bg-publishing-danger/5 p-2 text-publishing-danger">
        <ShieldAlert size={18} />
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] border-collapse text-left text-xs">
        <thead className="bg-publishing-panel text-publishing-muted uppercase font-bold tracking-wider text-[10px] border-b border-publishing-ink/10">
          <tr>
            <th className="px-4 py-3">Часовий штамп</th>
            <th className="px-4 py-3">Виробничий етап</th>
            <th className="px-4 py-3">Замовник / Автор</th>
            <th className="px-4 py-3">Оператор ERP</th>
            <th className="px-4 py-3">Канал / Лінія</th>
            <th className="px-4 py-3">Коментар та обґрунтування правок</th>
            <th className="px-4 py-3">Пріоритет</th>
            {onDelete && <th className="px-4 py-3 text-center">Дії</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-publishing-ink/5">
          {logs.map((log) => (
            <tr key={log.id} className="transition hover:bg-publishing-panel/30">
              <td className="px-4 py-3 text-publishing-muted font-mono">{formatDateTime(log.date)}</td>
              <td className="px-4 py-3">
                <Badge variant={log.action === 'Друк тиражу' ? 'danger' : 'accent'}>{log.action}</Badge>
              </td>
              <td className="px-4 py-3 font-bold text-publishing-ink">{log.user}</td>
              <td className="px-4 py-3 text-publishing-muted">{log.moderator}</td>
              <td className="px-4 py-3 text-publishing-cyan font-medium">{log.department}</td>
              <td className="px-4 py-3 max-w-xs truncate text-publishing-muted" title={log.reason}>{log.reason}</td>
              <td className="px-4 py-3">
                <Badge variant={severityVariant[log.severity]}>{log.severity}</Badge>
              </td>
              {onDelete && (
                <td className="px-4 py-3 text-center">
                  <button
                    type="button"
                    onClick={() => onDelete(log.id)}
                    className="rounded-sm border border-publishing-ink/10 bg-white p-1.5 text-publishing-muted transition hover:border-publishing-danger/40 hover:text-publishing-danger"
                    title="Видалити запис журналу"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </GlassCard>
)

export default LogsTable