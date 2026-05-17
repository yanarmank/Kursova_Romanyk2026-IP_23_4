import { ArrowLeft, CalendarDays, Gamepad2, Medal, MessageCircle, Mic2, ShieldAlert, Trophy, UserCog } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Badge from '../components/ui/Badge'
import GlassCard from '../components/ui/GlassCard'
import { useAuth } from '../context/AuthContext'
import { useCommunity } from '../context/PublishingContext'
import { formatDate, formatNumber, getStatusClass, getStatusLabel } from '../services/formatters'

const AuthorProfilePage = () => {
  const { authorId } = useParams()
  const { user } = useAuth()
  const { addModerationLog, members, updateMember } = useCommunity()
  const member = members.find((item) => item.id === authorId)

  if (!member) {
    return (
      <div className="page-shell">
        <GlassCard className="p-8 text-center">
          <p className="font-serif text-lg font-bold text-publishing-ink">Автора/Видання не знайдено у реєстрах.</p>
          <Link to="/staff" className="mt-4 inline-flex text-sm font-bold text-publishing-burgundy underline">
            Повернутися до списку
          </Link>
        </GlassCard>
      </div>
    )
  }

  const stats = [
    { label: 'Опрацьовано сторінок', value: formatNumber(member.messages), icon: MessageCircle, color: 'text-publishing-burgundy' },
    { label: 'Годин рецензування', value: formatNumber(member.voiceHours), icon: Mic2, color: 'text-publishing-success' },
    { label: 'Рейтинг у системі', value: member.level, icon: Trophy, color: 'text-publishing-gold' },
    { label: 'Зауважень коректора', value: member.warnings, icon: ShieldAlert, color: 'text-publishing-danger' },
  ]

  return (
    <div className="page-shell">
      <Link
        to="/staff"
        className="inline-flex w-fit items-center gap-2 rounded border border-publishing-ink/10 bg-[#F5F2EA] px-3 py-1.5 text-xs font-bold text-publishing-muted transition hover:text-publishing-ink"
      >
        <ArrowLeft size={14} /> Назад до реєстру
      </Link>

      <section className="grid gap-6 xl:grid-cols-[22rem_1fr]">
        <GlassCard className="p-5 text-center">
          <div className="relative mx-auto w-24 h-24">
            <img src={member.avatar} alt={member.username} className="rounded-full border border-publishing-ink/10 bg-publishing-panel object-cover w-full h-full" />
            <span className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-[#F5F2EA] ${getStatusClass(member.status)}`} />
          </div>
          <h2 className="mt-4 font-serif text-2xl font-bold text-publishing-ink">{member.username}</h2>
          <p className="text-xs text-publishing-muted">{member.tag}</p>
          
          <div className="mt-3 flex justify-center gap-2">
            <Badge variant="accent">{member.role}</Badge>
            <Badge variant="success">{getStatusLabel(member.status)}</Badge>
          </div>

          <div className="mt-5 space-y-2 border-t border-publishing-ink/10 pt-4 text-left text-xs text-publishing-muted">
            <p className="flex items-center gap-2">
              <Gamepad2 size={14} className="text-publishing-burgundy" /> Напрямок: <span className="font-bold text-publishing-ink">{member.favoriteGame}</span>
            </p>
            <p className="flex items-center gap-2">
              <CalendarDays size={14} className="text-publishing-gold" /> Реєстрація: <span className="font-bold text-publishing-ink">{formatDate(member.joined)}</span>
            </p>
          </div>
        </GlassCard>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <GlassCard key={s.label} className="p-4 bg-[#F5F2EA]">
              <s.icon size={18} className={s.color} />
              <p className="mt-3 font-serif text-2xl font-bold text-publishing-ink">{s.value}</p>
              <p className="text-[11px] text-publishing-muted font-medium">{s.label}</p>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  )
}

export default AuthorProfilePage