import { http } from './http'
import type { Event, EventCreate, EventUpdate } from '../domain/event'

export const eventsService = {
  async list(): Promise<Event[]> {
    const res = await http.get('/events')
    return res.data
  },

  async get(id: number): Promise<Event> {
    const res = await http.get(`/events/${id}`)
    return res.data
  },

  async create(payload: EventCreate): Promise<Event> {
    const res = await http.post('/events', payload)
    return res.data
  },

  async edit(id: number, payload: EventUpdate): Promise<Event> {
    const res = await http.put(`/events/${id}`, payload)
    return res.data
  },

  async delete(id: number): Promise<void> {
    await http.delete(`/events/${id}`)
  },

  async update(id: number, payload: EventUpdate): Promise<Event> {
    return this.edit(id, payload)
  },

  async remove(id: number): Promise<void> {
    await this.delete(id)
  },
}
