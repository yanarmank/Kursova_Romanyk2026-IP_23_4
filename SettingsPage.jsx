import { Hash, Palette, Save, Settings, ShieldCheck, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import Badge from '../components/ui/Badge'
import GlassCard from '../components/ui/GlassCard'
import { useCommunity } from '../context/PublishingContext'
import { useThemeSettings } from '../context/ThemeContext'

const Toggle = ({ label, checked, onChange }) => (
  <button
    type="button"
    aria-pressed={checked}
    onClick={() => onChange(!checked)}
    className="flex w-full items-center justify-between gap-4 rounded border border-publishing-ink/10 bg-[#F5F2EA]/40 px-4 py-2.5 text-left transition hover:border-publishing-gold"
  >
    <span className="text-sm font-semibold text-publishing-ink">{label}</span>
    <span className={`flex h-5 w-10 items-center rounded-full p-0.5 transition ${checked ? 'bg-publishing-burgundy' : 'bg-slate-400'}`}>
      <span className={`h-4 w-4 rounded-full bg-white transition ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </span>
  </button>
)

const SettingsPage = () => {
  const { settings, toggleRolePermission, updateChannelStatus, updatePreference } = useCommunity()
  const { themeSettings, updateThemeSetting } = useThemeSettings()
  const [isSaved, setIsSaved] = useState(false)

  return (
    <div className="page-shell">
      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end border-b border-publishing-ink/5 pb-5">
        <div>
          <Badge variant="accent">Конфігурація ERP</Badge>
          <h2 className="mt-2 font-serif text-3xl font-bold text-publishing-ink">Параметри видавничих ліній</h2>
          <p className="mt-1 text-sm text-publishing-muted">Управління рівнями доступу рецензентів та режимами відображення звітів курсової роботи.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsSaved(true)}
          className="inline-flex items-center gap-2 rounded bg-publishing-success px-4 py-2.5 text-sm font-bold text-publishing-paper shadow-sm hover:bg-[#2d4b36]"
        >
          <Save size={16} />
          {isSaved ? 'Конфігурацію збережено' : 'Зберегти зміни макету'}
        </button>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <GlassCard className="p-5">
          <div className="mb-4 flex items-center gap-3 border-b border-publishing-ink/5 pb-3">
            <div className="rounded bg-publishing-burgundy/10 p-2 text-publishing-burgundy">
              <Palette size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-publishing-muted">Інтерфейс</p>
              <h2 className="font-serif text-lg font-bold text-publishing-ink">Візуальний режим відображення</h2>
            </div>
          </div>
          <div className="space-y-2.5">
            <Toggle
              label="Компактний книжковий перегляд таблиць"
              checked={themeSettings.compactMode}
              onChange={(val) => updateThemeSetting('compactMode', val)}
            />
            <Toggle
              label="Плавні академічні анімації"
              checked={themeSettings.animatedCards}
              onChange={(val) => updateThemeSetting('animatedCards', val)}
            />
            <Toggle
              label="Високий контраст (для друку звітів)"
              checked={themeSettings.highContrast}
              onChange={(val) => updateThemeSetting('highContrast', val)}
            />
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="mb-4 flex items-center gap-3 border-b border-publishing-ink/5 pb-3">
            <div className="rounded bg-publishing-success/10 p-2 text-publishing-success">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-publishing-muted">Права та доступ</p>
              <h2 className="font-serif text-lg font-bold text-publishing-ink">Матриця повноважень колегії</h2>
            </div>
          </div>
          <div className="space-y-3">
            {settings?.roles?.map((role) => (
              <div key={role.name} className="rounded border border-publishing-ink/10 bg-[#F5F2EA]/40 p-3.5">
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: role.color }} />
                  <p className="text-sm font-bold text-publishing-ink">{role.name}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['Повний доступ', 'Редагування макетів', 'Запуск друку', 'Затвердження Вченою радою'].map((perm) => (
                    <button
                      type="button"
                      key={perm}
                      onClick={() => toggleRolePermission(role.name, perm)}
                    >
                      <Badge variant={role.permissions.includes(perm) ? 'success' : 'muted'}>
                        {perm}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>
    </div>
  )
}

export default SettingsPage