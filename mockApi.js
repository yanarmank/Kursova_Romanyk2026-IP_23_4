import dashboardUrl from '../data/dashboard.json?url'
import calculatorUrl from '../data/calculator.json?url'
import ordersUrl from '../data/orders.json?url'
import staffUrl from '../data/staff.json?url'
import settingsUrl from '../data/settings.json?url'
import catalogUrl from '../data/catalog.json?url'

const endpointMap = {
  dashboard: dashboardUrl,
  calculator: calculatorUrl,
  orders: ordersUrl,
  staff: staffUrl,
  settings: settingsUrl,
  catalog: catalogUrl,
}

const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms))

const fetchJson = async (endpoint) => {
  await sleep(250)
  const response = await fetch(endpointMap[endpoint])
  if (!response.ok) {
    throw new Error(`Не вдалося завантажити mock API: ${endpoint}`)
  }
  return response.json()
}

export const getDashboardData = () => fetchJson('dashboard')
export const getCalculatorData = () => fetchJson('calculator')
export const getOrdersLog = () => fetchJson('orders')
export const getStaffAndAuthors = () => fetchJson('staff')
export const getServerSettings = () => fetchJson('settings')
export const getCatalogBooks = () => fetchJson('catalog')