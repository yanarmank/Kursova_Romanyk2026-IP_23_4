import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import GlassCard from './GlassCard'

const tooltipStyle = {
  background: 'rgba(17, 24, 39, 0.95)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: '8px',
  color: '#E5E7EB',
}

const formatAxisValue = (value) => (value >= 1000 ? `${Math.round(value / 1000)} тис.` : value)

const ActivityChart = ({ data, title = 'Активність за тиждень' }) => (
  <GlassCard className="p-5 lg:p-6">
    <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
      <div>
        <p className="text-sm font-medium text-gaming-muted">Аналітика сервера</p>
        <h2 className="mt-1 text-xl font-bold text-gaming-text">{title}</h2>
      </div>
      <p className="text-sm text-gaming-muted">Повідомлення, голосові активності та нові входи</p>
    </div>
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="messagesGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#5865F2" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#5865F2" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="voiceGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#22C55E" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.14)" vertical={false} />
          <XAxis dataKey="day" stroke="#94A3B8" tickLine={false} axisLine={false} />
          <YAxis
            width={58}
            stroke="#94A3B8"
            tickLine={false}
            axisLine={false}
            tickFormatter={formatAxisValue}
          />
          <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#E5E7EB' }} />
          <Legend iconType="circle" />
          <Area
            type="monotone"
            dataKey="messages"
            name="Повідомлення"
            stroke="#5865F2"
            fill="url(#messagesGradient)"
            strokeWidth={3}
          />
          <Area
            type="monotone"
            dataKey="voice"
            name="Голосові хвилини"
            stroke="#22C55E"
            fill="url(#voiceGradient)"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </GlassCard>
)

export default ActivityChart
