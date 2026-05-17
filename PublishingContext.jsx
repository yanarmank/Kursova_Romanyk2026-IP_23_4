import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  getDashboardData,
  getCalculatorData,
  getOrdersLog,
  getStaffAndAuthors,
  getServerSettings,
  getCatalogBooks
} from '../services/mockApi'

const PublishingContext = createContext(null)

export const PublishingProvider = ({ children }) => {
  const [state, setState] = useState({
    dashboard: null,
    staff: [],
    calculator: [],
    orders: [],
    catalog: [],
    settings: null,
    loading: true,
    error: null,
  })

  // Новий стан для кошика інтернет-магазину готових книг
  const [cart, setCart] = useState([])

  useEffect(() => {
    let isMounted = true
    const loadData = async () => {
      try {
        const [d, s, c, o, set, cat] = await Promise.all([
          getDashboardData(),
          getStaffAndAuthors(),
          getCalculatorData(),
          getOrdersLog(),
          getServerSettings(),
          getCatalogBooks()
        ])
        if (isMounted) {
          setState({
            dashboard: d,
            staff: s,
            calculator: c,
            orders: o,
            catalog: cat,
            settings: set,
            loading: false,
            error: null,
          })
        }
      } catch (err) {
        if (isMounted) {
          setState((prev) => ({ ...prev, loading: false, error: err.message }))
        }
      }
    }
    loadData()
    return () => { isMounted = false }
  }, [])

  // --- ФУНКЦІЇ КЕРУВАННЯ КОШИКОМ ---
  const addToCart = useCallback((book) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === book.id)
      if (existingItem) {
        return currentCart.map((item) =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...currentCart, { ...book, quantity: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((bookId) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== bookId))
  }, [])

  const updateCartQuantity = useCallback((bookId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(bookId)
      return
    }
    setCart((currentCart) =>
      currentCart.map((item) => (item.id === bookId ? { ...item, quantity } : item))
    )
  }, [removeFromCart])

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  const addNewBook = useCallback((newBookData) => {
    const formatted = {
      id: `book-${Date.now()}`,
      ...newBookData,
      circulation: Number(newBookData.circulation),
      pages: Number(newBookData.pages),
      pricePerBook: Number(newBookData.pricePerBook)
    }
    setState((curr) => ({
      ...curr,
      catalog: [formatted, ...curr.catalog],
      dashboard: {
        ...curr.dashboard,
        stats: curr.dashboard.stats.map(s => 
          s.id === 'books' ? { ...s, value: s.value + formatted.circulation } : s
        )
      }
    }))
  }, [])

  const addModerationLog = useCallback((data) => {
    const log = {
      id: `ord-${Date.now()}`,
      date: new Date().toISOString(),
      moderator: data.moderator,
      user: data.user,
      action: data.action,
      channel: data.channel || data.department,
      reason: data.reason,
      severity: data.severity
    }
    setState((curr) => ({ ...curr, orders: [log, ...curr.orders] }))
  }, [])

  const deleteModerationLog = useCallback((id) => {
    setState((curr) => ({ ...curr, orders: curr.orders.filter(o => o.id !== id) }))
  }, [])

  const registerForEvent = useCallback((id) => {
    setState(curr => ({
      ...curr,
      calculator: curr.calculator.map(c => c.id === id ? { ...c, registered: true, status: 'Розраховано' } : c)
    }))
  }, [])

  const leaveEvent = useCallback((id) => {
    setState(curr => ({
      ...curr,
      calculator: curr.calculator.map(c => c.id === id ? { ...c, registered: false, status: 'Доступно' } : c)
    }))
  }, [])

  const value = useMemo(() => ({
    ...state,
    members: state.staff,
    events: state.calculator,
    logs: state.orders,
    booksCatalog: state.catalog,
    cart, // Експортуємо стан кошика
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    addNewBook,
    addModerationLog,
    deleteModerationLog,
    registerForEvent,
    leaveEvent,
    clearNotifications: () => {},
    dismissNotification: () => {}
  }), [state, cart, addToCart, removeFromCart, updateCartQuantity, clearCart, addNewBook, addModerationLog, deleteModerationLog, registerForEvent, leaveEvent])

  return <PublishingContext.Provider value={value}>{children}</PublishingContext.Provider>
}

export const useCommunity = () => useContext(PublishingContext)