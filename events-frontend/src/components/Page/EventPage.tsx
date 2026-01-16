import Table from '../Table/Table'
import { Panel } from '../Panel/Panel'
import { Header } from '../Header/Header'
import { useEvents } from '../../hooks/useEvents'

const EventPage = () => {
  const { items, state, error, create, edit, remove, updateStatus } =
    useEvents()

  return (
    <div className="page">
      <Header />
      <section className="panel">
        <Panel error={error} handleCreate={create} state={state} />
        <Table
          items={items}
          state={state}
          onEdit={edit}
          onDelete={remove}
          onStatusChange={updateStatus}
        />
      </section>
    </div>
  )
}

export default EventPage
