const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

export const parseDate = (value: string) => {
  if (!value) return new Date('invalid')
  return value.includes('T') ? new Date(value) : new Date(`${value}T00:00:00`)
}

export const formatDate = (value: string) => {
  const date = parseDate(value)
  if (Number.isNaN(date.getTime())) return '-'
  return dateFormatter.format(date)
}
