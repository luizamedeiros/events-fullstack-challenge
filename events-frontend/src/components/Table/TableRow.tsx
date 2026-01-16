import {
  getStatusOptions,
  type Event,
  type EventStatus,
} from '../../domain/entities/event'
import { formatDate } from '../../utils/date'
import { useTranslation } from 'react-i18next'
import { IconButton } from './TableRowButtons'

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
  const statusOptions = getStatusOptions(t)

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
        <IconButton event={event} onEdit={onEdit} />
        <IconButton event={event} onDelete={onDelete} />
      </td>
    </tr>
  )
}

export default TableRow
