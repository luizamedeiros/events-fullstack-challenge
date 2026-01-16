import type { Event, EventStatus, SortValue } from '../../domain/entities/event'
import { getStatusOptions } from '../../domain/entities/event'
import TableRow from './TableRow'
import TableSearchAndFilters from './TableSearchAndFilters'
import { useTranslation } from 'react-i18next'
import { useFilteredEvents } from '../../hooks/useFilteredEvents'
import { useMemo, useState } from 'react'

type TableProps = {
  items: Event[]
  state: 'idle' | 'loading' | 'error'
  onEdit: (event: Event) => void
  onDelete: (event: Event) => void
  onStatusChange: (event: Event, status: EventStatus) => void
}

const Table = ({
  items,
  state,
  onEdit,
  onDelete,
  onStatusChange
}: TableProps) => {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [sortValue, setSortValue] = useState<SortValue>('startDate-asc')
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'ALL'>('ALL')
  const statusOptions = useMemo(() => getStatusOptions(t), [t])
  const filteredItems = useFilteredEvents({
    items,
    search,
    sortValue,
    statusFilter,
  })
  const renderRows = () => {
    const isEmpty = filteredItems.length === 0
    const isLoading = state === 'loading' && items.length === 0
    const emptyMessage = isLoading ? t('common.loading') : t('common.empty')

    if (isEmpty) {
      return (
        <tr>
          <td colSpan={5} className="empty">
            {emptyMessage}
          </td>
        </tr>
      )
    }

    return filteredItems.map((event, index) => (
      <TableRow
        key={event.id}
        event={event}
        index={index}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
        statusOptions={statusOptions}
      />
    ))
  }

  return (
    <div className="table-wrap">
      <table className="events-table">
        <TableSearchAndFilters
          search={search}
          onSearchChange={setSearch}
          sortValue={sortValue}
          onSortChange={setSortValue}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          statusOptions={statusOptions}
        />
        <tbody>{renderRows()}</tbody>
      </table>
    </div>
  )
}

export default Table
