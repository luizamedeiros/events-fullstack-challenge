import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TableStateTag } from '../Table/TableStateTag'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

interface PanelProps {
  handleCreate: () => void
  t: (key: string) => string
  state: string
  error: string | null
}

export const Panel = ({ handleCreate, t, state, error }: PanelProps) => {
  return (
    <div className="panel-header">
      <div className="panel-header-row">
        <h2>{t('common.registeredEvents')}</h2>
        <button className="btn primary" onClick={handleCreate}>
          <FontAwesomeIcon icon={faPlus} />
          {t('common.newEvent')}
        </button>
      </div>
      <TableStateTag state={state} error={error} t={t} />
    </div>
  )
}
