interface TableStateTagProps {
  state: string
  error: string | null
  t: (key: string) => string
}

export const TableStateTag = ({ state, error, t }: TableStateTagProps) => {
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
