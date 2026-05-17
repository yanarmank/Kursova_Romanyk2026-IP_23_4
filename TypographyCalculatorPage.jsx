import { BookOpen, Search, Type, Layers, Calculator, FileText, CheckCircle2, HelpCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import Badge from '../components/ui/Badge'
import EventCard from '../components/ui/EventCard'
import GlassCard from '../components/ui/GlassCard'
import { useCommunity } from '../context/PublishingContext'
import { formatNumber } from '../services/formatters'

const TypographyCalculatorPage = () => {
  const { events, leaveEvent, registerForEvent, addNewBook } = useCommunity()
  
  // Стани для фільтрації нижньої сітки пресетів
  const [categoryFilter, setCategoryFilter] = useState('Усі категорії')
  const [searchTerm, setSearchTerm] = useState('')

  // --- СТЕЙТ ДЛЯ ОНЛАЙН-КАЛЬКУЛЯТОРА ВАРТОСТІ ---
  const [format, setFormat] = useState('А5 (стандартний) 145х200мм')
  const [bwPages, setBwPages] = useState(120)
  const [colorPages, setColorPages] = useState(20)
  const [paperType, setPaperType] = useState('Офсетний 80 г/м²')
  const [binding, setBinding] = useState('Тверда')
  const [coverMaterial, setCoverMaterial] = useState('Палітурний картон')
  const [lamination, setLamination] = useState('Матова')
  const [embossing, setEmbossing] = useState('Без тиснення')
  const [embossingSize, setEmbossingSize] = useState('')
  const [endsheetPrint, setEndsheetPrint] = useState('Без друку – чисті')
  
  // Додаткові опції (Checkboxes)
  const [hasLasse, setHasLasse] = useState(true)
  const [hasRoundedBack, setHasRoundedBack] = useState(false)
  
  const [prepStatus, setPrepStatus] = useState('Макет готовий до друку')
  const [coverDesign, setCoverDesign] = useState('Макет обкладинки готовий')
  
  // Видавничий пакет (Checkboxes)
  const [hasIsbn, setHasIsbn] = useState(true)
  const [hasUdcBbc, setHasUdcBbc] = useState(true)
  
  const [circulation, setCirculation] = useState(10)

  // Автоматичне вирахування загальної кількості сторінок (ч/б + кольорові)
  const totalPages = useMemo(() => {
    return Number(bwPages || 0) + Number(colorPages || 0)
  }, [bwPages, colorPages])

  // --- АВТОМАТИЧНА ФОРМУЛА РОЗРАХУНКУ ВАРТОСТІ ---
  const calculationResult = useMemo(() => {
    const circ = Number(circulation || 1)
    if (circ <= 0) return { pricePerBook: 0, totalPrice: 0 }

    // 1. Базова вартість палітурки (за 1 одиницю)
    let bindingCost = 35
    if (binding === 'Тверда') bindingCost = 85
    if (binding === 'Збирання на пружину') bindingCost = 28
    if (binding === 'Зшивання на скобу') bindingCost = 15

    // 2. Вартість сторінок
    const bwCost = Number(bwPages || 0) * 0.45
    const colorCost = Number(colorPages || 0) * 1.95

    // 3. Коефіцієнт паперу
    let paperMultiplier = 1.0
    if (paperType === 'Офсетний 100 г/м²') paperMultiplier = 1.15
    if (paperType.startsWith('Крейдований 115')) paperMultiplier = 1.25
    if (paperType.startsWith('Крейдований 130')) paperMultiplier = 1.35
    if (paperType.startsWith('Крейдований 150')) paperMultiplier = 1.50
    if (paperType.includes('кремовий')) paperMultiplier = 1.10

    // 4. Множник за формат макету
    let formatMultiplier = 1.0
    if (format.startsWith('А6')) formatMultiplier = 0.75
    if (format.startsWith('B5')) formatMultiplier = 1.25
    if (format.startsWith('А4')) formatMultiplier = 1.55

    // 5. Додаткові матеріали та ламінація обкладинки
    let coverOptionsCost = 0
    if (coverMaterial === 'Палітурний картон') coverOptionsCost += 12
    if (lamination === 'Глянцева' || lamination === 'Матова') coverOptionsCost += 6
    if (embossing === 'Тиснення фольгою' || embossing === 'Сліпе тиснення') coverOptionsCost += 15

    // 6. Форзаци та конструкція книжкового блоку
    if (endsheetPrint === 'Один друкований') coverOptionsCost += 8
    if (endsheetPrint === 'Обидва друковані') coverOptionsCost += 14
    if (hasLasse) coverOptionsCost += 7
    if (hasRoundedBack) coverOptionsCost += 9

    // 7. Послуги додрукарської підготовки (розподіляються на тираж)
    let serviceFixedCost = 0
    if (prepStatus === 'Потрібна додрукарська підготовка') serviceFixedCost += 600
    if (prepStatus === 'Потрібна верстка сторінок') serviceFixedCost += 1800
    if (coverDesign === 'Потрібен дизайн з нуля') serviceFixedCost += 1000

    // 8. Офіційні державні пакети реєстрації
    if (hasIsbn) serviceFixedCost += 450
    if (hasUdcBbc) serviceFixedCost += 150

    // Фінальна калькуляція
    const variableCostPerBook = (bindingCost + (bwCost + colorCost) * paperMultiplier + coverOptionsCost) * formatMultiplier
    const pricePerBook = Number((variableCostPerBook + (serviceFixedCost / circ)).toFixed(1))
    const totalPrice = Number((pricePerBook * circ).toFixed(1))

    return { pricePerBook, totalPrice }
  }, [
    format, bwPages, colorPages, paperType, binding, coverMaterial,
    lamination, embossing, endsheetPrint, hasLasse, hasRoundedBack,
    prepStatus, coverDesign, hasIsbn, hasUdcBbc, circulation
  ])

  // Дії форми калькулятора
  const handleSendRequest = (e) => {
    e.preventDefault()
    alert(`Заявку успішно надіслано менеджеру! Розрахункова сума замовлення для тиражу в ${circulation} прим. становить ${calculationResult.totalPrice} грн. Менеджер зв'яжеться з вами протягом 15 хвилин.`)
  }

  const handleAddToPrintPlan = () => {
    const newBook = {
      title: `Замовлення розрахунку (${format.split(' ')[0]} · ${binding} палітурка)`,
      author: 'Калькулятор замовлень',
      category: 'Наукові видання',
      format: format,
      paperType: paperType,
      circulation: circulation,
      pages: totalPages,
      pricePerBook: calculationResult.pricePerBook,
      coverType: binding,
      status: 'prepended'
    }
    addNewBook(newBook)
    alert('Калькуляцію успішно підтверджено та додано до загального реєстру видань у план додрукарської підготовки!')
  }

  // Логіка для нижньої сітки готових шаблонів (пресетів)
  const categories = useMemo(
    () => ['Усі категорії', ...Array.from(new Set(events.map((item) => item.type)))],
    [events],
  )

  const filteredPresets = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    return events
      .filter((item) => {
        const matchesCategory = categoryFilter === 'Усі категорії' || item.type === categoryFilter
        const matchesSearch =
          item.title.toLowerCase().includes(query) ||
          item.bookFormat.toLowerCase().includes(query) ||
          item.host.toLowerCase().includes(query)

        return matchesCategory && matchesSearch
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [events, searchTerm, categoryFilter])

  const totalVolume = filteredPresets.reduce((sum, item) => sum + item.currentCirculation, 0)

  return (
    <div className="page-shell">
      {/* Шапка сторінки */}
      <section className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end border-b border-publishing-ink/5 pb-4">
        <div>
          <Badge variant="cyan">Калькулятор матеріалів</Badge>
          <h2 className="font-serif text-3xl font-bold text-publishing-ink mt-1">Виробничі калькуляції та пресети</h2>
          <p className="text-xs text-publishing-muted mt-1">
            Технологічний розрахунок параметрів видання, тоннажу офсетного паперу, фотоформ та калькуляція вартості.
          </p>
        </div>
      </section>

      {/* --- НОВИЙ ОНЛАЙН КАЛЬКУЛЯТОР ВАРТОСТІ --- */}
      <GlassCard className="p-5 border border-publishing-burgundy/20 bg-publishing-panel/40">
        <div className="flex items-center gap-2 text-publishing-burgundy mb-3">
          <Calculator size={20} />
          <h3 className="font-serif font-bold text-xl">Для розрахунку вартості друку книжок скористайтеся онлайн калькулятором:</h3>
        </div>

        <form onSubmit={handleSendRequest} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* 1. Формат книги */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-publishing-muted mb-1">Формат книги</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full rounded-sm border border-publishing-ink/10 bg-publishing-paper p-2 text-xs outline-none text-publishing-ink"
              >
                <option value="А6 (малий) 100х140мм">А6 (малий) 100х140мм</option>
                <option value="А5 (стандартний) 145х200мм">А5 (стандартний) 145х200мм</option>
                <option value="B5 (збільшений) 170х240мм">B5 (збільшений) 170х240мм</option>
                <option value="А4 (крупний) 205х290мм">А4 (крупний) 205х290мм</option>
              </select>
            </div>

            {/* 2. Кількість чорно-білих сторінок */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-publishing-muted mb-1">Кількість чорно-білих сторінок</label>
              <input
                type="number"
                min="0"
                value={bwPages}
                onChange={(e) => setBwPages(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full rounded-sm border border-publishing-ink/10 bg-publishing-paper p-2 text-xs outline-none font-mono text-publishing-ink"
              />
            </div>

            {/* 3. Кількість кольорових сторінок */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-publishing-muted mb-1">Кількість кольорових сторінок</label>
              <input
                type="number"
                min="0"
                value={colorPages}
                onChange={(e) => setColorPages(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full rounded-sm border border-publishing-ink/10 bg-publishing-paper p-2 text-xs outline-none font-mono text-publishing-ink"
              />
            </div>

            {/* 4. Всього сторінок в книзі (ReadOnly) */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-publishing-muted mb-1">Всього сторінок в книзі</label>
              <input
                type="text"
                readOnly
                value={`${totalPages} с.`}
                className="w-full rounded-sm border border-publishing-ink/10 bg-publishing-panel/80 p-2 text-xs outline-none font-mono font-bold text-publishing-burgundy cursor-not-allowed"
              />
            </div>

            {/* 5. Папір сторінок */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-publishing-muted mb-1">Папір сторінок</label>
              <select
                value={paperType}
                onChange={(e) => setPaperType(e.target.value)}
                className="w-full rounded-sm border border-publishing-ink/10 bg-publishing-paper p-2 text-xs outline-none text-publishing-ink"
              >
                <option value="Офсетний 80 г/м²">Офсетний 80 г/м²</option>
                <option value="Офсетний 100 г/м²">Офсетний 100 г/м²</option>
                <option value="Крейдований 115 г/м²">Крейдований 115 г/м²</option>
                <option value="Крейдований 130 г/м²">Крейдований 130 г/м²</option>
                <option value="Крейдований 150 г/м²">Крейдований 150 г/м²</option>
                <option value="Книжковий кремовий 80 г/м²">Книжковий кремовий 80 г/м²</option>
              </select>
            </div>

            {/* 6. Палітурка */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-publishing-muted mb-1">Палітурка</label>
              <select
                value={binding}
                onChange={(e) => setBinding(e.target.value)}
                className="w-full rounded-sm border border-publishing-ink/10 bg-publishing-paper p-2 text-xs outline-none text-publishing-ink"
              >
                <option value="Тверда">Тверда</option>
                <option value="М’яка">М’яка</option>
                <option value="Збирання на пружину">Збирання на пружину</option>
                <option value="Зшивання на скобу">Зшивання на скобу</option>
              </select>
            </div>

            {/* 7. Матеріал обкладинки */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-publishing-muted mb-1">Матеріал обкладинки</label>
              <select
                value={coverMaterial}
                onChange={(e) => setCoverMaterial(e.target.value)}
                className="w-full rounded-sm border border-publishing-ink/10 bg-publishing-paper p-2 text-xs outline-none text-publishing-ink"
              >
                <option value="Палітурний картон">Палітурний картон</option>
                <option value="Стандартний картон 250г/м²">Стандартний картон 250г/м²</option>
              </select>
            </div>

            {/* 8. Ламінація обкладинки */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-publishing-muted mb-1">Ламінація обкладинки</label>
              <div className="flex gap-4 p-2 bg-publishing-paper border border-publishing-ink/10 rounded-sm text-xs text-publishing-ink">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="lamination" value="Глянцева" checked={lamination === 'Глянцева'} onChange={(e) => setLamination(e.target.value)} className="accent-publishing-burgundy" /> Глянцева
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="lamination" value="Матова" checked={lamination === 'Матова'} onChange={(e) => setLamination(e.target.value)} className="accent-publishing-burgundy" /> Матова
                </label>
              </div>
            </div>

            {/* 9. Тиснення обкладинки */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-publishing-muted mb-1">Тиснення обкладинки</label>
              <select
                value={embossing}
                onChange={(e) => setEmbossing(e.target.value)}
                className="w-full rounded-sm border border-publishing-ink/10 bg-publishing-paper p-2 text-xs outline-none text-publishing-ink"
              >
                <option value="Без тиснення">Без тиснення</option>
                <option value="Тиснення фольгою">Тиснення фольгою</option>
                <option value="Сліпе тиснення">Сліпе тиснення</option>
              </select>
            </div>

            {/* 10. Розмір тиснення мм */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-publishing-muted mb-1">Розмір тиснення мм.</label>
              <input
                type="text"
                disabled={embossing === 'Без тиснення'}
                value={embossing === 'Без тиснення' ? '—' : embossingSize}
                onChange={(e) => setEmbossingSize(e.target.value)}
                placeholder="напр. 50х100"
                className="w-full rounded-sm border border-publishing-ink/10 bg-publishing-paper p-2 text-xs outline-none disabled:bg-publishing-panel disabled:cursor-not-allowed text-publishing-ink font-mono"
              />
            </div>

            {/* 11. Друк на форзацах */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-publishing-muted mb-1">Друк на форзацах</label>
              <select
                value={endsheetPrint}
                onChange={(e) => setEndsheetPrint(e.target.value)}
                className="w-full rounded-sm border border-publishing-ink/10 bg-publishing-paper p-2 text-xs outline-none text-publishing-ink"
              >
                <option value="Без друку – чисті">Без друку – чисті</option>
                <option value="Один друкований">Один друкований</option>
                <option value="Обидва друковані">Обидва друковані</option>
              </select>
            </div>

            {/* 13. Підготовка макета */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-publishing-muted mb-1">Підготовка макета</label>
              <select
                value={prepStatus}
                onChange={(e) => setPrepStatus(e.target.value)}
                className="w-full rounded-sm border border-publishing-ink/10 bg-publishing-paper p-2 text-xs outline-none text-publishing-ink"
              >
                <option value="Макет готовий до друку">Макет готовий до друку</option>
                <option value="Потрібна додрукарська підготовка">Потрібна додрукарська підготовка</option>
                <option value="Потрібна верстка сторінок">Потрібна верстка сторінок</option>
              </select>
            </div>

            {/* 14. Дизайн обкладинки */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-publishing-muted mb-1">Дизайн обкладинки</label>
              <select
                value={coverDesign}
                onChange={(e) => setCoverDesign(e.target.value)}
                className="w-full rounded-sm border border-publishing-ink/10 bg-publishing-paper p-2 text-xs outline-none text-publishing-ink"
              >
                <option value="Макет обкладинки готовий">Макет обкладинки готовий</option>
                <option value="Потрібен дизайн з нуля">Потрібен дизайн з нуля</option>
              </select>
            </div>

            {/* 16. Тираж */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-publishing-muted mb-1">Тираж (примірників)</label>
              <input
                type="number"
                min="1"
                value={circulation}
                onChange={(e) => setCirculation(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full rounded-sm border border-publishing-ink/10 bg-publishing-paper p-2 text-xs outline-none font-mono font-bold text-publishing-ink"
              />
            </div>

            {/* 12. Додатково (Чекбокси конструкції) */}
            <div className="flex flex-col justify-center gap-2 px-1">
              <label className="flex items-center gap-2 text-xs text-publishing-ink font-semibold cursor-pointer select-none">
                <input type="checkbox" checked={hasLasse} onChange={(e) => setHasLasse(e.target.checked)} className="h-4 w-4 accent-publishing-burgundy rounded-sm" />
                Ляссе закладка
              </label>
              <label className="flex items-center gap-2 text-xs text-publishing-ink font-semibold cursor-pointer select-none">
                <input type="checkbox" checked={hasRoundedBack} onChange={(e) => setHasRoundedBack(e.target.checked)} className="h-4 w-4 accent-publishing-burgundy rounded-sm" />
                Скруглення корінця
              </label>
            </div>

            {/* 15. Видавничий пакет */}
            <div className="flex flex-col justify-center gap-2 px-1">
              <label className="flex items-center gap-2 text-xs text-publishing-ink font-semibold cursor-pointer select-none">
                <input type="checkbox" checked={hasIsbn} onChange={(e) => setHasIsbn(e.target.checked)} className="h-4 w-4 accent-publishing-burgundy rounded-sm" />
                Номер ISBN
              </label>
              <label className="flex items-center gap-2 text-xs text-publishing-ink font-semibold cursor-pointer select-none">
                <input type="checkbox" checked={hasUdcBbc} onChange={(e) => setHasUdcBbc(e.target.checked)} className="h-4 w-4 accent-publishing-burgundy rounded-sm" />
                Індекс УДК ББК
              </label>
            </div>

          </div>

          {/* Результат калькуляції та блок дій */}
          <div className="mt-5 border-t border-publishing-ink/10 pt-4 flex flex-col justify-between items-center gap-4 md:flex-row bg-publishing-panel p-4 rounded-sm border border-publishing-ink/5">
            <div className="text-center md:text-left">
              <p className="text-xs uppercase font-bold text-publishing-muted tracking-wider">Калькуляційний підсумок:</p>
              <h4 className="font-serif text-2xl font-bold text-publishing-burgundy mt-1">
                Вартість: {circulation} прим. х {calculationResult.pricePerBook} грн. = {formatNumber(calculationResult.totalPrice)} грн.
              </h4>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                type="button"
                onClick={handleAddToPrintPlan}
                className="rounded-sm border border-publishing-gold bg-transparent text-publishing-gold px-4 py-2.5 text-xs font-bold uppercase tracking-wide transition hover:bg-publishing-gold hover:text-white"
              >
                Додати в план друку
              </button>
              <button
                type="submit"
                className="rounded-sm bg-publishing-burgundy text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wide transition hover:bg-opacity-95"
              >
                відправити заявку менеджеру
              </button>
            </div>
          </div>
        </form>
      </GlassCard>

      {/* --- СЕКЦІЯ ТЕХНОЛОГІЧНИХ ПРЕСЕТІВ --- */}
      <section className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end border-b border-publishing-ink/5 pb-4 mt-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-publishing-ink">Архів замовлень та ліміти цеху</h2>
          <p className="text-xs text-publishing-muted mt-1">
            Моніторинг заброньованого машинного часу для кафедр ІФНТУНГ та партнерів з нафтогазової галузі.
          </p>
        </div>
        <div className="flex gap-2">
          <GlassCard className="flex items-center gap-2.5 px-3 py-1.5 bg-publishing-panel">
            <BookOpen size={15} className="text-publishing-burgundy" />
            <div className="leading-tight">
              <p className="text-[9px] uppercase font-bold text-publishing-muted">Шаблонів</p>
              <p className="font-serif text-sm font-bold text-publishing-ink">{filteredPresets.length}</p>
            </div>
          </GlassCard>
          <GlassCard className="flex items-center gap-2.5 px-3 py-1.5 bg-publishing-panel">
            <Layers size={15} className="text-publishing-success" />
            <div className="leading-tight">
              <p className="text-[9px] uppercase font-bold text-publishing-muted">Загальний наклад</p>
              <p className="font-serif text-sm font-bold text-publishing-ink">{formatNumber(totalVolume)} прим.</p>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Фільтрація пресетів */}
      <GlassCard className="p-3 bg-publishing-panel/40">
        <div className="grid gap-3 md:grid-cols-[1fr_260px]">
          <label className="flex items-center gap-2 rounded-sm border border-publishing-ink/10 bg-publishing-paper px-3 py-1.5 text-publishing-muted focus-within:border-publishing-gold">
            <Search size={14} />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-xs text-publishing-ink outline-none placeholder:text-publishing-muted/60"
              placeholder="Пошук шаблону за назвою книги, форматом, рецензентом..."
            />
          </label>
          <label className="flex items-center gap-2 rounded-sm border border-publishing-ink/10 bg-publishing-paper px-2 py-1.5 text-publishing-muted focus-within:border-publishing-gold">
            <Type size={14} className="text-publishing-gold" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-transparent text-xs text-publishing-ink outline-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>
        </div>
      </GlassCard>

      {/* Сітка карткових пресетів */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredPresets.length > 0 ? (
          filteredPresets.map((preset, index) => (
            <EventCard
              key={preset.id}
              event={preset}
              delay={index * 0.04}
              onLeave={leaveEvent}
              onRegister={registerForEvent}
            />
          ))
        ) : (
          <GlassCard className="p-8 text-center text-publishing-muted lg:col-span-2 xl:col-span-3">
            Технологічних шаблонів за вказаними фільтрами не знайдено.
          </GlassCard>
        )}
      </section>
    </div>
  )
}

export default TypographyCalculatorPage