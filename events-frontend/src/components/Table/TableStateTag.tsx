import { useTranslation } from 'react-i18next'

interface TableStateTagProps {
  state: string
  error: string | null
}

export const TableStateTag = ({ state, error }: TableStateTagProps) => {
  const { t } = useTranslation()
  return (
    <div className="panel-meta">
      {state === 'loading' && (
        <span className="pill">{t('common.loading')}</span>
      )}
      {error && (
        <span className="pill danger">{t('common.errorContentTable')}</span>
      )}
    </div>
  )
}
