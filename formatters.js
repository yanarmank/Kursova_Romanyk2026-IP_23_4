const numberFormatter = new Intl.NumberFormat('uk-UA')
const dateFormatter = new Intl.DateTimeFormat('uk-UA', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})
const dateTimeFormatter = new Intl.DateTimeFormat('uk-UA', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

export const formatNumber = (value) => numberFormatter.format(value)
export const formatDate = (value) => dateFormatter.format(new Date(value))
export const formatDateTime = (value) => dateTimeFormatter.format(new Date(value))

export const getStatusLabel = (status) => {
  const labels = {
    in_review: 'Редагування та Коректура',
    prepended: 'Додрукарська підготовка',
    printing: 'Друк тиражу цехом',
    completed: 'Готово до видачі / Склад',
  }
  return labels[status] ?? status
}

export const getStatusClass = (status) => {
  const classes = {
    in_review: 'bg-publishing-gold',
    prepended: 'bg-publishing-cyan',
    printing: 'bg-publishing-burgundy',
    completed: 'bg-publishing-success',
  }
  return classes[status] ?? 'bg-slate-500'
}