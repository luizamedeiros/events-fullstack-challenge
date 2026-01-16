import { useTranslation } from 'react-i18next'
import type { EventStatus, SortValue } from '../../domain/entities/event'
import TableHeader from './TableHeader'

type TableHeaderProps = {
  search: string
  onSearchChange: (value: string) => void
  sortValue: SortValue
  onSortChange: (value: SortValue) => void
  statusFilter: EventStatus | 'ALL'
  onStatusFilterChange: (value: EventStatus | 'ALL') => void
  statusOptions: Array<{ value: EventStatus; label: string }>
}

const TableSearchAndFilters = ({
  search,
  onSearchChange,
  sortValue,
  onSortChange,
  statusFilter,
  onStatusFilterChange,
  statusOptions,
}: TableHeaderProps) => {
  const { t } = useTranslation()
  const sortLabelMap = {
    'startDate-asc': t('common.sortDateAsc'),
    'startDate-desc': t('common.sortDateDesc'),
    'title-asc': t('common.sortTitleAsc'),
    'title-desc': t('common.sortTitleDesc'),
    'price-asc': t('common.sortPriceAsc'),
    'price-desc': t('common.sortPriceDesc'),
  }

  return (
    <thead>
      <tr className="table-controls-row">
        <th colSpan={5}>
          <div className="table-controls">
            <label className="control search">
              <span>{t('common.search')}</span>
              <input
                type="search"
                placeholder={t('common.searchByTitle')}
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
              />
            </label>
            <label className="control">
              <span>{t('common.sort')}</span>
              <select
                value={sortValue}
                onChange={(event) =>
                  onSortChange(event.target.value as SortValue)
                }
              >
                {Object.entries(sortLabelMap).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="control">
              <span>{t('common.status')}</span>
              <select
                value={statusFilter}
                onChange={(event) =>
                  onStatusFilterChange(
                    event.target.value as EventStatus | 'ALL'
                  )
                }
              >
                <option value="ALL">{t('common.all')}</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </th>
      </tr>
      <TableHeader />
    </thead>
  )
}

export default TableSearchAndFilters
