import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { Event } from '../../domain/entities/event'

interface IconButtonProps {
  event: Event
  onEdit?: (event: Event) => void
  onDelete?: (event: Event) => void
}
export const IconButton = ({ onDelete, onEdit, event }: IconButtonProps) => {
  const handleOnClickAction = onDelete
    ? () => onDelete && onDelete(event)
    : () => onEdit && onEdit(event)
  return (
    <button
      className={`icon-button${onDelete ? ' danger' : ''}`}
      onClick={handleOnClickAction}
    >
      <FontAwesomeIcon icon={onDelete ? faTrash : faPencil} />
    </button>
  )
}
