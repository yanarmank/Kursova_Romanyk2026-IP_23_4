import { Bookmark, BookOpen, FileCode, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatNumber, getStatusClass, getStatusLabel } from '../../services/formatters'
import Badge from './Badge'
import GlassCard from './GlassCard'

const roleVariant = {
  Автор: 'accent',
  Редактор: 'success',
  Коректор: 'cyan',
  Адміністратор: 'danger',
}

const UserCard = ({ member, delay = 0 }) => (
  <GlassCard className="group p-4 transition hover:border-publishing-burgundy/40" delay={delay}>
    <Link to={`/members/${member.id}`} className="flex h-full flex-col justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <img
            src={member.avatar}
            alt={member.username}
            className="h-12 w-12 rounded-sm border border-publishing-ink/10 bg-publishing-panel object-cover"
          />
          <span
            className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-publishing-panel ${getStatusClass(
              member.status,
            )}`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-1">
            <div className="min-w-0">
              <h3 className="font-serif text-base font-bold text-publishing-ink group-hover:text-publishing-burgundy truncate">
                {member.username}
              </h3>
              <p className="text-[11px] text-publishing-muted truncate font-mono">{member.tag}</p>
            </div>
            <Badge variant={roleVariant[member.role]}>{member.role}</Badge>
          </div>
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-publishing-muted truncate">
            <BookOpen size={14} className="text-publishing-cyan" />
            Дисципліна: <span className="text-publishing-ink font-medium">{member.discipline}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
        <div className="bg-publishing-panel/50 p-2 rounded-sm border border-publishing-ink/5">
          <Bookmark size={14} className="mx-auto mb-0.5 text-publishing-gold" />
          <p className="font-mono font-bold text-publishing-ink">{member.level}</p>
          <p className="text-[10px] text-publishing-muted">пріоритет</p>
        </div>
        <div className="bg-publishing-panel/50 p-2 rounded-sm border border-publishing-ink/5">
          <FileCode size={14} className="mx-auto mb-0.5 text-publishing-burgundy" />
          <p className="font-mono font-bold text-publishing-ink">{formatNumber(member.messages)}</p>
          <p className="text-[10px] text-publishing-muted">сторінок</p>
        </div>
        <div className="bg-publishing-panel/50 p-2 rounded-sm border border-publishing-ink/5">
          <Clock size={14} className="mx-auto mb-0.5 text-publishing-success" />
          <p className="font-mono font-bold text-publishing-ink">{formatNumber(member.voiceHours)}</p>
          <p className="text-[10px] text-publishing-muted">годин рец.</p>
        </div>
      </div>
    </Link>
  </GlassCard>
)

export default UserCard