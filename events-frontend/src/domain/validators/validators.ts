import i18n from '../../utils/i18n'
import type { EventCreate } from '../entities/event'

function isValidDate(date: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
  if (!match) return false

  const year = Number(match[1])
  return year >= 1900 && year <= 2999
}

export function validateEvent(input: EventCreate): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!input.title.trim()) errors.title = i18n.t('common.validationRequired')
  if (!input.startDate) errors.startDate = i18n.t('common.validationRequired')
  if (!input.endDate) errors.endDate = i18n.t('common.validationRequired')
  if (input.price == null || Number.isNaN(input.price))
    errors.price = i18n.t('common.validationRequired')
  if (!input.status) errors.status = i18n.t('common.validationRequired')

  if (input.startDate && input.endDate) {
    if (!isValidDate(input.startDate) || !isValidDate(input.endDate)) {
      errors.startDate = i18n.t('common.validationInvalidDate')
      errors.endDate = i18n.t('common.validationInvalidDate')
    }
    const s = new Date(input.startDate).getTime()
    const e = new Date(input.endDate).getTime()
    if (!(e > s)) errors.endDate = i18n.t('common.validationEndAfterStart')
  }

  if (input.price <= 0) errors.price = i18n.t('common.validationPricePositive')

  return errors
}
