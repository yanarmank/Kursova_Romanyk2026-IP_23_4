import clsx from 'clsx'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { formatNumber } from '../../services/formatters'
import GlassCard from './GlassCard'

const toneClasses = {
  accent: 'bg-gaming-accent/15 text-indigo-200 border-gaming-accent/30',
  success: 'bg-gaming-success/15 text-emerald-200 border-gaming-success/30',
  cyan: 'bg-gaming-cyan/15 text-cyan-200 border-gaming-cyan/30',
  warning: 'bg-gaming-warning/15 text-amber-200 border-gaming-warning/30',
  danger: 'bg-gaming-danger/15 text-rose-200 border-gaming-danger/30',
}

const StatCard = ({ icon: Icon, label, value, suffix = '', change, tone = 'accent', delay }) => {
  const isPositive = !change?.trim().startsWith('-')
  const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight

  return (
    <GlassCard className="p-5" delay={delay}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gaming-muted">{label}</p>
          <div className="mt-3 flex items-end gap-1">
            <span className="text-3xl font-bold text-gaming-text sm:text-4xl">
              {formatNumber(value)}
            </span>
            <span className="pb-1 text-lg font-semibold text-gaming-muted">{suffix}</span>
          </div>
        </div>
        <div className={clsx('rounded-lg border p-3', toneClasses[tone])}>
          <Icon size={22} />
        </div>
      </div>
      <div className="mt-5 flex items-center gap-2 text-sm">
        <TrendIcon
          size={16}
          className={isPositive ? 'text-gaming-success' : 'text-gaming-danger'}
        />
        <span className={isPositive ? 'text-emerald-200' : 'text-rose-200'}>{change}</span>
      </div>
    </GlassCard>
  )
}

export default StatCard
