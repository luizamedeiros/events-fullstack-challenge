import { describe, it, expect } from 'vitest'
import { validateEvent } from '../src/domain/validators/validators'

describe('Event field validators', () => {
  it('accepts a valid event', () => {
    const errors = validateEvent({
      title: 'Valid Event',
      startDate: '2025-08-08',
      endDate: '2025-10-11',
      price: 100,
      status: 'STARTED',
    })
    expect(Object.keys(errors)).toHaveLength(0)
  })

  it('rejects an event with missing required fields', () => {
    const errors = validateEvent({
      title: '',
      startDate: '2025-10-10',
      endDate: '2025-10-11',
      price: 100,
      status: 'STARTED',
    })
    expect(errors.title).toBeTruthy()
  })

  it('rejects an event with end date before start date', () => {
    const errors = validateEvent({
      title: 'Valid Event',
      startDate: '2025-10-10',
      endDate: '2025-10-09',
      price: 100,
      status: 'STARTED',
    })
    expect(errors.endDate).toBeTruthy()
  })

  it('rejects an event with price = 0', () => {
    const errors = validateEvent({
      title: 'Valid Event',
      startDate: '2025-10-10',
      endDate: '2025-10-11',
      price: 0,
      status: 'STARTED',
    })
    expect(errors.price).toBeTruthy()
  })

  it('rejects an event with price < 0', () => {
    const errors = validateEvent({
      title: 'Valid Event',
      startDate: '2025-10-10',
      endDate: '2025-10-11',
      price: -1,
      status: 'STARTED',
    })
    expect(errors.price).toBeTruthy()
  })
})
