import { motion } from 'framer-motion'
import { BookOpen, Lock, Mail, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { demoAccounts, useAuth } from '../context/AuthContext'

const defaultDemoAccount = demoAccounts[0]

const LoginPage = () => {
  const [email, setEmail] = useState(defaultDemoAccount.email)
  const [password, setPassword] = useState(defaultDemoAccount.password)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!email.trim() || !password.trim()) {
      setError('Заповніть email і пароль для входу в систему ERP.')
      return
    }

    const result = login({ email, password, remember })

    if (!result.ok) {
      setError(result.message)
      return
    }

    navigate('/dashboard')
  }

  return (
    <main className="min-h-screen bg-[#FBF9F4] px-4 py-6 text-publishing-ink font-sans flex items-center justify-center">
      <div className="mx-auto grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        
        {/* Презентаційний лівий блок */}
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="hidden lg:block space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded bg-publishing-burgundy text-publishing-paper shadow-sm">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-xl font-serif font-bold text-publishing-ink">Typography & Publishing ERP</p>
              <p className="text-xs text-publishing-muted">Автоматизоване робоче місце головного редактора</p>
            </div>
          </div>

          <div className="editorial-card overflow-hidden bg-[#F5F2EA]">
            <div className="h-52 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center">
              <div className="flex h-full items-end bg-gradient-to-t from-[#F5F2EA] via-[#F5F2EA]/20 to-transparent p-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-publishing-burgundy">Академічне видання</p>
                  <h1 className="mt-1 max-w-lg font-serif text-3xl font-bold text-publishing-ink leading-tight">
                    Цифрова інфраструктура друкарського комплексу
                  </h1>
                </div>
              </div>
            </div>
            <div className="grid gap-3 p-5 sm:grid-cols-3 border-t border-publishing-ink/5">
              {[
                ['45.8K', 'наклад книг'],
                ['18', 'активних замовлень'],
                ['92%', 'завантаження цеху'],
              ].map(([value, label]) => (
                <div key={label} className="rounded border border-publishing-ink/10 bg-[#FBF9F4] p-3 text-center">
                  <p className="text-xl font-bold font-serif text-publishing-burgundy">{value}</p>
                  <p className="mt-0.5 text-xs text-publishing-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Права форма входу */}
        <motion.section
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.42 }}
          className="editorial-card w-full max-w-md p-6 sm:p-8 bg-[#F5F2EA]"
        >
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded bg-publishing-gold text-publishing-paper">
              <ShieldCheck size={24} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-publishing-ink">Авторизація в ERP</h2>
            <p className="mt-1 text-xs text-publishing-muted">Захищений доступ до видавничих реєстрів</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-publishing-ink">Електронна пошта</span>
              <span className="flex items-center gap-3 rounded border border-publishing-ink/20 bg-[#FBF9F4] px-3 py-2.5 focus-within:border-publishing-burgundy">
                <Mail size={16} className="text-publishing-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm text-publishing-ink outline-none placeholder:text-publishing-muted/50"
                  placeholder={defaultDemoAccount.email}
                />
              </span>
            </div>

            <div>
              <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-publishing-ink">Пароль</span>
              <span className="flex items-center gap-3 rounded border border-publishing-ink/20 bg-[#FBF9F4] px-3 py-2.5 focus-within:border-publishing-burgundy">
                <Lock size={16} className="text-publishing-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm text-publishing-ink outline-none"
                  placeholder="••••••••"
                />
              </span>
            </div>

            <label className="flex items-center justify-between rounded border border-publishing-ink/10 bg-[#FBF9F4]/50 px-3 py-2 text-xs">
              <span className="font-semibold text-publishing-muted">Запам’ятати сесію</span>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 accent-publishing-burgundy cursor-pointer"
              />
            </label>

            {error && <p className="rounded bg-publishing-danger/10 p-2.5 text-xs text-publishing-danger font-medium">{error}</p>}

            <button
              type="submit"
              className="w-full rounded bg-publishing-burgundy px-4 py-2.5 text-sm font-bold text-publishing-paper transition hover:bg-[#521321] active:scale-[0.99]"
            >
              Увійти в кабінет
            </button>
          </form>

          <div className="mt-6 border-t border-publishing-ink/10 pt-4 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-publishing-muted">Презентаційні дані для захисту</p>
            <p className="mt-1 text-xs text-publishing-ink">
              Логін: <span className="font-mono bg-[#FBF9F4] px-1 rounded">{defaultDemoAccount.email}</span>
            </p>
            <p className="text-xs text-publishing-ink mt-0.5">
              Пароль: <span className="font-mono bg-[#FBF9F4] px-1 rounded">{defaultDemoAccount.password}</span>
            </p>
          </div>
        </motion.section>
      </div>
    </main>
  )
}

export default LoginPage