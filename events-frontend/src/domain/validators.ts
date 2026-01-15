import type { EventCreate } from './event'

export function validateEvent(input: EventCreate): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!input.title.trim()) errors.title = 'Title is required.'

  if (!input.startDate) errors.startDate = 'Start date is required.'
  if (!input.endDate) errors.endDate = 'End date is required.'

  if (input.startDate && input.endDate) {
    const s = new Date(input.startDate).getTime()
    const e = new Date(input.endDate).getTime()
    if (!(e > s)) errors.endDate = 'End date must be after start date.'
  }

  if (input.price == null || Number.isNaN(input.price))
    errors.price = 'Price is required.'
  else if (input.price <= 0) errors.price = 'Price must be > 0.'
  if (!input.status) errors.status = 'Status is required.'
  //   if(!input.status) not oneOf EventStauts -> erro

  return errors
}
