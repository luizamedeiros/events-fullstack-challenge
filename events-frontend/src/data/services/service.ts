import { api } from '../../config/api'
import type {
  Event,
  EventCreate,
  EventUpdate,
} from '../../domain/entities/event'

export const eventsService = {
  async list(): Promise<Event[]> {
    const res = await api.get('/events')
    return res.data
  },

  async get(id: number): Promise<Event> {
    const res = await api.get(`/events/${id}`)
    return res.data
  },

  async create(payload: EventCreate): Promise<Event> {
    const res = await api.post('/events', payload)
    return res.data
  },

  async edit(id: number, payload: EventUpdate): Promise<Event> {
    const res = await api.put(`/events/${id}`, payload)
    return res.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/events/${id}`)
  },

  async update(id: number, payload: EventUpdate): Promise<Event> {
    return this.edit(id, payload)
  },

  async remove(id: number): Promise<void> {
    await this.delete(id)
  },
}
