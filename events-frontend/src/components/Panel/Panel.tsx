import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import { TableStateTag } from '../Table/TableStateTag'


interface PanelProps {
  handleCreate: () => void
  state: string
  error: string | null
}

export const Panel = ({ handleCreate, state, error }: PanelProps) => {
  const { t } = useTranslation()
  return (
    <div className="panel-header">
      <div className="panel-header-row">
        <h2>{t('common.registeredEvents')}</h2>
        <button className="btn primary" onClick={handleCreate}>
          <FontAwesomeIcon icon={faPlus} />
          {t('common.newEvent')}
        </button>
      </div>
      <TableStateTag state={state} error={error} />
    </div>
  )
}
