import { CalendarClock, BookOpen, Layers, UserCheck, Trophy, HardDriveDownload } from 'lucide-react'
import { useMemo } from 'react'
import { formatNumber } from '../../services/formatters'
import Badge from './Badge'
import GlassCard from './GlassCard'

const EventCard = ({ event, delay = 0, onLeave, onRegister }) => {
  const progress = useMemo(
    () => Math.min(100, Math.round((event.currentCirculation / event.maxCirculation) * 100)),
    [event.maxCirculation, event.currentCirculation],
  )
  const isFull = event.currentCirculation >= event.maxCirculation

  // Розрахунок матеріалів на основі накладу книги
  const calculations = useMemo(() => {
    const tons = ((event.currentCirculation * 250) / 1000000).toFixed(2) // умовна вага паперу
    const plates = event.bookFormat === 'Формат А4' ? 32 : 16 // технологічні форми друку
    return { tons, plates }
  }, [event.currentCirculation, event.bookFormat])

  return (
    <GlassCard className="overflow-hidden border border-publishing-ink/10" delay={delay}>
      <div className="relative h-40">
        <img src={event.image} alt={event.title} className="h-full w-full object-cover grayscale-[20%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-publishing-panel via-publishing-panel/20 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Badge variant="accent">{event.type}</Badge>
          <Badge variant="success">{event.registered ? 'Розраховано' : 'В черзі'}</Badge>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-serif text-lg font-bold text-publishing-ink leading-tight min-h-[44px]">{event.title}</h3>
        
        <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs text-publishing-muted">
          <p className="flex items-center gap-1.5 truncate">
            <BookOpen size={14} className="text-publishing-cyan" />
            {event.bookFormat}
          </p>
          <p className="flex items-center gap-1.5 truncate">
            <UserCheck size={14} className="text-publishing-burgundy" />
            {event.host}
          </p>
          <p className="flex items-center gap-1.5 col-span-2 truncate">
            <Layers size={14} className="text-publishing-gold" />
            {event.prize}
          </p>
        </div>

        {/* Секція інтерактивного калькулятора ресурсів */}
        <div className="mt-4 border-t border-b border-publishing-ink/5 py-2.5 my-3 bg-publishing-panel/50 px-2 rounded-sm text-[11px]">
          <p className="font-bold text-publishing-burgundy uppercase tracking-wider mb-1">Ресурсна калькуляція:</p>
          <div className="grid grid-cols-2 gap-1 text-publishing-ink">
            <p>Папір: <span className="font-mono font-bold">{calculations.tons} тонн</span></p>
            <p>Офсетні форми: <span className="font-mono font-bold">{calculations.plates} шт.</span></p>
            <p className="col-span-2">Планований наклад: <span className="font-mono font-bold">{formatNumber(event.currentCirculation)} прим.</span></p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => (event.registered ? onLeave?.(event.id) : onRegister?.(event.id))}
          className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-sm border border-publishing-burgundy/40 bg-publishing-burgundy/5 px-4 py-2 text-xs font-bold text-publishing-burgundy transition hover:bg-publishing-burgundy hover:text-white"
        >
          <HardDriveDownload size={14} />
          {event.registered ? 'Скасувати бронювання машини' : 'Затвердити розрахунок тиражу'}
        </button>
      </div>
    </GlassCard>
  )
}

export default EventCard