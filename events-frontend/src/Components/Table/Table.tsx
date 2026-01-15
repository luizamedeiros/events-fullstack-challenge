import { useMemo } from 'react'
import type { Event, EventStatus, SortValue } from '../../domain/event'
import TableRow from './TableRow'
import TableSearchAndFilters from './TableSearchAndFilters'
import { useTranslation } from 'react-i18next'

type TableProps = {
  items: Event[]
  search: string
  onSearchChange: (value: string) => void
  sortValue: SortValue
  onSortChange: (value: SortValue) => void
  statusFilter: EventStatus | 'ALL'
  onStatusFilterChange: (value: EventStatus | 'ALL') => void
  state: 'idle' | 'loading' | 'error'
  onEdit: (event: Event) => void
  onDelete: (event: Event) => void
  onStatusChange: (event: Event, status: EventStatus) => void
}

const Table = ({
  items,
  search,
  onSearchChange,
  sortValue,
  onSortChange,
  statusFilter,
  onStatusFilterChange,
  state,
  onEdit,
  onDelete,
  onStatusChange,
}: TableProps) => {
  const { t } = useTranslation()
  const filteredItems = useMemo(() => {
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

  return (
    <div className="table-wrap">
      <table className="events-table">
        <TableSearchAndFilters
          search={search}
          onSearchChange={onSearchChange}
          sortValue={sortValue}
          onSortChange={onSortChange}
          statusFilter={statusFilter}
          onStatusFilterChange={onStatusFilterChange}
        />
        <tbody>
          {state === 'loading' && items.length === 0 ? (
            <tr>
              <td colSpan={5} className="empty">
                {t('common.loading')}
              </td>
            </tr>
          ) : filteredItems.length === 0 ? (
            <tr>
              <td colSpan={5} className="empty">
                {t('common.empty')}
              </td>
            </tr>
          ) : (
            filteredItems.map((event, index) => (
              <TableRow
                key={event.id}
                event={event}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Table
