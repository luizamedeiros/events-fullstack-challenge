import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createEventHandlers } from '../../handlers/eventHandlers'
import type { EventStatus, SortValue } from '../../domain/event'
import { useEvents } from '../../hooks/useEvents'
import { Header } from '../Header/Header'
import { Panel } from '../Panel/Panel'
import Table from '../Table/Table'

const EventPage = () => {
  const { t } = useTranslation()
  const { items, state, error, create, update, remove } = useEvents()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'ALL'>('ALL')
  const [sortValue, setSortValue] = useState<SortValue>('startDate-asc')

  const { handleCreate, handleEdit, handleDelete, handleStatusChange } =
    useMemo(
      () => createEventHandlers({ create, update, remove }, t),
      [create, update, remove, t]
    )

  return (
    <div className="page">
      <Header />
      <section className="panel">
        <Panel error={error} handleCreate={handleCreate} state={state} t={t} />
        <Table
          items={items}
          search={search}
          onSearchChange={setSearch}
          sortValue={sortValue}
          onSortChange={setSortValue}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          state={state}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      </section>
    </div>
  )
}

export default EventPage
