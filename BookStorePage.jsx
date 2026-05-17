import { useState, useMemo } from 'react'
import { ShoppingCart, Trash2, CheckCircle2, User, Phone, MapPin, CreditCard, MailCheck, X, Plus, Minus, BookText, Search } from 'lucide-react'
import { useCommunity } from '../context/PublishingContext'
import { formatNumber } from '../services/formatters'
import Badge from '../components/ui/Badge'
import GlassCard from '../components/ui/GlassCard'

// Надійні латинські імпорти фотографій з assets
import img1 from '../assets/book1.jpeg'
import img2 from '../assets/book2.jpeg'
import img3 from '../assets/book3.jpg'
import img4 from '../assets/book4.jpeg'
import img5 from '../assets/book5.jpg'
import img6 from '../assets/book6.jpg'
import img7 from '../assets/book7.jpeg'
import img8 from '../assets/book8.jpeg'
import img9 from '../assets/book9.jpeg'
import img10 from '../assets/book10.png'
import img11 from '../assets/book11.jpg'
import img12 from '../assets/book12.jpg'

// Масив із 12 українських книг із чітко закріпленими фотографіями
const UKRAINIAN_BOOKS_PRESET = [
  {
    id: "book-ukr-1",
    title: "Тіні забутих предків",
    author: "Михайло Коцюбинський",
    category: "Класична література",
    format: "А5 (148х210 мм)",
    paperType: "Офсетний 80г/м²",
    pages: 144,
    pricePerBook: 250.00,
    coverType: "М'яка (клей)",
    image: img1
  },
  {
    id: "book-ukr-2",
    title: "Лісова пісня",
    author: "Леся Українка",
    category: "Драматургія та поезія",
    format: "В5 (176х250 мм)",
    paperType: "Крейдований матовий",
    pages: 160,
    pricePerBook: 200.00,
    coverType: "Тверда (7БЦ)",
    image: img2
  },
  {
    id: "book-ukr-3",
    title: "Кайдашева сім’я",
    author: "Іван Нечуй-Левицький",
    category: "Класична література",
    format: "А5 (148х210 мм)",
    paperType: "Офсетний 80г/м²",
    pages: 224,
    pricePerBook: 240.00,
    coverType: "Тверда (7БЦ)",
    image: img3
  },
  {
    id: "book-ukr-4",
    title: "Захар Беркут",
    author: "Іван Франко",
    category: "Історична проза",
    format: "А5 (148х210 мм)",
    paperType: "Офсетний 80г/м²",
    pages: 256,
    pricePerBook: 290.00,
    coverType: "Тверда (7БЦ)",
    image: img4
  },
  {
    id: "book-ukr-5",
    title: "Маруся Чурай",
    author: "Ліна Костенко",
    category: "Драматургія та поезія",
    format: "А5 (148х210 мм)",
    paperType: "Офсетний 70г/м²",
    pages: 192,
    pricePerBook: 450.00,
    coverType: "Тверда (тканина)",
    image: img5
  },
  {
    id: "book-ukr-6",
    title: "Тигролови",
    author: "Іван Багряний",
    category: "Пригодницькі романи",
    format: "А5 (148х210 мм)",
    paperType: "Офсетний 80г/м²",
    pages: 320,
    pricePerBook: 330.00,
    coverType: "Тверда (7БЦ)",
    image: img6
  },
  {
    id: "book-ukr-7",
    title: "Хіба ревуть воли, як ясла повні?",
    author: "Панас Мирний",
    category: "Класична література",
    format: "В5 (176х250 мм)",
    paperType: "Офсетний 80г/м²",
    pages: 448,
    pricePerBook: 320.00,
    coverType: "Тверда (7БЦ)",
    image: img7
  },
  {
    id: "book-ukr-8",
    title: "Солодка Даруся",
    author: "Марія Матіос",
    category: "Сучасна проза",
    format: "А5 (148х210 мм)",
    paperType: "Офсетний 80г/м²",
    pages: 288,
    pricePerBook: 400.00,
    coverType: "М'яка (обкладинка)",
    image: img8
  },
  {
    id: "book-ukr-9",
    title: "Інтернат",
    author: "Сергій Жадан",
    category: "Сучасна проза",
    format: "В5 (176х250 мм)",
    paperType: "Крейдований матовий",
    pages: 336,
    pricePerBook: 500.00,
    coverType: "Тверда (7БЦ)",
    image: img9
  },
  {
    id: "book-ukr-10",
    title: "Місто",
    author: "Валер'ян Підмогильний",
    category: "Класична література",
    format: "А5 (148х210 мм)",
    paperType: "Офсетний 80г/м²",
    pages: 288,
    pricePerBook: 290.00,
    coverType: "М'яка (клей)",
    image: img10
  },
  {
    id: "book-ukr-11",
    title: "Кобзар",
    author: "Тарас Шевченко",
    category: "Драматургія та поезія",
    format: "В5 (176х250 мм)",
    paperType: "Офсетний 90г/м²",
    pages: 640,
    pricePerBook: 550.00,
    coverType: "Тверда (із золотим тисненням)",
    image: img11
  },
  {
    id: "book-ukr-12",
    title: "Фелікс Австрія",
    author: "Софія Андрухович",
    category: "Сучасна проза",
    format: "А5 (148х210 мм)",
    paperType: "Офсетний 80г/м²",
    pages: 288,
    pricePerBook: 450.00,
    coverType: "Тверда (7БЦ)",
    image: img12
  }
]

const BookStorePage = () => {
  const { cart, addToCart, removeFromCart, updateCartQuantity, clearCart, booksCatalog } = useCommunity()
  
  const currentCatalog = useMemo(() => {
    if (!booksCatalog || booksCatalog.length === 0 || booksCatalog[0]?.id?.includes('kondrat')) {
      return UKRAINIAN_BOOKS_PRESET
    }
    return booksCatalog
  }, [booksCatalog])

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('картка')

  const filteredBooks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return currentCatalog

    return currentCatalog.filter(book => 
      book.title.toLowerCase().includes(query) || 
      book.author.toLowerCase().includes(query)
    )
  }, [currentCatalog, searchQuery])

  const totalItemsCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }, [cart])

  const cartTotalSum = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.pricePerBook * item.quantity), 0)
  }, [cart])

  const handleCheckoutSubmit = (e) => {
    e.preventDefault()
    if (!fullName.trim() || !phone.trim() || !deliveryAddress.trim()) {
      alert('Будь ласка, заповніть всі обов\'язкові поля логістики доставки.')
      return
    }
    setIsCartOpen(false)
    setIsSuccessModalOpen(true)
  }

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false)
    clearCart()
    setFullName('')
    setPhone('')
    setDeliveryAddress('')
  }

  return (
    <div className="page-shell">
      {/* Шапка вітрини та живий пошук */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-publishing-ink/10 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-publishing-muted">Інтернет-магазин української книги</span>
          <h1 className="font-serif text-3xl font-bold text-publishing-ink mt-0.5">Книжкова вітрина видавництва</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-publishing-muted" />
            <input
              type="text"
              placeholder="Пошук книги за назвою або автором..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-sm border border-publishing-ink/10 bg-publishing-panel py-2 pl-9 pr-4 text-xs text-publishing-ink outline-none focus:border-publishing-gold transition"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-publishing-muted hover:text-publishing-ink"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 rounded-sm bg-publishing-burgundy px-4 py-2 text-xs font-bold text-white transition hover:bg-opacity-90"
          >
            <ShoppingCart size={16} />
            <span>Кошик</span>
            {totalItemsCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-publishing-gold text-[10px] font-bold text-publishing-ink shadow-sm">
                {totalItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Головна сітка відображення книг */}
      {filteredBooks.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBooks.map((book) => {
            const itemInCart = cart.find(item => item.id === book.id)

            return (
              <GlassCard key={book.id} className="overflow-hidden border border-publishing-ink/10 flex flex-col justify-between group">
                {/* КОНТЕЙНЕР ФОТО — ТЕПЕР З object-contain ТА ДОДАТКОВИМ ВІДСТУПОМ p-2 */}
                <div className="relative h-48 w-full bg-publishing-panel overflow-hidden border-b border-publishing-ink/5 p-2 flex items-center justify-center">
                  <img 
                    src={book.image} 
                    alt={book.title} 
                    className="h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105" 
                  />
                  <div className="absolute right-2 top-2">
                    <Badge variant={book.category === 'Класична література' ? 'accent' : book.category === 'Драматургія та поезія' ? 'cyan' : 'warning'}>
                      {book.category}
                    </Badge>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-base font-bold text-publishing-ink leading-tight line-clamp-2" title={book.title}>
                      {book.title}
                    </h3>
                    <p className="mt-1 text-xs text-publishing-muted font-medium flex items-center gap-1">
                      <User size={12} className="text-publishing-gold" />
                      {book.author}
                    </p>
                    
                    <div className="mt-3 space-y-1 text-[11px] text-publishing-muted border-t border-publishing-ink/5 pt-2 font-sans">
                      <p>Формат: <span className="text-publishing-ink font-medium">{book.format}</span></p>
                      <p>Палітурка: <span className="text-publishing-ink font-medium">{book.coverType}</span></p>
                      <p>Обсяг: <span className="text-publishing-ink font-medium">{book.pages} стор.</span></p>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-publishing-ink/5 pt-3 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-publishing-muted block">Ціна</span>
                      <span className="font-serif text-lg font-bold text-publishing-burgundy">{book.pricePerBook.toFixed(2)} грн</span>
                    </div>

                    {itemInCart ? (
                      <div className="flex items-center border border-publishing-ink/10 rounded-sm bg-white overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(book.id, itemInCart.quantity - 1)}
                          className="p-1.5 text-publishing-muted hover:bg-publishing-panel hover:text-publishing-ink transition"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2.5 font-mono text-xs font-bold text-publishing-ink">{itemInCart.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(book.id, itemInCart.quantity + 1)}
                          className="p-1.5 text-publishing-muted hover:bg-publishing-panel hover:text-publishing-ink transition"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => addToCart(book)}
                        className="rounded-sm border border-publishing-burgundy bg-publishing-burgundy text-white px-3 py-1.5 text-xs font-bold transition hover:bg-opacity-90"
                      >
                        Придбати
                      </button>
                    )}
                  </div>
                </div>
              </GlassCard>
            )
          })}
        </div>
      ) : (
        <GlassCard className="p-12 text-center text-publishing-muted">
          <BookText size={40} className="mx-auto mb-3 text-publishing-muted/40" />
          <p className="font-serif text-lg font-bold text-publishing-ink">Книг за вказаним пошуковим запитом не знайдено.</p>
        </GlassCard>
      )}

      {/* Панель кошика та модалки залишаються без змін */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-publishing-ink/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#F5F2EA] border-l border-publishing-ink/10 p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between border-b border-publishing-ink/10 pb-3">
                <h2 className="font-serif text-xl font-bold text-publishing-ink flex items-center gap-2">
                  <ShoppingCart size={20} className="text-publishing-burgundy" />
                  Ваше замовлення
                </h2>
                <button type="button" onClick={() => setIsCartOpen(false)} className="text-publishing-muted hover:text-publishing-ink p-1">
                  <X size={20} />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-20 text-center text-publishing-muted">
                  <ShoppingCart size={48} className="mx-auto mb-3 text-publishing-muted/30" />
                  <p className="text-sm font-semibold">Ваш кошик порожній.</p>
                </div>
              ) : (
                <div className="mt-4 space-y-3 overflow-y-auto max-h-[45vh] pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 rounded-sm border border-publishing-ink/5 bg-publishing-paper/80 p-2 text-xs">
                      {/* У кошику також робимо відображення обкладинки пропорційним */}
                      <img src={item.image} alt={item.title} className="h-14 w-12 rounded-sm object-contain bg-publishing-panel shrink-0 p-0.5" />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <p className="font-bold text-publishing-ink truncate" title={item.title}>{item.title}</p>
                          <p className="text-[10px] text-publishing-muted">{item.author}</p>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-mono font-bold text-publishing-burgundy">{(item.pricePerBook * item.quantity).toFixed(2)} грн.</span>
                          <button type="button" onClick={() => removeFromCart(item.id)} className="text-publishing-muted hover:text-publishing-danger p-1">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <form onSubmit={handleCheckoutSubmit} className="border-t border-publishing-ink/10 pt-4 mt-4 space-y-3">
                <div className="flex justify-between items-end mb-2 border-b border-publishing-ink/5 pb-2 text-sm">
                  <span className="font-bold text-publishing-ink">Всього до оплати:</span>
                  <span className="font-serif text-xl font-bold text-publishing-burgundy">{cartTotalSum.toFixed(2)} грн</span>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-publishing-muted mb-1">ПІБ Отримувача *</label>
                  <input
                    type="text"
                    required
                    placeholder="Прізвище та ім'я"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-sm border border-publishing-ink/10 bg-publishing-paper p-1.5 text-xs outline-none focus:border-publishing-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-publishing-muted mb-1">Контактний телефон *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+380"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-sm border border-publishing-ink/10 bg-publishing-paper p-1.5 text-xs outline-none focus:border-publishing-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-publishing-muted mb-1">Адреса доставки *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Місто, номер або адреса відділення доставки"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full rounded-sm border border-publishing-ink/10 bg-publishing-paper p-1.5 text-xs outline-none focus:border-publishing-gold resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('картка')}
                    className={`p-2 border rounded-sm text-center text-[11px] font-bold transition flex items-center justify-center gap-1.5 ${paymentMethod === 'картка' ? 'border-publishing-burgundy bg-publishing-burgundy/5 text-publishing-burgundy' : 'border-publishing-ink/10 bg-white text-publishing-muted'}`}
                  >
                    <CreditCard size={12} />
                    <span>Online-оплата</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('пошта')}
                    className={`p-2 border rounded-sm text-center text-[11px] font-bold transition flex items-center justify-center gap-1.5 ${paymentMethod === 'пошта' ? 'border-publishing-burgundy bg-publishing-burgundy/5 text-publishing-burgundy' : 'border-publishing-ink/10 bg-white text-publishing-muted'}`}
                  >
                    <MapPin size={12} />
                    <span>Післяплата</span>
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-sm bg-publishing-success text-white py-2.5 text-xs font-bold uppercase tracking-wider transition hover:bg-opacity-90 shadow-sm mt-2"
                >
                  Підтвердити замовлення
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-publishing-ink/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded border border-publishing-ink/10 bg-[#F5F2EA] p-6 text-center shadow-2xl">
            <div className="mx-auto text-publishing-success bg-publishing-success/10 p-2.5 rounded-full flex items-center justify-center mb-3 h-14 w-14">
              <MailCheck size={28} />
            </div>
            
            <h3 className="font-serif font-bold text-2xl text-publishing-ink">Оформлення прийнято!</h3>
            <p className="mt-2 text-sm text-publishing-muted leading-relaxed">
              Дякуємо за замовлення літератури. Наш менеджер вже прийняв заявку і готує книги до відправки.
            </p>

            <div className="mt-4 p-2.5 bg-publishing-paper border border-publishing-ink/5 text-left text-[11px] rounded-sm text-publishing-muted space-y-1 font-mono">
              <p>Отримувач: <span className="text-publishing-ink font-bold">{fullName}</span></p>
              <p>Спосіб оплати: <span className="text-publishing-burgundy font-bold">{paymentMethod === 'картка' ? 'Онлайн-оплата (Картка)' : 'Післяплата при отриманні'}</span></p>
              <p>Сума замовлення: <span className="text-publishing-ink font-bold">{cartTotalSum.toFixed(2)} грн.</span></p>
            </div>

            <button
              type="button"
              onClick={handleCloseSuccessModal}
              className="mt-5 w-full rounded-sm bg-publishing-success text-white py-2 text-xs font-bold uppercase tracking-wider transition hover:bg-opacity-90 shadow-sm"
            >
              Зрозуміло
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookStorePage