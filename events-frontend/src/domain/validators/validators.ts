import i18n from '../../utils/i18n'
import type { EventCreate } from "../entities/event"

export function validateEvent(input: EventCreate): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!input.title.trim()) errors.title = i18n.t('common.validationRequired')
  if (!input.startDate) errors.startDate = i18n.t('common.validationRequired')
  if (!input.endDate) errors.endDate = i18n.t('common.validationRequired')
  if (input.price == null || Number.isNaN(input.price))
    errors.price = i18n.t('common.validationRequired')
  if (!input.status) errors.status = i18n.t('common.validationRequired')

  if (input.startDate && input.endDate) {
    const s = new Date(input.startDate).getTime()
    const e = new Date(input.endDate).getTime()
    if (!(e > s)) errors.endDate = i18n.t('common.validationEndAfterStart')
  }

  if (input.price <= 0)
    errors.price = i18n.t('common.validationPricePositive')

  return errors
}
