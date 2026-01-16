import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Table from '../Table/Table'
import { Panel } from '../Panel/Panel'
import { Header } from '../Header/Header'
import { useEvents } from '../../hooks/useEvents'
import { createEventHandlers } from '../../handlers/eventHandlers'

const EventPage = () => {
  const { t } = useTranslation()
  const { items, state, error, create, update, remove } = useEvents()

  const { handleCreate, handleEdit, handleDelete, handleStatusChange } =
    useMemo(
      () => createEventHandlers({ create, update, remove }, t),
      [create, update, remove, t]
    )

  return (
    <div className="page">
      <Header />
      <section className="panel">
        <Panel error={error} handleCreate={handleCreate} state={state} />
        <Table
          items={items}
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
