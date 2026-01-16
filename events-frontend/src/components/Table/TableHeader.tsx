import { useTranslation } from 'react-i18next'

const TableHeader = () => {
  const { t } = useTranslation()

  return (
    <tr className="table-header">
      <th>{t('common.title')}</th>
      <th>{t('common.date')}</th>
      <th>{t('common.price')}</th>
      <th>{t('common.status')}</th>
      <th className="actions">{t('common.actions')}</th>
    </tr>
  )
}

export default TableHeader;