import { useMemo } from 'react'
import type { Event, EventStatus, SortValue } from '../domain/entities/event'

type UseFilteredEventsParams = {
  items: Event[]
  search: string
  sortValue: SortValue
  statusFilter: EventStatus | 'ALL'
}

export const useFilteredEvents = ({
  items,
  search,
  sortValue,
  statusFilter,
}: UseFilteredEventsParams) =>
  useMemo(() => {
    const term = search.trim().toLowerCase()
    let data = items

    if (term) {
      data = data.filter((item) => item.title.toLowerCase().includes(term))
    }

    if (statusFilter !== 'ALL') {
      data = data.filter((item) => item.status === statusFilter)
    }

    const [key, direction] = sortValue.split('-') as [
      'startDate' | 'title' | 'price',
      'asc' | 'desc',
    ]

    const sorted = [...data].sort((a, b) => {
      let result = 0
      if (key === 'price') {
        result = a.price - b.price
      } else if (key === 'title') {
        result = a.title.localeCompare(b.title)
      } else {
        result = a.startDate.localeCompare(b.startDate)
      }
      return direction === 'asc' ? result : -result
    })

    return sorted
  }, [items, search, sortValue, statusFilter])
