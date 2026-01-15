export type EventStatus = 'STARTED' | 'PAUSED' | 'COMPLETED'

export type Event = {
  id: number
  title: string
  startDate: string
  endDate: string
  price: number
  status: EventStatus
}

export type SortValue =
  | 'startDate-asc'
  | 'startDate-desc'
  | 'title-asc'
  | 'title-desc'
  | 'price-asc'
  | 'price-desc'

export const eventStatuses: EventStatus[] = ['STARTED', 'PAUSED', 'COMPLETED']

export const getStatusOptions = (
  t: (key: string) => string
): Array<{ value: EventStatus; label: string }> => [
  { value: 'STARTED', label: t('common.statusStarted') },
  { value: 'PAUSED', label: t('common.statusPaused') },
  { value: 'COMPLETED', label: t('common.statusCompleted') },
]

export type EventCreate = Omit<Event, 'id'>
export type EventUpdate = Omit<Event, 'id'>
