import {
  getStatusOptions,
  type Event,
  type EventStatus,
} from '../../domain/event'
import { formatDate } from '../../helpers/helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'

type TableRowProps = {
  event: Event
  index: number
  onEdit: (event: Event) => void
  onDelete: (event: Event) => void
  onStatusChange: (event: Event, status: EventStatus) => void
}

const TableRow = ({
  event,
  onEdit,
  onDelete,
  onStatusChange,
}: TableRowProps) => {
  const { t } = useTranslation()
  const statusOptions = useMemo(() => getStatusOptions(t), [t])

  return (
    <tr>
      <td className="title">
        {event.title}
      </td>
      <td>
        {formatDate(event.startDate)} - {formatDate(event.endDate)}
      </td>
      <td>$ {event.price}</td>
      <td>
        <select
          className="status-select"
          value={event.status}
          onChange={(e) => onStatusChange(event, e.target.value as EventStatus)}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </td>
      <td className="actions">
        <button
          className="icon-button"
          onClick={() => onEdit(event)}
          aria-label={`Edit ${event.title}`}
        >
          <FontAwesomeIcon icon={faPencil} />
        </button>
        <button
          className="icon-button danger"
          onClick={() => onDelete(event)}
          aria-label={`Cancel ${event.title}`}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </td>
    </tr>
  )
}

export default TableRow
